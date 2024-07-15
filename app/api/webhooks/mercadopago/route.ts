"use server";

// https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/notifications/webhooks
import { NextRequest, NextResponse, userAgent } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createHmac } from "crypto";
import { db } from "@/lib/db";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  const body = await request
    .json()
    .then((data) => data as { data: { id: string } });

  // VALIDATE THE ORIGIN OF THE NOTIFICATION
  // Obtain the x-signature value from the header
  const xSignature = request.headers.get("x-signature")!;
  const xRequestId = request.headers.get("x-request-id")!;

  // console.log("[x-signature]", xSignature);
  // console.log("[x-request-id]", xRequestId);

  // Obtain the ts (timestamp) and v1 values from the x-signature value
  const ts = xSignature.split(",")[0].split("=")[1];
  const v1 = xSignature.split(",")[1].split("=")[1];

  // Extract the "data.id" from the query params
  const queryString = "?" + request.url.split("?")[1];
  const params = new URLSearchParams(queryString);
  const dataId = params.get("data.id");
  const type = params.get("type");

  // Obtain the secret key for the user/application from Mercadopago developers site
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET!;

  // Generate the manifest string
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  // Create an HMAC signature defining the hash type and the key as a byte array
  const hmac = createHmac("sha256", secret).update(manifest).digest("hex");

  if (v1 !== hmac) {
    console.log("[ERROR]", "Invalid signature");
    // return Response.json({ success: false });
    return NextResponse.json({ error: "Invalid signature" }, { status: 500 });
  }

  console.log("[SUCCESS]", "Signature is valid!!!", body.data.id);

  const payment = await new Payment(client).get({ id: body.data.id });
  if (!payment) return new NextResponse("Internal Error", { status: 500 });

  //   payment_id	ID (identificador) del pago de Mercado Pago.
  // status	Status del pago. Por ejemplo: approved para un pago aprobado o pending para un pago pendiente.
  // external_reference	Monto enviado al crear la preferencia de pago.
  // merchant_order_id	ID (identificador) de la orden de pago generada en Mercado Pago.

  console.log("[PAYMENT]", payment);

  // Save to database

  const userId = payment.metadata.user_id;
  const courseId = payment.metadata.course_id;

  console.log("[Payment STATUS]:", payment.status);
  console.log("userId", payment.metadata.userId);
  console.log("courseId", payment.metadata.courseId);

  if (!userId || !courseId)
    return new NextResponse("Webhook error. Missing metadata", { status: 400 });

  if (payment.status == "approved") {
    console.log("saving...");
    let customer = await db.customer.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!customer) {
      const newCustomer = await db.customer.create({
        data: {
          userId: userId,
          customerId: payment?.payer?.id!,
        },
      });
    }

    if (customer?.customerId == "free") {
      const updateCustomer = await db.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          customerId: payment?.payer?.id!,
        },
      });
    }

    const newPurchase = await db.purchase.create({
      data: {
        userId: userId,
        courseId: courseId,
      },
    });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

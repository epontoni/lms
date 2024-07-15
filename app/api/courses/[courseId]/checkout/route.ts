import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { redirect } from "next/navigation";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) return new NextResponse("Course not found", { status: 404 });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) return new NextResponse("Already purchased", { status: 400 });

    if (course.price == 0) {
      let customer = await db.customer.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!customer) {
        const newCustomer = await db.customer.create({
          data: {
            userId: user.id,
            customerId: "free",
          },
        });
      }

      const newPurchase = await db.purchase.create({
        data: {
          userId: user.id,
          courseId: params.courseId,
        },
      });

      return redirect(`/course/${params.courseId}`);
    }

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: `Course ${course.id}`,
            title: `${course.title}`,
            quantity: 1,
            currency_id: "ARS",
            unit_price: Number(course.price),
          },
        ],
        metadata: {
          userId: user.id,
          courseId: params.courseId,
        },
        binary_mode: true,
        // redirigir al comprador al finalizar el proceso de pago https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/checkout-customization/user-interface/redirection
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}`,
        },
        auto_return: "approved", // Tras aprobado el pago, redirige al usuario automáticamente tras 40s
        // marketplace: "MP-Marketplace",
        // marketplace_fee: 1,
      },
    });

    //   redirect(preference.sandbox_init_point!); // Pruebas
    // redirect(preference.init_point!); // Producción
    if (!preference) return new NextResponse("Internal Error", { status: 500 });
    return NextResponse.json({ init_point: preference.init_point });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

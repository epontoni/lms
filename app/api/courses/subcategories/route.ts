import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { newSubCategory, categotyId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subcategory = await db.subCategory.create({
      data: {
        name: newSubCategory,
        categoryId: categotyId,
      },
    });

    if (subcategory) {
      return NextResponse.json(subcategory);
    }
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

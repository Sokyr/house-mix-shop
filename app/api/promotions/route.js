import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const promotions = await prisma.homeBanner.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(promotions);
  } catch (error) {
    console.error("PROMOTIONS GET ERROR:", error);

    return NextResponse.json(
      { error: "Не вдалося завантажити акції" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const promotion = await prisma.homeBanner.create({
      data: {
        title: body.title || "",
        subtitle: body.subtitle || "",
        image: body.image || "",
        buttonText: body.buttonText || "",
        buttonLink: body.buttonLink || "/catalog",
        sortOrder: Number(body.sortOrder) || 0,
        isActive: body.isActive !== false,
        productIds: JSON.stringify(body.productIds || []),
        promoPrice: Number(body.promoPrice) || 0,
      },
    });

    return NextResponse.json(promotion);
  } catch (error) {
    console.error("PROMOTIONS POST ERROR:", error);

    return NextResponse.json(
      { error: "Не вдалося створити акцію" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { error: "Невірний ID акції" },
        { status: 400 }
      );
    }

    const promotion = await prisma.homeBanner.update({
      where: { id },
      data: {
        title: body.title ?? "",
        subtitle: body.subtitle ?? "",
        image: body.image ?? "",
        buttonText: body.buttonText ?? "",
        buttonLink: body.buttonLink ?? "/catalog",
        sortOrder: Number(body.sortOrder) || 0,
        isActive: body.isActive !== false,
        productIds: JSON.stringify(body.productIds || []),
        promoPrice: Number(body.promoPrice) || 0,
      },
    });

    return NextResponse.json(promotion);
  } catch (error) {
    console.error("PROMOTIONS PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Не вдалося оновити акцію" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { error: "Невірний ID акції" },
        { status: 400 }
      );
    }

    await prisma.homeBanner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PROMOTIONS DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Не вдалося видалити акцію" },
      { status: 500 }
    );
  }
}
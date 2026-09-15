import { prisma } from "../../../lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const product = await prisma.product.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!product) {
        return Response.json(
          { error: "Товар не знайдено" },
          { status: 404 }
        );
      }

      return Response.json(product);
    }

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(products);
  } catch (error) {
    console.error("PRODUCTS GET ERROR:", error);

    return Response.json(
      { error: "Не вдалося отримати товари" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: Number(body.price),
        description: body.description || "",
        image: body.image || "",
      },
    });

    return Response.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    return Response.json(
      { error: "Помилка при додаванні товару" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();

    const product = await prisma.product.update({
      where: {
        id: Number(body.id),
      },
      data: {
        name: body.name,
        price: Number(body.price),
        description: body.description || "",
        image: body.image || "",
      },
    });

    return Response.json(product);
  } catch (error) {
    console.error("PRODUCT UPDATE ERROR:", error);

    return Response.json(
      { error: "Помилка при редагуванні товару" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("PRODUCT DELETE ERROR:", error);

    return Response.json(
      { error: "Помилка при видаленні товару" },
      { status: 500 }
    );
  }
}
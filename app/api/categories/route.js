import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    let categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });

    if (categories.length === 0) {
      await prisma.category.createMany({
        data: [
          { name: "Посуд" },
          { name: "Організація простору" },
        ],
        skipDuplicates: true,
      });

      categories = await prisma.category.findMany({
        orderBy: {
          id: "asc",
        },
      });
    }

    return Response.json(categories);
  } catch (error) {
    console.error("CATEGORIES GET ERROR:", error);

    return Response.json(
      { error: "Не вдалося отримати категорії" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();

    if (!name) {
      return Response.json(
        { error: "Вкажи назву категорії" },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({
      where: {
        name,
      },
    });

    if (existing) {
      return Response.json(
        { error: "Така категорія вже існує" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
data: {
  name,
  image: body.image?.trim() || "",
},    });

    return Response.json(category, { status: 201 });
  } catch (error) {
    console.error("CATEGORIES POST ERROR:", error);

    return Response.json(
      { error: "Не вдалося додати категорію" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return Response.json(
        { error: "Не вказано ID категорії" },
        { status: 400 }
      );
    }

    const productsCount = await prisma.product.count({
      where: {
        categoryId: id,
      },
    });

    if (productsCount > 0) {
      return Response.json(
        {
          error:
            "Не можна видалити категорію, у якій є товари",
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("CATEGORIES DELETE ERROR:", error);

    return Response.json(
      { error: "Не вдалося видалити категорію" },
      { status: 500 }
    );
  }
}
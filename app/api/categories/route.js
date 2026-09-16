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
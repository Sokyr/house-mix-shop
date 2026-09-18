import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.homeSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.homeSettings.create({
        data: {
          id: 1,
        },
      });
    }

    const banners = await prisma.homeBanner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json({
      settings,
      banners,
    });
  } catch (error) {
    console.error("HOME GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Не вдалося завантажити головну сторінку",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    const settings = await prisma.homeSettings.upsert({
      where: {
        id: 1,
      },

      update: {
        heroImage: body.heroImage ?? "",
        title: body.title ?? "House Mix",
        subtitle:
          body.subtitle ?? "Все для затишку вашого дому",
        buttonText:
          body.buttonText ?? "Перейти до каталогу",
        buttonLink:
          body.buttonLink ?? "/catalog",
        showCategories:
          body.showCategories ?? true,
        showPromotions:
          body.showPromotions ?? true,
        showBestSellers:
          body.showBestSellers ?? true,
      },

      create: {
        id: 1,
        heroImage: body.heroImage ?? "",
        title: body.title ?? "House Mix",
        subtitle:
          body.subtitle ?? "Все для затишку вашого дому",
        buttonText:
          body.buttonText ?? "Перейти до каталогу",
        buttonLink:
          body.buttonLink ?? "/catalog",
        showCategories:
          body.showCategories ?? true,
        showPromotions:
          body.showPromotions ?? true,
        showBestSellers:
          body.showBestSellers ?? true,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("HOME PUT ERROR:", error);

    return NextResponse.json(
      {
        error: "Не вдалося зберегти налаштування",
      },
      {
        status: 500,
      }
    );
  }
}
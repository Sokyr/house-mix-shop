import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const [settings, banners] = await Promise.all([
      prisma.homeSettings.findUnique({
        where: { id: 1 },
        select: {
          id: true,
          heroImage: true,
          title: true,
          subtitle: true,
          buttonText: true,
          buttonLink: true,
          showCategories: true,
          showPromotions: true,
          showBestSellers: true,
          updatedAt: true,
        },
      }),

      prisma.homeBanner.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          title: true,
          subtitle: true,
          image: true,
          buttonText: true,
          buttonLink: true,
          sortOrder: true,
          isActive: true,
          productIds: true,
          promoPrice: true,
          createdAt: true,
        },
      }),
    ]);

    let finalSettings = settings;

    if (!finalSettings) {
      finalSettings = await prisma.homeSettings.create({
        data: {
          id: 1,
        },
      });
    }

    return NextResponse.json({
      settings: finalSettings,
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
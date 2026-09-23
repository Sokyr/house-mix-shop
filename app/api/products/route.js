import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { prisma } from "../../../lib/prisma";

async function saveImageToFile(image, productId) {
  if (!image || !image.startsWith("data:image/")) {
    return image || "";
  }

  const match = image.match(
    /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/
  );

  if (!match) {
    throw new Error("Невірний формат зображення");
  }

  let extension = match[1].toLowerCase();

  if (extension === "jpeg") {
    extension = "jpg";
  }

  if (extension === "svg+xml") {
    extension = "svg";
  }

  const fileName = `${productId}.${extension}`;
  const folderPath = path.join(
    process.cwd(),
    "public",
    "products"
  );
  const filePath = path.join(folderPath, fileName);

  await fs.mkdir(folderPath, { recursive: true });

  const buffer = Buffer.from(match[2], "base64");

  await fs.writeFile(filePath, buffer);

  return `/products/${fileName}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
   const id = searchParams.get("id");
const home = searchParams.get("home") === "1";
const search = searchParams.get("search")?.trim() || "";
const bestSellers = searchParams.get("bestSellers") === "1";
const category = searchParams.get("category");
    if (id) {
      const product = await prisma.product.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          category: true,
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Товар не знайдено" },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    }

   const products = await prisma.product.findMany({
  where: {
    ...(bestSellers ? { isBestSeller: true } : {}),
    ...(category ? { categoryId: Number(category) } : {}),
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  },

  orderBy: {
    createdAt: "desc",
  },

  ...(home && !bestSellers && !category && !search
    ? { take: 12 }
    : {}),

  select: {
    id: true,
    name: true,
    price: true,
    description: true,
    image: true,
    createdAt: true,
    categoryId: true,
    isBestSeller: true,
  },
});    return NextResponse.json(products);
  } catch (error) {
    console.error("PRODUCTS GET ERROR:", error);

    return NextResponse.json(
      { error: "Не вдалося отримати товари" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json(
        { error: "Заповніть назву, ціну та категорію" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: Number(body.price),
        description: body.description || "",
        image: "",
        categoryId: Number(body.categoryId),
        isBestSeller: body.isBestSeller === true,
      },
    });

    let imagePath = "";

    if (body.image) {
      imagePath = await saveImageToFile(
        body.image,
        product.id
      );

      if (imagePath) {
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            image: imagePath,
          },
        });
      }
    }

    const finalProduct = await prisma.product.findUnique({
      where: {
        id: product.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(finalProduct, {
      status: 201,
    });
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Помилка при додаванні товару" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();

    if (!body.id || !body.name || !body.price || !body.categoryId) {
      return NextResponse.json(
        { error: "Заповніть усі обов'язкові поля" },
        { status: 400 }
      );
    }

    const productId = Number(body.id);

    const oldProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        image: true,
      },
    });

    let imagePath = oldProduct?.image || "";

    if (body.image && body.image.startsWith("data:image/")) {
      imagePath = await saveImageToFile(
        body.image,
        productId
      );
    }

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: body.name,
        price: Number(body.price),
        description: body.description || "",
        image: imagePath,
        categoryId: Number(body.categoryId),
        isBestSeller: body.isBestSeller === true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PRODUCT UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Помилка при редагуванні товару" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Не вказано товар" },
        { status: 400 }
      );
    }

    const productId = Number(body.id);

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        image: true,
      },
    });

    if (product?.image?.startsWith("/products/")) {
      const fileName = path.basename(product.image);
      const filePath = path.join(
        process.cwd(),
        "public",
        "products",
        fileName
      );

      try {
        await fs.unlink(filePath);
      } catch {
        // Файл вже відсутній — нічого страшного
      }
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("PRODUCT DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Помилка при видаленні товару" },
      { status: 500 }
    );
  }
}
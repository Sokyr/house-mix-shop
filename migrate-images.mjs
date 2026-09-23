import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const folder = path.join(process.cwd(), "public", "products");
await fs.mkdir(folder, { recursive: true });

const products = await prisma.product.findMany({
  where: {
    image: {
      startsWith: "data:image/",
    },
  },
  select: {
    id: true,
    name: true,
    image: true,
  },
});

console.log(`Знайдено BASE64 товарів: ${products.length}`);

let done = 0;

for (const product of products) {
  try {
    const match = product.image.match(
      /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/
    );

    if (!match) {
      console.log(`ПРОПУСК ${product.id}: невірний формат`);
      continue;
    }

    let extension = match[1].toLowerCase();

    if (extension === "jpeg") extension = "jpg";
    if (extension === "svg+xml") extension = "svg";

    const fileName = `${product.id}.${extension}`;
    const filePath = path.join(folder, fileName);

    const buffer = Buffer.from(match[2], "base64");

    await fs.writeFile(filePath, buffer);

    const check = await fs.stat(filePath);

    if (check.size === 0) {
      throw new Error("Файл записаний порожнім");
    }

    const imagePath = `/products/${fileName}`;

    await prisma.product.update({
      where: { id: product.id },
      data: { image: imagePath },
    });

    done++;

    console.log(`OK ${product.id} | ${product.name} | ${Math.round(check.size / 1024)} KB`);
  } catch (error) {
    console.log(`ПОМИЛКА ${product.id} | ${error.message}`);
  }
}

console.log(`ГОТОВО: перенесено ${done} з ${products.length}`);

await prisma.$disconnect();

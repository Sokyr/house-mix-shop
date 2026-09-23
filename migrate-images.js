require("dotenv/config");

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL не знайдено");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const productsDir = path.join(process.cwd(), "public", "products");

async function main() {
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }

  const products = await prisma.product.findMany({
    select: {
      id: true,
      image: true,
    },
  });

  console.log(`Знайдено товарів: ${products.length}`);

  let migrated = 0;
  let skipped = 0;

  for (const product of products) {
    const image = product.image || "";

    if (!image.startsWith("data:image/")) {
      console.log(`Товар ${product.id}: пропущено — це вже не Base64`);
      skipped++;
      continue;
    }

    const match = image.match(
      /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/
    );

    if (!match) {
      console.log(`Товар ${product.id}: не вдалося прочитати фото`);
      continue;
    }

    let extension = match[1].toLowerCase();

    if (extension === "jpeg") {
      extension = "jpg";
    }

    if (extension === "svg+xml") {
      extension = "svg";
    }

    const fileName = `${product.id}.${extension}`;
    const filePath = path.join(productsDir, fileName);
    const publicPath = `/products/${fileName}`;

    const buffer = Buffer.from(match[2], "base64");

    fs.writeFileSync(filePath, buffer);

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        image: publicPath,
      },
    });

    console.log(
      `Товар ${product.id}: фото перенесено → ${publicPath}`
    );

    migrated++;
  }

  console.log("");
  console.log("ГОТОВО");
  console.log(`Перенесено: ${migrated}`);
  console.log(`Пропущено: ${skipped}`);
}

main()
  .catch((error) => {
    console.error("ПОМИЛКА:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
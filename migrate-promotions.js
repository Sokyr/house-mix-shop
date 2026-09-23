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

const promotionsDir = path.join(
  process.cwd(),
  "public",
  "promotions"
);

async function main() {
  if (!fs.existsSync(promotionsDir)) {
    fs.mkdirSync(promotionsDir, { recursive: true });
  }

  const promotions = await prisma.homeBanner.findMany({
    select: {
      id: true,
      image: true,
    },
  });

  console.log(`Знайдено акцій: ${promotions.length}`);

  let migrated = 0;
  let skipped = 0;

  for (const promotion of promotions) {
    const image = promotion.image || "";

    if (!image.startsWith("data:image/")) {
      console.log(
        `Акція ${promotion.id}: пропущено — це вже не Base64`
      );
      skipped++;
      continue;
    }

    const match = image.match(
      /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/
    );

    if (!match) {
      console.log(
        `Акція ${promotion.id}: не вдалося прочитати фото`
      );
      continue;
    }

    let extension = match[1].toLowerCase();

    if (extension === "jpeg") {
      extension = "jpg";
    }

    if (extension === "svg+xml") {
      extension = "svg";
    }

    const fileName = `${promotion.id}.${extension}`;
    const filePath = path.join(promotionsDir, fileName);
    const publicPath = `/promotions/${fileName}`;

    const buffer = Buffer.from(match[2], "base64");

    fs.writeFileSync(filePath, buffer);

    await prisma.homeBanner.update({
      where: {
        id: promotion.id,
      },
      data: {
        image: publicPath,
      },
    });

    console.log(
      `Акція ${promotion.id}: фото перенесено → ${publicPath}`
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
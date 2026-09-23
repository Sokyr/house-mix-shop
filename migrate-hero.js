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

const heroDir = path.join(
  process.cwd(),
  "public",
  "hero"
);

async function main() {
  if (!fs.existsSync(heroDir)) {
    fs.mkdirSync(heroDir, { recursive: true });
  }

  const settings = await prisma.homeSettings.findUnique({
    where: {
      id: 1,
    },
    select: {
      id: true,
      heroImage: true,
    },
  });

  if (!settings) {
    console.log("HomeSettings не знайдено");
    return;
  }

  const image = settings.heroImage || "";

  if (!image.startsWith("data:image/")) {
    console.log("heroImage вже не Base64:");
    console.log(image);
    return;
  }

  const match = image.match(
    /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/
  );

  if (!match) {
    throw new Error("Не вдалося прочитати heroImage");
  }

  let extension = match[1].toLowerCase();

  if (extension === "jpeg") {
    extension = "jpg";
  }

  if (extension === "svg+xml") {
    extension = "svg";
  }

  const fileName = `hero.${extension}`;
  const filePath = path.join(heroDir, fileName);
  const publicPath = `/hero/${fileName}`;

  const buffer = Buffer.from(match[2], "base64");

  fs.writeFileSync(filePath, buffer);

  await prisma.homeSettings.update({
    where: {
      id: 1,
    },
    data: {
      heroImage: publicPath,
    },
  });

  console.log(`Фото головної перенесено → ${publicPath}`);
  console.log("ГОТОВО");
}

main()
  .catch((error) => {
    console.error("ПОМИЛКА:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
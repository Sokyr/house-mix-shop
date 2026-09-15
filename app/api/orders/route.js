import { prisma } from "../../../lib/prisma";

async function sendTelegramMessage(order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("Telegram не налаштований");
    return;
  }

  let products = [];

  try {
    products = JSON.parse(order.products || "[]");
  } catch {
    products = [];
  }

  const productList = products
    .map(
      (product) =>
        `• ${product.name} — ${product.quantity} шт. × ${product.price} грн`
    )
    .join("\n");

  const message = `
🔔 НОВЕ ЗАМОВЛЕННЯ!

🧾 №${order.id}

👤 ${order.name}
📞 ${order.phone}

📍 ${order.city}
🏠 ${order.address}

🚚 ${order.delivery}
💳 ${order.payment}

🛍️ Товари:
${productList}

💰 РАЗОМ: ${order.total} грн

📦 Статус: ${order.status}
`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      }
    );

    if (!response.ok) {
      console.error("TELEGRAM ERROR:", await response.text());
    }
  } catch (error) {
    console.error("TELEGRAM ERROR:", error);
  }
}

async function sendCustomerTelegramMessage(order, message) {
  if (!order.telegramChatId) return;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  try {
    await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: order.telegramChatId,
          text: message,
        }),
      }
    );
  } catch (error) {
    console.error("CUSTOMER TELEGRAM ERROR:", error);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.city) {
      return Response.json(
        {
          error: "Заповніть ім'я, телефон та місто",
        },
        { status: 400 }
      );
    }

    const total = Number(body.total);

    if (!Number.isFinite(total) || total < 0) {
      return Response.json(
        {
          error: "Неправильна сума замовлення",
        },
        { status: 400 }
      );
    }

    const products = Array.isArray(body.products)
      ? body.products
      : [];

    const order = await prisma.order.create({
      data: {
        name: String(body.name),
        phone: String(body.phone),
        city: String(body.city),
        address: String(body.address || ""),
        delivery: String(body.delivery || ""),
        payment: String(body.payment || ""),
        total,
        products: JSON.stringify(products),
        telegramChatId: body.telegramChatId
          ? String(body.telegramChatId)
          : null,
      },
    });

    // Telegram не повинен блокувати створення замовлення
    await sendTelegramMessage(order);

    return Response.json(order, {
      status: 201,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не вдалося створити замовлення",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    const phone = searchParams.get("phone");

    if (id && phone) {
      const order = await prisma.order.findFirst({
        where: {
          id: Number(id),
          phone,
        },
      });

      if (!order) {
        return Response.json(
          {
            error:
              "Замовлення не знайдено. Перевірте номер замовлення та телефон.",
          },
          { status: 404 }
        );
      }

      return Response.json(order);
    }

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(orders);
  } catch (error) {
    console.error("ORDERS GET ERROR:", error);

    return Response.json(
      {
        error: "Не вдалося отримати замовлення",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();

    const order = await prisma.order.update({
      where: {
        id: Number(body.id),
      },
      data: {
        status: String(body.status),
      },
    });

    return Response.json(order);
  } catch (error) {
    console.error("STATUS ERROR:", error);

    return Response.json(
      {
        error: "Не вдалося змінити статус",
      },
      { status: 500 }
    );
  }
}

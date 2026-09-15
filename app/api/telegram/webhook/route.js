import { prisma } from "../../../../lib/prisma";

export async function POST(request) {
  try {
    const update = await request.json();

    const message = update.message;

    if (!message) {
      return Response.json({ ok: true });
    }

    const chatId = message.chat?.id;
    const text = message.text || "";

    if (!chatId) {
      return Response.json({ ok: true });
    }

    if (text.startsWith("/start")) {
      const parts = text.split(" ");
      const orderId = parts[1];

      if (orderId) {
        const order = await prisma.order.update({
          where: {
            id: Number(orderId),
          },
          data: {
            telegramChatId: String(chatId),
          },
        });

        await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: chatId,
              text:
                `✅ Telegram підключено до замовлення №${order.id}!\n\n` +
                `Тепер ви отримуватимете повідомлення про зміну статусу замовлення.`,
            }),
          }
        );
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("TELEGRAM WEBHOOK ERROR:", error);

    return Response.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}
import { prisma } from "../../../lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const chatId = searchParams.get("chat_id");
    const orderId = searchParams.get("order_id");

    if (!chatId || !orderId) {
      return new Response("Missing data", {
        status: 400,
      });
    }

    const order = await prisma.order.update({
      where: {
        id: Number(orderId),
      },
      data: {
        telegramChatId: chatId,
      },
    });

    return Response.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("TELEGRAM LINK ERROR:", error);

    return Response.json(
      {
        error: "Не вдалося прив'язати Telegram",
      },
      {
        status: 500,
      }
    );
  }
}
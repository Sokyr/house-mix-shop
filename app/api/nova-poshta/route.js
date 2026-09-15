export async function POST(request) {
  try {
    const apiKey = process.env.NOVA_POSHTA_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Не знайдено API ключ Нової пошти" },
        { status: 500 }
      );
    }

    const body = await request.json();

    let calledMethod = "";
    let methodProperties = {};

    if (body.action === "cities") {
      calledMethod = "getCities";
      methodProperties = {
        FindByString: body.query || ""
      };
    } else if (body.action === "warehouses") {
      calledMethod = "getWarehouses";
      methodProperties = {
        CityRef: body.cityRef
      };
    } else {
      return Response.json(
        { error: "Невідома дія" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.novaposhta.ua/v2.0/json/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          apiKey,
          modelName: "Address",
          calledMethod,
          methodProperties
        })
      }
    );

    const data = await response.json();

    if (!data.success) {
      return Response.json(
        {
          error:
            data.errors?.join(", ") ||
            "Помилка Нової пошти"
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      data: data.data || []
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Помилка сервера Нової пошти" },
      { status: 500 }
    );
  }
}

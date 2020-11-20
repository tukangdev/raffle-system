import { rest } from "msw";
import { setupServer } from "msw/node";
import fetch from "node-fetch";
import { SETTINGS_TEXT } from "../const";
import { Config } from "../types";

const mockConfig: Config = {
  bgColor: "some color",
  bgImage: "some url",
  cardBgColor: "some color",
  cardLogoImage: "some url",
};

type Body = {
  value: string;
};

const server = setupServer(
  rest.get("http://test.com/api/raffle/config", (req, res, ctx) => {
    return res(ctx.json({ data: mockConfig }), ctx.status(200));
  }),
  rest.put("http://test.com/api/raffle/config/bgColor", (req, res, ctx) => {
    const { value } = req.body as Body;
    return res(
      ctx.json({
        data: { ...mockConfig, bgColor: value },
        message: `Updated ${SETTINGS_TEXT["bgColor"]}!`,
      }),
      ctx.status(200)
    );
  }),
  rest.put("http://test.com/api/raffle/config/bgImage", (req, res, ctx) => {
    const { value } = req.body as Body;
    return res(
      ctx.json({
        data: { ...mockConfig, bgImage: value },
        message: `Updated ${SETTINGS_TEXT["bgImage"]}!`,
      }),
      ctx.status(200)
    );
  }),
  rest.put("http://test.com/api/raffle/config/cardBgColor", (req, res, ctx) => {
    const { value } = req.body as Body;
    return res(
      ctx.json({
        data: { ...mockConfig, cardBgColor: value },
        message: `Updated ${SETTINGS_TEXT["cardBgColor"]}!`,
      }),
      ctx.status(200)
    );
  }),
  rest.put(
    "http://test.com/api/raffle/config/cardLogoImage",
    (req, res, ctx) => {
      const { value } = req.body as Body;
      return res(
        ctx.json({
          data: { ...mockConfig, cardLogoImage: value },
          message: `Updated ${SETTINGS_TEXT["cardLogoImage"]}!`,
        }),
        ctx.status(200)
      );
    }
  )
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("/api/raffle/config", () => {
  test("get", async () => {
    const res = await fetch("http://test.com/api/raffle/config");
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual({ data: mockConfig });
  });

  test("put bgColor", async () => {
    const res = await fetch("http://test.com/api/raffle/config/bgColor", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: "another color" }),
    });
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual({
      data: {
        bgColor: "another color",
        bgImage: "some url",
        cardBgColor: "some color",
        cardLogoImage: "some url",
      },
      message: "Updated background color!",
    });
  });
  test("put bgImage", async () => {
    const res = await fetch("http://test.com/api/raffle/config/bgImage", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: "another url" }),
    });
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual({
      data: {
        bgColor: "some color",
        bgImage: "another url",
        cardBgColor: "some color",
        cardLogoImage: "some url",
      },
      message: "Updated background image!",
    });
  });
  test("put cardBgColor", async () => {
    const res = await fetch("http://test.com/api/raffle/config/cardBgColor", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: "another color" }),
    });
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual({
      data: {
        bgColor: "some color",
        bgImage: "some url",
        cardBgColor: "another color",
        cardLogoImage: "some url",
      },
      message: "Updated card background color!",
    });
  });
  test("put cardLogoImage", async () => {
    const res = await fetch("http://test.com/api/raffle/config/cardLogoImage", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: "another url" }),
    });
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual({
      data: {
        bgColor: "some color",
        bgImage: "some url",
        cardBgColor: "some color",
        cardLogoImage: "another url",
      },
      message: "Updated card logo!",
    });
  });
});

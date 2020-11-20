import { rest } from "msw";
import { setupServer } from "msw/node";
import fetch from "node-fetch";

const mockNames = ["Xavi", "Nick", "Null"];

type Body = {
  name: string;
};

const server = setupServer(
  rest.get("http://test.com/api/raffle/names", (req, res, ctx) => {
    return res(ctx.json({ data: mockNames }), ctx.status(200));
  }),
  rest.post("http://test.com/api/raffle/names", (req, res, ctx) => {
    const { name } = req.body as Body;
    return res(
      ctx.json({ data: [...mockNames, name], message: `${name} added!` }),
      ctx.status(200)
    );
  }),
  rest.put("http://test.com/api/raffle/names/123", (req, res, ctx) => {
    const { name } = req.body as Body;
    return res(
      ctx.json({ data: [...mockNames, name], message: `${name} added!` }),
      ctx.status(200)
    );
  }),
  rest.delete("http://test.com/api/raffle/names/123", (req, res, ctx) => {
    return res(ctx.json({ data: [...mockNames] }), ctx.status(200));
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("/api/raffle/names", () => {
  test("get", async () => {
    const res = await fetch("http://test.com/api/raffle/names");
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual({ data: ["Xavi", "Nick", "Null"] });
  });
  test("post", async () => {
    const res = await fetch("http://test.com/api/raffle/names", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Test" }),
    });
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual({
      data: ["Xavi", "Nick", "Null", "Test"],
      message: "Test added!",
    });
  });
  test("put", async () => {
    const res = await fetch("http://test.com/api/raffle/names/123", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Test" }),
    });
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual({
      data: ["Xavi", "Nick", "Null", "Test"],
      message: "Test added!",
    });
  });
  test("delete", async () => {
    const res = await fetch("http://test.com/api/raffle/names/123", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual({
      data: ["Xavi", "Nick", "Null"],
    });
  });
});

// import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index"
import { app } from "../../../../app";

let connection: Connection;
describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance", async () => {
    await request(app).post("/api/v1/users").send({
      email: "email@test.com",
      password: "test",
      name: "Test"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
        email: "email@test.com",
        password: "test",
    });
    
    const { token } = responseToken.body;

    await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 100,
            description: "Test"
        })
        .set({
            Authorization: `Bearer ${token}`,
        });

    const response = await request(app).get("/api/v1/statements/balance")
        .set({
            Authorization: `Bearer ${token}`,
        });

    expect(response.body.balance).toEqual(100);
  });
});

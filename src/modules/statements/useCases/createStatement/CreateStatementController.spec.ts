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

  it("should be able to create a deposit", async () => {
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

    const response = await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 10,
            description: "Test"
        })
        .set({
            Authorization: `Bearer ${token}`,
        });

    expect(response.status).toEqual(201);
  });

  it("should be able to create a withdraw", async () => {
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

    const response = await request(app).post("/api/v1/statements/withdraw")
        .send({
            amount: 10,
            description: "Test"
        })
        .set({
            Authorization: `Bearer ${token}`,
        });

    expect(response.status).toEqual(201);
  });
});

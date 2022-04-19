// import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index"
import { app } from "../../../../app";

let connection: Connection;
describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      email: "email@test.com",
      password: "test",
      name: "Test"
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a user with an email already in use", async () => {
    await request(app).post("/api/v1/users").send({
      email: "email@test.com",
      password: "test",
      name: "Test"
    });

    const response = await request(app).post("/api/v1/users").send({
      email: "email@test.com",
      password: "test",
      name: "Test"
    });

    expect(response.status).toBe(400);
  });
});

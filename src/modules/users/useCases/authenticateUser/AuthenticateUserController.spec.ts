// import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index"
import { app } from "../../../../app";

let connection: Connection;
describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user", async () => {
    await request(app).post("/api/v1/users").send({
      email: "email@test.com",
      password: "test",
      name: "Test"
    });

    const response = await request(app).post("/api/v1/sessions").send({
        email: "email@test.com",
        password: "test",
    });

    expect(response.body).toHaveProperty("token");
  });
});

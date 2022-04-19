// import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index"
import { app } from "../../../../app";

let connection: Connection;
describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () => {
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

    const response = await request(app).get("/api/v1/profile")
        .set({
            Authorization: `Bearer ${token}`,
        });

    expect(response.body).toHaveProperty("id");
  });
});

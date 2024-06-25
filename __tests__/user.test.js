const server = require("../index");
const request = require("supertest");
const sequelize = require("../database.js");
const { User } = require("../models/index.js");

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log("ok");
  } catch (error) {
    console.error(error);
  }
});

afterAll(async () => {
  await User.destroy({ where: { email: "test@test.fr" } });
  await sequelize.close();
});

test("USER route -> register a user", async () => {
  let res, user;
  try {
    res = await request(server).post("/users/register").send({
      email: "test@test.fr",
      password: "Momomoooo123456",
      firstname: "Farid",
      lastname: "Tesou",
    });
    user = await User.findOne({ where: { email: "test@test.fr" } });
  } catch {
    console.error(error);
  }

  expect(res).toBeDefined;
  expect(res.status).toBe(201);
  expect(res.body.message).toBe("User n°" +user.id_user +" created: mail: test@test.fr");
});

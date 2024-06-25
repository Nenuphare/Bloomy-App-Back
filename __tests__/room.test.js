const server = require("../index");
const request = require("supertest");
const sequelize = require("../database.js");
const { User, Home, UserHome, Room } = require("../models/index.js");

let homeId;

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    // test user
    await User.create({
      email: "testo@test.fr",
      password: "Momomoooo123456",
      firstname: "Farid",
      lastname: "Tesou",
    });
    console.log("ok");
  } catch (error) {
    console.error(error);
  }
});

afterAll(async () => {
  try {
    // Remove test elements
    await UserHome.destroy({ where: { id_home: homeId } });
    await Room.destroy({ where: { id_home: homeId } });
    await Home.destroy({ where: { id_home: homeId } });
    await User.destroy({ where: { email: "testo@test.fr" } });
    await sequelize.close();
  } catch (error) {
    console.error("Error in afterAll cleanup:", error);
  }
});

describe("ROOM routes", () => {
  let token;
  let roomId;

  beforeAll(async () => {
    // Test user connexion
    const res = await request(server).post("/users/login").send({
      email: "testo@test.fr",
      password: "Momomoooo123456",
    });

    expect(res.status).toBe(200);
    token = res.body.token;

    // Home test
    const homeRes = await request(server)
      .post("/homes")
      .set("Authorization", `${token}`)
      .send({
        name: "Test Homee",
      });

    expect(homeRes.status).toBe(201);
    homeId = homeRes.body.id_home;
  });

  test("Create a room", async () => {
    const res = await request(server)
      .post("/rooms")
      .set("Authorization", `${token}`)
      .send({
        id_home: homeId,
        name: "Test Room",
      });

    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    roomId = res.body.id_room;

    expect(res.body.name).toBe("Test Room");
    expect(res.body.id_home).toBe(homeId);
  });

  test("Get all rooms from home", async () => {
    const res = await request(server)
      .get(`/rooms/homes/${homeId}`)
      .set("Authorization", `${token}`);

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Update a room", async () => {
    const res = await request(server)
      .put(`/rooms/${roomId}`)
      .set("Authorization", `${token}`)
      .send({
        name: "Updated Test Room",
      });

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated Test Room");
  });

  test("Delete a room", async () => {
    const res = await request(server)
      .delete(`/rooms/${roomId}`)
      .set("Authorization", `${token}`);

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Room deleted");
  });
});
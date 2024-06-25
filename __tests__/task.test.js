const server = require("../index");
const request = require("supertest");
const sequelize = require("../database.js");
const { User, Home, UserHome, Room, Task, Type } = require("../models/index.js");

let homeId;
let roomId;
let typeId;
let taskId;

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    
    // Create test user
    await User.create({
      email: "testoo@test.fr",
      password: "Momomoooo123456",
      firstname: "Farid",
      lastname: "Tesou",
    });
    
    // Create test type
    const type = await Type.create({
      name: "Test Type"
    });
    typeId = type.id_type;

    console.log("Setup done");
  } catch (error) {
    console.error(error);
  }
});

afterAll(async () => {
  try {
    // Clean up test elements
    await Task.destroy({ where: { id_task: taskId } });
    await UserHome.destroy({ where: { id_home: homeId } });
    await Room.destroy({ where: { id_room: roomId } });
    await Home.destroy({ where: { id_home: homeId } });
    await Type.destroy({ where: { id_type: typeId } });
    await User.destroy({ where: { email: "testoo@test.fr" } });
    await sequelize.close();
  } catch (error) {
    console.error("Error in afterAll cleanup:", error);
  }
});

describe("TASK routes", () => {
  let token;

  beforeAll(async () => {
    // Test user login
    const res = await request(server).post("/users/login").send({
      email: "testoo@test.fr",
      password: "Momomoooo123456",
    });

    expect(res.status).toBe(200);
    token = res.body.token;

    // Create test home
    const homeRes = await request(server)
      .post("/homes")
      .set("Authorization", `${token}`)
      .send({
        name: "Test Homee",
      });

    expect(homeRes.status).toBe(201);
    homeId = homeRes.body.id_home;

    // Create test room
    const roomRes = await request(server)
      .post("/rooms")
      .set("Authorization", `${token}`)
      .send({
        id_home: homeId,
        name: "Test Room",
      });

    expect(roomRes.status).toBe(201);
    roomId = roomRes.body.id_room;
  });

  test("Create a task", async () => {
    const res = await request(server)
      .post("/tasks")
      .set("Authorization", `${token}`)
      .send({
        title: "Test Task",
        id_home: homeId,
        id_room: roomId,
        id_type: typeId,
        deadline: new Date(),
        recurrence: 0
      });

    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    taskId = res.body.id_task;

    expect(res.body.title).toBe("Test Task");
    expect(res.body.id_home).toBe(homeId);
  });

  test("Get all tasks from home", async () => {
    const res = await request(server)
      .get(`/tasks/homes/${homeId}`)
      .set("Authorization", `${token}`);

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Get all tasks from room", async () => {
    const res = await request(server)
      .get(`/tasks/rooms/${roomId}`)
      .set("Authorization", `${token}`);

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Update a task", async () => {
    const res = await request(server)
      .put(`/tasks/${taskId}`)
      .set("Authorization", `${token}`)
      .send({
        title: "Updated Test Task",
        deadline: new Date()
      });

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Test Task");
  });

  test("Update task status", async () => {
    const res = await request(server)
      .patch(`/tasks/${taskId}/status`)
      .set("Authorization", `${token}`)
      .send({
        finished: true
      });

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body.finished).toBe(true);
  });

  test("Update task title", async () => {
    const res = await request(server)
      .patch(`/tasks/${taskId}`)
      .set("Authorization", `${token}`)
      .send({
        title: "Patched Test Task"
      });

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Patched Test Task");
  });

  test("Delete a task", async () => {
    const res = await request(server)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `${token}`);

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });
});
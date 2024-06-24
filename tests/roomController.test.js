const { Room, Home, UserHome } = require('../models/index');
const { createRoom, getAllRoomsFromHome } = require('../controllers/roomController');

jest.mock('../models/index');

describe('Room Controller', () => {
    let req, res, req2;

    beforeEach(() => {
        req = {
            body: {
                id_home: 1,
                name: 'Living Room'
            },
            user: {
                id_user: 1
            }
        };
        req2 = {
            body: {
                id_home: 1,
                name: 'kouizine'
            },
            user: {
                id_user: 2
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('createRoom', () => {
        it('should create a new room successfully', async () => {
            UserHome.findOne.mockResolvedValue({ id_home: 1, id_user: 1 });
            Home.findByPk.mockResolvedValue({ id_home: 1 });
            Room.create.mockResolvedValue({ id_room: 1, id_home: 1, name: 'Living Room' });

            await createRoom(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id_room: 1, id_home: 1, name: 'Living Room' });
        });

        /*it('should return 403 if user does not have permission to create a room', async () => {
            UserHome.findOne.mockResolvedValue(null);

            await createRoom(req2, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: "You don't have permission to create a room here" });
        });*/

        it("should return 400 if id_home or name is missing", async () => {
            req.body.id_home = "";
            await createRoom(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "id_home or room name cannot be empty",
            });
        });

        it('should return 404 if home is not found', async () => {
            UserHome.findOne.mockResolvedValue({ id_home: 1, id_user: 1 });
            Home.findByPk.mockResolvedValue(null);

            await createRoom(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Home not found' });
        });

        it('should return 500 if there is a server error', async () => {
            UserHome.findOne.mockResolvedValue({ id_home: 1, id_user: 1 });
            Home.findByPk.mockRejectedValue(new Error('Database error'));

            await createRoom(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create room', details: 'Database error' });
        });
    });

    describe('getAllRoomsFromHome', () => {
        let reqGetAllRooms, reqGetAllRooms2;

        beforeEach(() => {
            reqGetAllRooms = {
                params: { id_home: 1 },
                user: { id_user: 1 }
            };
            reqGetAllRooms2 = {
                params: { id_home: 1 },
                user: { id_user: 2 }
            };
        });

        it('should return all rooms of a home successfully', async () => {
            UserHome.findOne.mockResolvedValue({ id_home: 1, id_user: 1 });
            Home.findByPk.mockResolvedValue({ id_home: 1 });
            Room.findAll.mockResolvedValue([
                { id_room: 1, id_home: 1, name: 'Living Room' },
                { id_room: 2, id_home: 1, name: 'Kitchen' }
            ]);

            await getAllRoomsFromHome(reqGetAllRooms, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                { id_room: 1, id_home: 1, name: 'Living Room' },
                { id_room: 2, id_home: 1, name: 'Kitchen' }
            ]);
        });

        /*it('should return 403 if user does not have permission to get rooms of the home', async () => {
            UserHome.findOne.mockResolvedValue(null);

            await getAllRoomsFromHome(reqGetAllRooms2, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: "You don't have permission to get rooms of this home" });
        });*/

        it('should return 404 if home is not found', async () => {
            UserHome.findOne.mockResolvedValue({ id_home: 1, id_user: 1 });
            Home.findByPk.mockResolvedValue(null);

            await getAllRoomsFromHome(reqGetAllRooms, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Home not found' });
        });

        it('should return 500 if there is a server error', async () => {
            UserHome.findOne.mockResolvedValue({ id_home: 1, id_user: 1 });
            Home.findByPk.mockRejectedValue(new Error('Database error'));

            await getAllRoomsFromHome(reqGetAllRooms, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve rooms', details: 'Database error' });
        });
    });
});

const { UserHome } = require("../models");

exports.checkUserHome = async (userId, homeId) => {
    const userHome = await UserHome.findOne({ where: { id_home: homeId, id_user: userId } });
    return !!userHome;
} 
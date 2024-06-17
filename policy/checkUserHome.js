const { UserHome } = require("../models");

exports.checkUserHome = async (userId, homeId) => {
    console.log('checkUserHome-----------------------------');
    console.log('userId', userId, 'homeId', homeId);
    const userHome = await UserHome.findOne({ where: { id_home: homeId, id_user: userId } });
    return !!userHome;

} 
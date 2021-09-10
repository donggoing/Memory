let Sequelize = require('sequelize');
const database = {
    name: 'Mysql数据库名',
    user: '用户名',
    password : '密码',
    pool: {
        host: '数据库服务器IP/域名',
        port: '3306',
        dialect: 'mysql',
        dialectOptions: {
            dateStrings: true,
            typeCast: true
        },
        // dialectOptions: {
        //     useUTC: false //for reading from database
        // },
        timezone: '+08:00',
        define:{ 
            timestamps:false,
        },
        pool:{
            max:500,
            min:20,
            acquire:30000,
            idle:60000
        }
    }
};
let _sequelize = new Sequelize(database.name, database.user, database.password, database.pool);
module.exports = _sequelize;

/**
 * 
 * @param {*} success 数据库连接成功的回调
 * @param {*} error 数据库连接失败的回调
 */
module.exports = function (success, error) {
    // 判断 error 为其设置默认值
    if (typeof error !== 'function') {
        error = () => {
            console.log('connection fail!');
        }
    }

    // 导入mongoose
    const mongoose = require('mongoose');
    // 导入 配置文件
    const { DBHOST, DBPORT, DBNAME } = require('../config/config')

    mongoose.set('strictQuery', false);
    // 连接 mongod
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

    // 设置回调 once 事件回调函数只执行一次
    mongoose.connection.once('open', () => {
        success();
    })

    mongoose.connection.on('error', () => {
        // 设置连接错误的回调
        error();
    })
    mongoose.connection.on('close', () => {
        // 设置连接关闭的回调
        console.log('connection closed!');
    })
}



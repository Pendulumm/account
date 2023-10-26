// 导入jwt
const jwt = require('jsonwebtoken');
// 读取配置项
const { SECRET } = require('../config/config');

module.exports = (req, res, next) => {
    //  获取token
    let token = req.get('token');
    if (!token) {
        return res.json({
            code: '2003',
            msg: 'token 缺失',
            data: null
        })
    }
    // 校验token
    jwt.verify(token, SECRET, (err, data) => {
        if (err) {
            return res.json({
                code: '2004',
                msg: 'token校验失败',
                data: null
            })
        }
        //保存用户信息
        req.user = data;

        // -----校验成功-----
        next();
    })
}
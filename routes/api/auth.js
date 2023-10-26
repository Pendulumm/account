var express = require('express');
var router = express.Router();

// 导入用户模型
const UserModel = require('../../models/UserModel');
const md5 = require('md5');

// 导入jwt
const jwt = require('jsonwebtoken');

// 导入配置项
const { SECRET } = require('../../config/config');

// 登录操作
router.post('/login', (req, res) => {
    // 获取用户名和密码
    let { username, password } = req.body;
    // 查询数据库
    UserModel.findOne({ username: username, password: md5(password) }, (err, data) => {
        if (err) {
            res.json({
                code: '2001',
                msg: '数据库读取失败',
                data: null
            })
            return;
        }
        // 判断data
        // console.log(data);
        if (!data) {
            return res.json({
                code: '2002',
                msg: '用户名或密码错误',
                data: null
            })
        }
        // 创建当前用户的token
        let token = jwt.sign({
            username: data.username,
            _id: data._id
        }, SECRET, {
            expiresIn: 60 * 60 * 24 * 7,    // a week
        })

        // 响应token
        res.json({
            code: '0000',
            msg: '登录成功',
            data: token
        })
    })
})

// 退出登录
router.post('/logout', (req, res) => {
    console.log('session >>>', req.session.id);
    // 销毁session
    req.session.destroy(() => {
        res.render('accounts/success', { msg: '退出成功!', url: '/login' });
    });
})

module.exports = router;

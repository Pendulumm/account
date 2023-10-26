var express = require('express');
var router = express.Router();

// 导入用户模型
const UserModel = require('../../models/UserModel');
const md5 = require('md5');

router.get('/reg', (req, res) => {
    // 响应html
    res.render('auth/reg');
})

router.post('/reg', (req, res) => {
    // 做表单验证
    // ---

    // 获取请求体的数据
    // console.log(req.body);
    UserModel.create({
        ...req.body,
        password: md5(req.body.password)
    }, (err, data) => {
        if (err) {
            res.status(500).send('注册失败!请稍后再试...');
            return;
        }
        res.render('accounts/success', { msg: '注册成功', url: '/login' });
    })
})

// 登录
router.get('/login', (req, res) => {
    res.render('auth/login');
})

// 登录操作
router.post('/login', (req, res) => {
    // 获取用户名和密码
    let { username, password } = req.body;
    // 查询数据库
    UserModel.findOne({ username: username, password: md5(password) }, (err, data) => {
        if (err) {
            res.status(500).send('登录失败!');
            return;
        }
        // 判断data
        // console.log(data);
        if (!data) {
            return res.send('账号或密码错误');
        }
        if (req.session._id) {
            console.log(req.session);
            res.send(`欢迎您${req.session.username}`);
        } else {
            // 写入session
            // console.log('request session >>>', req.session);
            req.session.username = data.username;
            req.session._id = data.id;
            res.render('accounts/success', { msg: '登录成功', url: '/account' });
        }
    })
})

// 退出登录
router. post('/logout', (req, res) => {
    console.log('session >>>', req.session.id);
    // 销毁session
    req.session.destroy(() => {
        res.render('accounts/success', { msg: '退出成功!', url: '/login' });
    });
})

module.exports = router;

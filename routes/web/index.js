// 导入express
const express = require('express');

// 导入moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

// test
// console.log(moment('2023-10-23').toDate());
// 格式化日期对象
// console.log(moment(new Date()).format('YYYY-MM-DD'));

// 导入中间件
const checkLoginMiddleware = require('../../middlewares/checkLogin');

const router = express.Router();

// 添加首页的路由规则
router.get('/', (req, res) => {
  res.redirect('/account');
})

// 记账本的列表
router.get('/account', checkLoginMiddleware, function (req, res, next) {
  // 获取所有的账单信息
  // let accounts = db.get('accounts').value();

  // 读取集合信息
  AccountModel.find().sort({ time: -1 }).exec((err, data) => {
    if (err) {
      res.status(500).send('读取失败!');
      return;
    }
    // console.log(data);
    // 响应成功的提示
    res.render('accounts/list', { accounts: data, moment: moment });
  })

});

// 添加记录
router.get('/account/create', checkLoginMiddleware, function (req, res, next) {
  res.render('accounts/create');
});

// 新增记录
router.post('/account', checkLoginMiddleware, (req, res) => {
  // 查看表单数据   2023-10-23 ===> new Date()
  // 2023-10-23 ===> moment ===> new Date()
  // console.log(req.body);

  // 插入数据库
  AccountModel.create({
    ...req.body,
    // 修改 time 属性的值
    time: moment(req.body.time).toDate()
  }, (err, data) => {
    if (err) {
      res.status(500).send('插入失败!');
      return;
    }
    // 成功提醒
    res.render('accounts/success', { msg: '添加成功哦~~~', url: '/account' });
  })

})

// 删除记录
router.get('/account/:id', checkLoginMiddleware, (req, res) => {
  // 获取 params 的id参数
  let id = req.params.id;
  // 删除
  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send('删除失败');
      return;
    }
    // 提醒
    res.render('accounts/success', { msg: '删除成功', url: '/account' });
  })
})

module.exports = router;

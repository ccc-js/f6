const Koa = require('koa')
const koaStatic = require('koa-static')
const app = new Koa()

app.use(koaStatic('web')).listen(3000)

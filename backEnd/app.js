const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const historty = require('connect-history-api-fallback')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect("mongodb://localhost:27017")
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })
  
app.use(historty())
app.use(cors())//跨域实现
app.use(express.static('build'))//显示前端部署
app.use(express.json({ limit: "10mb" }))//Json-parser 的功能是获取请求的 JSON 数据，将其转换为 JavaScript 对象，然后在调用路由处理程序之前将其附加到请求对象的 body 属性。
app.use(middleware.requestLogger)//请求具体信息
app.use(middleware.tokenExtractor)//token截取
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


app.use(middleware.unknownEndpoint)
//最后加载的处理错误中间件
app.use(middleware.errorHandler)

module.exports = app
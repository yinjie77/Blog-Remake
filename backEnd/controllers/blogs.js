const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//获取所有博客
blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

//发布博客
blogsRouter.post('/', async (request, response, next) => {
	const blog = new Blog(request.body)

	let decodedToken
	//验证token是否存在
	if (!request.token) {
		return response.status(401).json({ error: 'token missing ' })
	}
	//验证token是否有效
	try {
		decodedToken = jwt.verify(request.token, process.env.SECRET)
	} catch (error) {
		return response.status(401).json({ error: 'token expired' })
	}


	//博客保存
	const user = await User.findById(decodedToken.id)
	blog.user = user._id
	const saveBlog = await blog.save()

	//用户相关联博客保存
	user.blogs = user.blogs.concat(saveBlog._id)
	await user.save()

	response.json(saveBlog)
})
//删除博客
blogsRouter.delete("/:id", async (request, response) => {

	let decodedToken
	//验证token是否存在
	if (!request.token) {
		return response.status(401).json({ error: 'token missing ' })
	}
	//验证token是否有效
	try {
		decodedToken = jwt.verify(request.token, process.env.SECRET)
	} catch (error) {
		return response.status(401).json({ error: 'token expired' })
	}

	//删除操作
	const id = request.params.id
	const blog = await Blog.findById(id)
	//登录用户与博客拥有者匹配再删除
	if (blog.user.toString() === decodedToken.id) {
		await Blog.findByIdAndDelete(id)
		await User.update({ _id: blog.user }, { $pull: { blogs: blog._id } })
		response.status(204).end()
	}
	else {
		return response.status(401).json({
			error: "Unauthorized to access the blog"
		})
	}
})
//点赞博客
blogsRouter.patch("/:id", async (request, response) => {

	//验证token是否存在
	if (!request.token) {
		return response.status(401).json({ error: 'token missing ' })
	}
	//验证token是否有效
	try {
		jwt.verify(request.token, process.env.SECRET)
	} catch (error) {
		return response.status(401).json({ error: 'token expired' })
	}

	//加入名称数组
	const id = request.params.id
	const userName = request.body.useName
	const updatedBlog = await Blog.findByIdAndUpdate(id, { $addToSet: { likes: userName } })

	response.json(updatedBlog)
})
//评论博客
blogsRouter.post("/:id/comments", async (request, response) => {


	//验证token是否存在
	if (!request.token) {
		return response.status(401).json({ error: 'token missing ' })
	}
	//验证token是否有效
	try {
		jwt.verify(request.token, process.env.SECRET)
	} catch (error) {
		return response.status(401).json({ error: 'token expired' })
	}

	//加入评论数组
	const id = request.params.id
	if (request.body.comment) {
		const blog = await Blog.
			findByIdAndUpdate(id, { ["$addToSet"]: { comments: request.body.comment } })
		response.json(blog)
	}
	else {
		response.status(400).send({ error: "Comment is missing" })
	}
})

//博客访问量+1
blogsRouter.post("/:id/visit", async (request, response) => {

	const id = request.params.id
	const blog = {
		visit: request.body.visit
	}
	const updatedBlog = await Blog.findByIdAndUpdate(id, blog)

	response.json(updatedBlog)
})
module.exports = blogsRouter
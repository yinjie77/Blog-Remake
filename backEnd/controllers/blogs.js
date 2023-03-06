const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
	const blog = new Blog(request.body)

	const token = request.token
	let decodedToken
	try {
		decodedToken = jwt.verify(token, process.env.SECRET)
	} catch (error) {
		return response.status(401).json({ error: 'token expired' })
	}

	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const user = await User.findById(decodedToken.id)

	if (blog.url === undefined || blog.title === undefined) {
		return response.status(400).json({ error: "title or url is missing" })
	}
	blog.user = user._id

	const saveBlog = await blog.save()
	user.blogs = user.blogs.concat(saveBlog._id)
	await user.save()

	response.json(saveBlog)
})
blogsRouter.delete("/:id", async (request, response) => {
	const token = request.token
	let decodedToken
	try {
		decodedToken = jwt.verify(token, process.env.SECRET)
	} catch (error) {
		return response.status(401).json({ error: 'token expired' })
	}

	if (!token || !decodedToken) {
		return response.status(401).json({
			error: "token missing or invalid"
		})
	}

	const id = request.params.id
	const blog = await Blog.findById(id)
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

blogsRouter.patch("/:id", async (request, response) => {

	const token = request.token
	let decodedToken
	try {
		decodedToken = jwt.verify(token, process.env.SECRET)
	} catch (error) {
		return response.status(401).json({ error: 'token expired' })
	}

	if (!token || !decodedToken) {
		return response.status(401).json({
			error: "token missing or invalid"
		})
	}
	const id = request.params.id
	const userName = request.body.useName
	const updatedBlog = await Blog.findByIdAndUpdate(id, { $addToSet: { likes: userName } })
	response.json(updatedBlog)
})
blogsRouter.post("/:id/comments", async (request, response) => {

	const token = request.token
	let decodedToken
	try {
		decodedToken = jwt.verify(token, process.env.SECRET)
	} catch (error) {
		return response.status(401).json({ error: 'token expired' })
	}

	if (!token || !decodedToken) {
		return response.status(401).json({
			error: "token missing or invalid"
		})
	}

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
module.exports = blogsRouter
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
//修饰token
const setToken = newToken => {
  token = `bearer ${newToken}`
}

//获取所有博客
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

//创建博客
const create = async newObjcet => {
  const header = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObjcet, header)
  return response.data
}

//点赞博客
const updateBlog = async blog => {
  const header = {
    headers: { Authorization: token }
  }

  const response = await axios.patch(`${baseUrl}/${blog.id}`, { useName: blog.useName }, header)
  return response.data
}

//删除博客
const removeBlog = async blog => {
  const header = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${blog.id}`, header)
}

//评论博客
const makeComment = async (comment, id) => {
  const header = {
    headers: { Authorization: token }
  }
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment }, header)
  return response.data
}

//访问量+1
const addVisit = async (id, visit) => {
  const response = await axios.post(`${baseUrl}/${id}/visit`, { visit })
  return response.data
}
export default { getAll, create, setToken, updateBlog, removeBlog, makeComment, addVisit }
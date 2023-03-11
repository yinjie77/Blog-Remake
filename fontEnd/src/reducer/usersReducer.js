
const usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_USERS': {
      return action.data.users
    }
    case 'ADD_LIKE': {
      let res = [...state]
      res.forEach((user) => {
        user.blogs.forEach((blog) => {
          if (blog.id == action.data.blogId) {
            blog.likes.push(action.data.useName)
          }
        })
      })
      return res
    }
    case 'ADD_COMMENT': {
      let res = [...state]
      res.forEach((user) => {
        user.blogs.forEach((blog) => {
          if (blog.id == action.data.blogId) {
            blog.comments.push(action.data.comment)
          }
        })
      })
      return res
    }
    default: return state
  }
}
//添加用户信息
export const addUsers = (users) => {
  return {
    type: 'ADD_USERS',
    data: {
      users
    }
  }
}
// 更新用户关联的博客点赞
export const addLike2 = (blogId, useName) => {
  return {
    type: 'ADD_LIKE',
    data: {
      blogId,
      useName
    }
  }
}
// 更新用户关联的博客评论
export const addComment2 = (blogId, comment) => {
  return {
    type: 'ADD_COMMENT',
    data: {
      blogId,
      comment
    }
  }
}
export default usersReducer
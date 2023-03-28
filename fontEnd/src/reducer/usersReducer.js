
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
    case 'USER_ADD_VISIT': {
      let res = [...state]
      res.forEach((user) => {
        user.blogs.forEach((blog) => {
          if (blog.id == action.data.blogId) {
            blog.visit = action.data.visit
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

// 更新用户关联的访问量
export const addVisit2 = (blogId, visit) => {
  return {
    type: 'USER_ADD_VISIT',
    data: {
      blogId,
      visit
    }
  }
}
export default usersReducer
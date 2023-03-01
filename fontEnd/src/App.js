import React, { useState, useEffect } from 'react'

import Blog from './components/Blog'
import AddForm from './components/addForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import SingleBlog from './components/singleBlog'

import blogService from './services/blogs'
import usersService from './services/users'

import { initializeBlogs, setBlogs, addlike, deleteBlog } from './reducer/blogReducer'
import { setLoggedUser } from './reducer/loggedUserReducer'
import { addUsers } from './reducer/usersReducer'
import { useDispatch, useSelector } from 'react-redux'


import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { message } from 'antd';

import Head from './page/Head'
import Banner from './page/Banner'

import './App.css'

const App = () => {
  const dispatch = useDispatch()

  const loggedUser = useSelector(state => state.loggedUser)
  const [users, setUsers] = useState([])


  const matchUser = useRouteMatch('/users/:id')
  const user = matchUser
    ? users.find((user) => user.id === matchUser.params.id)
    : null

  useEffect(() => {
    dispatch(initializeBlogs())
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setLoggedUser(user))
      blogService.setToken(user.token)
    }
    (async () => {
      const allUsers = await usersService.getALL()

      dispatch(addUsers(allUsers))
      setUsers(allUsers)
    })()

  }, [dispatch])

  const addBlog = (blogObject, title) => {
    dispatch(setBlogs(blogObject))
  }

  const createBlog = () => {
    return (
      <Togglable buttonLabel='创建新博客'>
        <AddForm createBlog={addBlog} />
      </Togglable>
    )
  }
  const handleLikes = (id, likes) => {
    if (loggedUser) {
      dispatch(addlike(id, likes + 1))
      message.success('点赞成功')
    }

    else
      message.error('请先登录')

  }
  const handleRemoving = async (blog) => {
    dispatch(deleteBlog(blog.id))
    message.success('删除成功')
    location.replace('/')
  }

  return (
    <div >
      {/* head */}
      <Head loggedUser={loggedUser} />
      {/* banner */}
      <Banner />
      {/* content */}
      <div>
        <div
          style={{
            fontSize: '32px',
            textAlign: 'center',
            color: '#5c64a4',
            width: '100%',
            marginBottom: '20px'
          }}
        >
          博客
        </div>

        <Switch>
          <Route path="/users/:id">
            <User user={user} />
          </Route>
          <Route path='/users'>
            <Users users={users} />
          </Route>
          <Route path='/blogs/:id'>
            <SingleBlog handleLikes={handleLikes} handleRemoving={handleRemoving} loggedUser={loggedUser} />
          </Route>
          <Route path='/'>
            <Blog />
            {loggedUser ? createBlog() : null}
          </Route>
        </Switch>
      </div>
      {/*footer*/}
      <div style={{ textAlign: 'center', lineHeight: '50px', backgroundColor: 'rgba(239, 244, 250, 0.24)', color: 'black', height: '100px', verticalAlign: 'middle' }} >
        yinjie77
        <div>
          <a
            href="#"
            style={{ color: 'black' }}
          >
            QQ群-关于-联系我
          </a>
        </div>
      </div>
    </div>

  )
}

export default App
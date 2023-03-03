import React, { useState, useEffect } from 'react'

import Blog from './components/Blog'
import AddForm from './components/addForm'
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

import Head from './components/Head'
import Banner from './components/Banner'
import Footer from './components/Footer'

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

  const handleLikes = (id, likes) => {
    if (loggedUser) {
      dispatch(addlike(id, likes + 1))
      message.success('点赞成功')
    }

    else
      message.error('请先登录')

  }

  return (
    <div >
      {/* head */}
      <Head loggedUser={loggedUser} />
      {/* banner */}
      <Banner />
      {/* content */}
      <div>
        <Switch>
          <Route path="/users/:id">
            <User user={user} deleteBlog={deleteBlog} />
          </Route>
          <Route path='/users'>
            <Users users={users} />
          </Route>
          <Route path='/blogs/:id'>
            <SingleBlog handleLikes={handleLikes} loggedUser={loggedUser} />
          </Route>
          <Route path='/addblog'>
            <AddForm createBlog={addBlog} />
          </Route>
          <Route path='/'>
            <Blog />
          </Route>
        </Switch>
      </div>
      {/*footer*/}
      <Footer />
    </div>

  )
}

export default App
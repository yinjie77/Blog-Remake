import React, { useState, useEffect } from 'react'

import Blog from './components/Blog'
import AddForm from './components/addForm'
import Users from './components/Users'
import User from './components/User'
import SingleBlog from './components/singleBlog'

import blogService from './services/blogs'
import usersService from './services/users'

import { initializeBlogs } from './reducer/blogReducer'
import { setLoggedUser } from './reducer/loggedUserReducer'
import { addUsers } from './reducer/usersReducer'
import { useDispatch, useSelector } from 'react-redux'

import { Switch, Route, useRouteMatch } from 'react-router-dom'

import Head from './components/Head'
import Banner from './components/Banner'
import Footer from './components/Footer'

import './App.css'

const App = () => {
  const dispatch = useDispatch()
  const loggedUser = useSelector(state => state.loggedUser)
  const [users, setUsers] = useState([])

  //获取登录用户的信息
  const matchUser = useRouteMatch('/users/:id')
  const user = matchUser
    ? users.find((user) => user.id === matchUser.params.id)
    : null

  useEffect(() => {
    //博客信息初始化
    dispatch(initializeBlogs())
    //免登录
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setLoggedUser(user))
      blogService.setToken(user.token)
    }
    //用户信息初始化
    (async () => {
      const allUsers = await usersService.getALL()
      dispatch(addUsers(allUsers))
      setUsers(allUsers)
    })()

  }, [dispatch])

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
            {/* 个人中心 */}
            <User user={user} loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
          </Route>
          <Route path='/users'>
            {/* 用户统计 */}
            <Users users={users} />
          </Route>
          <Route path='/blogs/:id'>
            {/* 博客详情 */}
            <SingleBlog loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
          </Route>
          <Route path='/addblog'>
            {/* 发布博客 */}
            <AddForm setLoggedUser={setLoggedUser} />
          </Route>
          <Route path='/'>
            {/* 所有博客 */}
            <Blog loggedUser={loggedUser} />
          </Route>
        </Switch>
      </div>
      {/*footer*/}
      <Footer />
    </div>

  )
}

export default App
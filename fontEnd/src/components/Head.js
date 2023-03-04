import React from 'react'
import { YahooOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoggedUser } from '../reducer/loggedUserReducer';
import LoginForm from './LoginForm';
import CreateAccount from './CreateAccount';
import loginService from '../services/login'
import blogService from '../services/blogs'
import { Modal, message } from 'antd';
import { useState } from 'react';

export default function Head({ loggedUser }) {
    const dispatch = useDispatch()
    const [modalState, setModalState] = useState('登录');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const loginout = () => {
        if (window.localStorage.getItem('loggedBlogappUser')) {
            window.localStorage.removeItem('loggedBlogappUser')
            dispatch(setLoggedUser(null))
        }
        location.replace('/')
    }

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setModalState('登录'); // 回到登录状态
    };

    const move = () => {
        document.body.scrollTop = document.documentElement.scrollTop = 450
    }

    const login = async (username, password, noLogin) => {
        try {
            const user = await loginService.login({
                username, password, noLogin
            })
            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            dispatch(setLoggedUser(user))
            message.success('登陆成功')
            location.replace('/')
        } catch (error) {
            message.error('账号或密码错误')
        }

    }

    return (
        <div className='head'>
            <YahooOutlined className='headIcon' />
            {loggedUser
                ?
                <div className='headLogin'>
                    <div className='left'>
                        <Link to='/blogs' className='headBtn' onClick={move}>博客</Link>
                        <Link to='/users' className='headBtn' onClick={move}>用户</Link>
                    </div>
                    <div className='right'>
                        <Link to={`/users/${loggedUser.id}`} className='headBtn' onClick={move}>{loggedUser.username}</Link>
                        <button href='#' onClick={loginout} className='loginOutBtn'>退出登录</button>
                    </div>
                </div>
                :
                <div className='headUnLogin'>
                    <Link to='/blogs' className='headBtn' onClick={move}>
                        博客
                    </Link>
                    <button onClick={showModal} className='loginBtn' >
                        注册 | 登录
                    </button>
                </div>
            }
            <Modal

                style={{ maxWidth: '400px', textAlign: 'center' }}
                title={modalState}
                open={isModalVisible}
                footer={false}
                onCancel={handleModalCancel}
            >
                {modalState === '登录' && <LoginForm setModalState={setModalState} login={login} />}
                {modalState === '注册' && <CreateAccount setModalState={setModalState} login={login} />}

            </Modal>
        </div>
    )
}

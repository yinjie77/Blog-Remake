import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { List, Card, Popconfirm, Button, Skeleton, message } from 'antd';
import { LikeOutlined, MessageOutlined, QuestionCircleOutlined } from '@ant-design/icons';
const User = ({ user, deleteBlog, loggedUser }) => {
    const dispatch = useDispatch()
    const handleRemoving = async (blog) => {
        dispatch(deleteBlog(blog.id))
        message.success('删除成功')
        location.reload()
    }
    return (

        <div>
            <h1>个人中心</h1>
            {
                !user ?
                    <Skeleton active paragraph={{ rows: 10 }} /> :
                    <List
                        grid={{
                            gutter: 20,
                            column: 3
                        }}
                        pagination={{
                            pageSize: 9,
                        }}

                        dataSource={user.blogs}
                        renderItem={item => (

                            <List.Item>
                                <Card

                                    title={<Link className='blogName' to={`/blogs/${item.id}`} >{item.title}</Link>}
                                >
                                    <div className='cardContnet'>
                                        <div >
                                            <span className='likes'> <LikeOutlined /> {item.likes}</span>
                                            <span > <MessageOutlined /> {item.comments.length}</span>
                                        </div>
                                        {
                                            loggedUser.id === user.id ? <Popconfirm
                                                title="你确定要删除这个博客吗"
                                                onConfirm={() => handleRemoving(item)}
                                                okText="是"
                                                cancelText="否"
                                                icon={
                                                    <QuestionCircleOutlined
                                                        style={{
                                                            color: 'red',
                                                        }}
                                                    />
                                                }
                                            >
                                                <Button className='deleteBtn'>删除</Button>
                                            </Popconfirm> : null
                                        }
                                    </div>

                                </Card>
                            </List.Item>
                        )}
                    />
            }

        </div>
    )
}

export default User
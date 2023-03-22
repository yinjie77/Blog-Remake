import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { makeComment, addlike } from '../reducer/blogReducer'
import { addLike2, addComment2 } from '../reducer/usersReducer'
import { Button, Card, List, Input, message, Affix, Drawer, Avatar } from 'antd';
import { LikeOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';     // 解析 markdown
import remarkGfm from 'remark-gfm';             // markdown 对表格/删除线/脚注等的支持
import MarkNav from 'markdown-navbar';          // markdown 目录
import 'markdown-navbar/dist/navbar.css';
const { TextArea } = Input;

const SingleBlog = ({ loggedUser, setLoggedUser }) => {
    //控制目录状态
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const [comment, setComment] = useState('')
    const dispatch = useDispatch()

    //筛选出博客
    const blogs = useSelector(state => state.blogs)
    const id = useParams().id
    const blog = blogs.find((blog) => blog.id === id)

    //评论博客
    const handleComment = () => {
        if (comment == '') {
            message.error('请输入评论')
            return
        }
        if (loggedUser) {
            let res = dispatch(makeComment(comment, blog.id))
            res.then(() => {
                dispatch(addComment2(blog.id, comment))
                setComment('')
                message.success('评论成功')
            }, () => {
                message.error('身份失效，请重新登录')
                window.localStorage.removeItem('loggedBlogappUser')
                dispatch(setLoggedUser(null))
                location.reload()
            })
        }
        else {
            message.error('请先登录')
        }

    }

    //点赞博客
    const handleLikes = (id) => {
        //两种保障
        if (loggedUser) {
            if (blog.likes.includes(loggedUser.username)) {
                message.error('已经点赞过了')
            } else {
                let res = dispatch(addlike(id, loggedUser.username))
                res.then(() => {
                    dispatch(addLike2(id, loggedUser.username))
                    message.success('点赞成功')
                }, () => {
                    message.error('身份失效，请重新登录')
                    window.localStorage.removeItem('loggedBlogappUser')
                    dispatch(setLoggedUser(null))
                    location.reload()
                })
            }
        }
        else {
            message.error('请先登录')
        }

    }

    if (!blog)
        return null

    //评论头像处理
    let comments = blog.comments.map(
        (item, index) => (
            {
                avatar: `https://joesch.moe/api/v1/random?key=${index + 1}`,
                content: (<p>{item}</p>)
            }
        )
    )

    return (
        <div>
            <div className='blogBox'>
                <div className='directory'>
                    {/* 目录开关 */}
                    <Affix offsetTop={350}>
                        <Button onClick={showDrawer} className='drawerBtn'>
                            <UnorderedListOutlined style={{
                                fontSize: '1.5em'
                            }} />
                        </Button>
                    </Affix>
                    {/* 目录抽屉 */}
                    <Drawer title="目录" placement="left" onClose={onClose} open={open}>
                        <MarkNav
                            className="toc-list"
                            source={blog.url}
                            ordered={true}
                            headingTopOffset={-450}
                        />
                    </Drawer>
                </div>

                <div className='blogContent'>
                    {/* 具体博客内容 */}
                    <Card
                        title=<div>{blog.title}</div>
                        hoverable={true}
                        headStyle={{
                            textAlign: 'center',
                            fontSize: '3em',
                            color: '#5c64a4'
                        }}
                        bordered={true}
                        extra={
                            <div className='blogAuthor'>
                                <UserOutlined /> 作者:{blog.author}
                            </div>
                        }
                        actions={[
                            <div>
                                <span>
                                    <LikeOutlined />{blog.likes.length}
                                </span>
                                <Button onClick={() => handleLikes(blog.id)} className='likeBtn'>
                                    点赞
                                </Button>
                            </div>
                        ]
                        }
                    >
                        <ReactMarkdown
                            children={blog.url}
                            remarkPlugins={[remarkGfm]}
                        />
                    </Card>
                </div>

                <h2 style={{ color: 'rgb(92, 100, 164)', marginTop: '5vh' }}>评论</h2>
                {/* 评论卡片 */}
                <List
                    dataSource={comments}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.content}
                                avatar={<Avatar src={item.avatar} />}
                            />
                        </List.Item>

                    )}
                    className='blogComments'
                    bordered
                    pagination={{
                        pageSize: 5,
                        hideOnSinglePage: true
                    }}

                >
                </List>
                {/* 评论输入框 */}
                <div className='blogComments'>
                    <TextArea
                        showCount
                        maxLength={500}
                        style={{
                            marginTop: '3vh',
                        }}
                        onChange={(e) => setComment(e.target.value)}
                        autoSize
                        placeholder="请输入评论(按时间排序）"
                        value={comment}
                    />

                </div>
                <Button className='commentBtn' onClick={handleComment}>添加</Button>

            </div>

        </div>
    )
}
export default SingleBlog
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { List, Avatar, Space, Button, Input, notification } from 'antd';
import { LikeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { searchBlogs } from '../reducer/blogReducer';
const { Search } = Input;

const Blog = ({ loggedUser }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  //按点赞数排序,添加头像
  blogs.sort((a, b) => (a.likes.length > b.likes.length ? -1 : 1))
  blogs.forEach((item, index) => {
    //avatar,description,content
    item.avatar = `https://joesch.moe/api/v1/random?key=${index}`
    item.description = '' + item.url.slice(0, 150) + '......'
  })
  //搜索博客
  const handleSearch = (value) => {
    dispatch(searchBlogs(value))
  }
  //展示容器
  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
  //未登录提示
  const openNotification = () => {
    notification.error({
      message: '请先登录再发布',
      placement: 'topLeft'
    });
  };
  const move = () => {
    document.body.scrollTop = document.documentElement.scrollTop = 450
  }
  return (
    <div >
      <div className='contentHeadText'>博客</div>
      <>
        <div className='blogSearch'>
          <Search
            placeholder="搜索文章"
            onSearch={handleSearch}
            allowClear
            style={{
              width: 200,
            }}
          />
        </div>
        {loggedUser ?
          <Link to='/addblog'>
            <Button type="primary" block shape='round' className='addBlogBtn' >
              发布新博客
            </Button>
          </Link> :
          <Button type="primary" block shape='round' className='addBlogBtn' onClick={openNotification}>
            发布新博客
          </Button>
        }

        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 3,
          }}
          dataSource={blogs}
          bordered={true}
          loading={blogs.length == 0 ? true : false}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <IconText icon={UserOutlined} text={item.author} key="list-vertical-like-o" />,
                <IconText icon={LikeOutlined} text={item.likes.length} key="list-vertical-like-o" />,
                <IconText icon={MessageOutlined} text={item.comments.length} key="list-vertical-message" />,
              ]}
              extra={
                <img
                  width={272}
                  alt="logo"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                />
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<Link onClick={move} to={`/blogs/${item.id}`}>{item.title}</Link>}
                description={item.description}
              />
              {item.content}
            </List.Item>
          )}
        />
      </>

    </div>

  )
}

export default Blog
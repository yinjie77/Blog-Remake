import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { List, Skeleton, Avatar, Space, Button, Input } from 'antd';
import { LikeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
const { Search } = Input;

const Blog = () => {
  const blogs = useSelector(state => state.blogs)
  blogs.sort((a, b) => (a.likes > b.likes ? -1 : 1))
  blogs.forEach((item, index) => {
    //avatar,description,content
    item.avatar = `https://joesch.moe/api/v1/random?key=${index}`
    item.description = '简介：暂无'
  })
  const handleSearch = (value) => {

  }
  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return (
    <div >
      <div className='contentHeadText'>博客</div>
      {blogs.length == 0 ?
        <Skeleton active paragraph={{ rows: 10 }} />
        :
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
          <Link to='/addblog'>
            <Button type="primary" block shape='round' className='addBlogBtn' >
              发布新博客
            </Button>
          </Link>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              pageSize: 3,
            }}
            dataSource={blogs}
            bordered={true}

            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <IconText icon={UserOutlined} text={item.author} key="list-vertical-like-o" />,
                  <IconText icon={LikeOutlined} text={item.likes} key="list-vertical-like-o" />,
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
                  title={<Link to={`/blogs/${item.id}`}>{item.title}</Link>}
                  description={item.description}
                />
                {item.content}
              </List.Item>
            )}
          />
        </>
      }
    </div>

  )
}

export default Blog
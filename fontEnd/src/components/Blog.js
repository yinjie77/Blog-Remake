import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { List, Skeleton, Avatar, Space } from 'antd';
import { LikeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';


const Blog = () => {

  const blogs = useSelector(state => state.blogs)
  blogs.sort((a, b) => (a.likes > b.likes ? -1 : 1))
  blogs.forEach((item, index) => {
    //avatar,description,content
    item.avatar = `https://joesch.moe/api/v1/random?key=${index}`
    item.description = '简介：暂无'
  })

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
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 3,
          }}
          dataSource={blogs}

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
      }


    </div>

  )
}

export default Blog
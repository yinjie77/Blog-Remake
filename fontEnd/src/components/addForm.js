import React, { useState } from "react";
import { Form, Input, Button, message } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";

const AddForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [value, setValue] = useState(``);

  const addBlog = () => {

    createBlog(
      {
        title: title,
        author: author,
        url: value
      }
    )
    setTitle('')
    setAuthor('')
    setValue('')
    location.replace('/')
    message.success('创建成功')
  }
  return (
    <div
      className="addForm"
    >
      <Form
        onFinish={addBlog}
        style={{ width: '100%', margin: '10px 14px', display: 'flex', flexDirection: 'column' }}
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input
            prefix={<EditOutlined />}
            placeholder="标题"
            allowClear='true'
            onChange={({ target }) => {
              setTitle(target.value)
            }}
          />
        </Form.Item>
        <Form.Item
          name="author"
          rules={[{ required: true, message: '请输入文章作者' }]}
        >
          <Input
            prefix={<UserOutlined />}
            allowClear='true'
            placeholder="作者(原创或转载）"
            onChange={({ target }) => {
              setAuthor(target.value)
            }}
          />
        </Form.Item>

        <Form.Item
          name="content"
          rules={[{ required: true, message: '请输入文章内容' }]}
        >

          <MDEditor
            value={value}
            onChange={setValue}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" className='formBtn'>创建</Button>
      </Form>

    </div>
  )

}
export default AddForm
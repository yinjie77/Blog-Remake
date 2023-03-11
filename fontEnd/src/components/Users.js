import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table, Tag, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
const Users = ({ users }) => {
    //搜索作者
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        //自定义过滤样式与逻辑
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`搜索用户名`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}//回车搜索
                    style={{
                        marginBottom: 8,
                        display: 'block',
                        borderColor: '#5c64a4'
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                            background: '#5c64a4',
                            border: 'none'
                        }}
                    >
                        搜索
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        清空
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                        style={{
                            color: '#5c64a4'
                        }}
                    >
                        过滤
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                        style={{
                            color: '#5c64a4'
                        }}
                    >
                        关闭
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),//忽略大小写
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        //展示搜索内容
        render: (text) =>
            searchedColumn === dataIndex ? (
                // 搜索词高亮
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    //用户状态
    users.forEach((item) => {
        let comments = item.blogs.reduce((pre, cur) => pre + cur.comments.length, 0)
        let likes = item.blogs.reduce((pre, cur) => pre + cur.likes.length, 0)
        let star = comments + likes * 2
        if (star > 7) {
            item.status = '火爆'
        } else if (star > 4) {
            item.status = '活跃'
        } else {
            item.status = '沉寂'
        }

    })

    const columns = [
        {
            title: '用户名',
            dataIndex: 'name',
            className: 'TableText',
            ...getColumnSearchProps('name')
        },
        {
            title: '发博数',
            dataIndex: 'blogs',
            className: 'TableText',
            render: (text) => {
                return (
                    <div>{text.length}</div>
                )
            }
        },
        {
            title: '所获点赞',
            dataIndex: 'blogs',
            className: 'TableText',
            render: (text) => {
                let likes = text.reduce((pre, cur) => pre + cur.likes.length, 0)
                return (
                    <div>{likes}</div>
                )
            }
        },
        {
            title: '评论总数',
            dataIndex: 'blogs',
            className: 'TableText',
            render: (text) => {
                let comments = text.reduce((pre, cur) => pre + cur.comments.length, 0)
                return (
                    <div>{comments}</div>
                )
            }
        },
        {
            title: '热度',
            dataIndex: 'status',
            className: 'TableText',
            filters: [
                {
                    text: '火爆',
                    value: '火爆',
                },
                {
                    text: '活跃',
                    value: '活跃',
                },
                {
                    text: '沉寂',
                    value: '沉寂',
                },
            ],
            onFilter: (value, record) => record.status.includes(value),//选择状态
            render: (text) => {

                if (text == '火爆') {
                    return (
                        <Tag color="#f50">火爆</Tag>
                    )
                } else if (text == '活跃') {
                    return (
                        <Tag color="#87d068">活跃</Tag>
                    )
                } else {
                    return (
                        <Tag color='grey'>沉寂</Tag>
                    )
                }

            }
        },
        {
            title: '',
            dataIndex: 'name',
            render: (text) => {
                const a = users.filter(x => x.name == text)
                return (
                    <Link to={`/users/${a[0].id}`} >详情</Link>
                )
            }
        }
    ]

    return (
        <div>

            <h1 >用户信息统计</h1>
            <div >
                <Table columns={columns} dataSource={users} bordered={true} loading={users.length == 0} className='table' />
            </div>
        </div>
    )
}

export default Users
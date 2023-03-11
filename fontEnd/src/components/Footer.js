import React from 'react'
import { Popover } from 'antd'
export default function Footer() {
    const content = (
        <div className='wechat'></div>
    )
    return (
        <div className='footer' >
            <Popover content={content}>
                <div className='contact'>有问题请联系我</div>
            </Popover>
        </div>
    )
}

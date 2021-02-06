import React from "react";
import 'antd/dist/antd.css';
import {Menu, Input, message} from 'antd';
import {ProjectOutlined, TeamOutlined} from '@ant-design/icons';


const {SubMenu} = Menu;
const {Search} = Input;

const Home =()=>{
    const onSearch = value => {
        //https://ant.design/components/message-cn/
        message.success(value, 3, null);
    };
    return (
        <>
            <Search placeholder="搜索工程..." onSearch={onSearch} enterButton/>
            <Menu theme="dark" mode="inline">
                <SubMenu key="sub1" icon={<ProjectOutlined/>} title="工程管理">
                    <Menu.Item key="1">工程列表</Menu.Item>
                    <Menu.Item key="2">信息设置</Menu.Item>
                </SubMenu>
            </Menu>
        </>
    )
};

export default Home;

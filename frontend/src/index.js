import React, {Component} from "react";
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import {Layout, Menu, Input, message} from 'antd';
import {ProjectOutlined, TeamOutlined} from '@ant-design/icons';


const {Header, Content, Sider} = Layout;
const {Search} = Input;
const {SubMenu} = Menu;

class MyLayout extends Component {

    render() {
        const onSearch = value => {
            //https://ant.design/components/message-cn/
            message.success(value, 3, null);
        };
        return (
            //1vh=1%屏幕高
            <Layout style={{minHeight: "100vh"}}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <div className="logo"/>
                    {/*<Search placeholder="搜索工程..." onSearch={onSearch} enterButton/>*/}
                    <Menu theme="dark" mode="inline">
                        <SubMenu key="sub1" icon={<ProjectOutlined/>} title="工程管理">
                            <Menu.Item key="1">工程列表</Menu.Item>
                            <Menu.Item key="2">信息设置</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<TeamOutlined/>} title="人员管理">
                            <Menu.Item key="3">人员列表</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-sub-header-background" style={{padding: 0}}/>
                    <Content style={{margin: '24px 16px 0'}}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: "100vh" }}>
                            content
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

ReactDOM.render(<MyLayout/>, document.getElementById('container'));
// export default Index;

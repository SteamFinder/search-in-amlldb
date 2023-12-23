import React, { useState, useEffect } from 'react';
import Localdb from "./components/localdb";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DatabaseOutlined,
  HomeOutlined,
  SearchOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
const { Header, Sider, Content, Footer } = Layout;
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const contentStyle = {
      margin: '24px 16px',
      padding: 24,
      minHeight: 280,
      background: colorBgContainer,
      borderRadius: borderRadiusLG,
  }
  // 根据路由高亮
  const navigate = useNavigate();
  const onMenuClick = (route) => {
    const path = route.key;
    navigate(path);
  }
  const location = useLocation();
  const selectedKey = location.pathname;
  // 获取数据

  return (
    <div className="App">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKey}
            items={[
              {
                key: '/',
                icon: <HomeOutlined />,
                label: '主页',
              },
              {
                key: '/search',
                icon: <SearchOutlined />,
                label: '搜索',
              },
              {
                key: '/database',
                icon: <DatabaseOutlined />,
                label: '数据库',
              },
              {
                key: '/ttml-tool',
                icon: <ToolOutlined />,
                label: 'TTML工具',
              },
            ]}
            onClick={onMenuClick}
          />
        </Sider>
        <Layout
          style={{
            minHeight: '100vh',
            display: 'flex',
          }}
        >
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Localdb />
          </Header>
          <Content style={contentStyle}>
            {/* 二级路由出口 */}
            <Outlet />
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            Search In AMLL-DB
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;

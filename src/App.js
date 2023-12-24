import React, { useState, useEffect, useRef } from 'react';
import Localplay from "./components/localplay";
import Localdb from "./components/localdb";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DatabaseOutlined,
  HomeOutlined,
  SearchOutlined,
  ToolOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, notification, Drawer } from 'antd';
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

  //对手机用户进行提示
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.error({
      message: '兼容性提示',
      description:
        '本网站未对移动端设备进行针对性适配, 建议使用桌面端设备访问',
      duration: 0,
    });
  };

  // 判断用户设备
  var i = 0;
  useEffect(() => {
    function isMobileDevice() {
      console.log("用户UA 检测");
      var UAstatus = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log("用户UA 是否移动端", UAstatus);
      if (UAstatus == true && i == 0) {
        console.log("用户UA 移动端 进行提示");
        openNotification();
        i++;
      }
    }
    isMobileDevice();
  }, []);

  return (
    <div className="App">
      {contextHolder}
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKey}
            items={[
              {
                key: '/search-in-amlldb',
                icon: <HomeOutlined />,
                label: '主页',
              },
              {
                key: '/search-in-amlldb/search',
                icon: <SearchOutlined />,
                label: '搜索',
              },
              {
                key: '/search-in-amlldb/database',
                icon: <DatabaseOutlined />,
                label: '数据库',
              },
              {
                key: '/search-in-amlldb/ttml-tool',
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
            <Localplay />
            <Localdb />
          </Header>
          <Content style={contentStyle}>
            {/* 二级路由出口 */}
            <Outlet />
            {/* AMLL Drawer */}
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            Search In AMLL-DB@1.9.0 React
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
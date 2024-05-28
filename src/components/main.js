import React, { useState, useEffect, useRef } from 'react';
import { Card, Col, Row, Alert } from 'antd'
import {
    PlayCircleOutlined,
    GithubOutlined,
    CloudSyncOutlined,
    AppleOutlined,
    DeploymentUnitOutlined,
    FileTextOutlined,
    SearchOutlined,
    LinkOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import Testimg from '../logo.svg';

function Main() {

    return (
        <>
            <Alert
                type="info"
                message="建议定期获取最新数据 出现音乐无法播放可能为本地数据过期"
                banner
                closable
                showIcon
            />
            <Row justify="center" gutter={{ xs: 8, sm: 16, md: 24, lg: 32, }}>
                <Col span={24}><br /><br /><br /></Col>
            </Row>
            <Row justify="center" gutter={{ xs: 8, sm: 16, md: 24, lg: 32, }}>
                <Col span={5}></Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                    <img src="https://cdn.jsdelivr.net/gh/Steve-xmh/applemusic-like-lyrics/packages/bncm/src/assets/amll-icon.svg" width="40%" />
                </Col>
                <Col span={10}>
                    <h1>Search In AMLL DB</h1>
                    <p>Powered by <img src={Testimg} width="5%" style={{ verticalAlign: 'middle' }} />React</p>
                    <p>点击顶部工具栏 <CloudSyncOutlined /> 获取/更新数据</p>
                </Col>
                <Col span={3}></Col>
            </Row>
            <Row justify="center" gutter={{ xs: 8, sm: 16, md: 24, lg: 32, }}>
                <br />
                <br />
            </Row>
            <Row justify="center" gutter={{ xs: 8, sm: 16, md: 24, lg: 32, }}>
                <Col span={8}>
                    <Card title="音乐搜索" hoverable="true">
                        <GithubOutlined />&nbsp;从AMLL DB获取数据<br />
                        <CloudSyncOutlined />&nbsp;支持网易云匹配<br />
                        <SearchOutlined />&nbsp;模糊搜索
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="歌曲资源" hoverable="true">
                        <PlayCircleOutlined />&nbsp;纯音乐试听<br />
                        <DownloadOutlined />&nbsp;TTML/歌曲封面/音乐文件<br />
                        <LinkOutlined />&nbsp;快捷链接跳转
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="TTML歌词" hoverable="true">
                        <DeploymentUnitOutlined />&nbsp;提供一站式服务<br />
                        <AppleOutlined />&nbsp;AMLL Player驱动歌词显示<br />
                        <FileTextOutlined />&nbsp;搜索/下载/编辑/预览 All in One
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default Main;

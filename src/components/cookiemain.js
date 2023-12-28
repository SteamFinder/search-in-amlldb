import React, { useState, useEffect, useRef } from 'react';
import Cookieget from './cookieget';
import Cookieuser from './cookieuser'
import { Card, Col, Row, Alert } from 'antd';
import Cookiedb from './cookiedb';
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

function Cookiemain() {

    return (
        <>
            <Alert
                type="info"
                message="请先点击getQR获取二维码进行登录 然后点击数据库更新(Devs)的更新按钮进行更新 如您有会员 试听歌曲将会被解锁"
                banner
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
                    <h2><font color="green">/* 开发者选项 */</font></h2>
                    <p>Powered by <img src={Testimg} width="5%" style={{ verticalAlign: 'middle' }} />React</p>
                </Col>
                <Col span={3}></Col>
            </Row>
            <Row justify="center" gutter={{ xs: 4, sm: 8, md: 12, lg: 16, }}>
                <br />
                <br />
            </Row>
            <Row justify="center" gutter={{ xs: 4, sm: 8, md: 12, lg: 16, }}>
                <Col span={1}></Col>
                <Col span={8}>
                    <Card title="数据库更新(Devs)" hoverable="true">
                        <Cookiedb />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="QR Login" hoverable="true">
                        <Cookieget />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="用户操作" hoverable="true">
                        <Cookieuser />
                    </Card>
                </Col>
                <Col span={1}></Col>
            </Row>
        </>
    );
}

export default Cookiemain;
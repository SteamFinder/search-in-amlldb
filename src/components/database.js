import React, { useState, useEffect, useRef } from 'react';
import { Space, Table, Drawer, Card } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';
/*
[
{
    "s_id": "1308359582",
    "s_name": "梦泽沧沧",
    "s_sname": "漆柚",
    "s_pic": "https://p2.music.126.net/idpBKqSHCDfEw8RAofHWbQ==/109951163540042089.jpg",
    "s_downurl": "https://m7.music.126.net/20231223143708/87d3da1f3652b888f41443c00b81549b/ymusic/b346/23de/5e90/3c2f22e190b784d84adc1b6c3ebcaf35.mp3",
    "ttml_url": "https://github.com/Steve-xmh/amll-ttml-db/blob/main/lyrics/1308359582.ttml",
    "ttml_downurl": "https://raw.githubusercontent.com/Steve-xmh/amll-ttml-db/main/lyrics/1308359582.ttml"
}
]
*/

// 声明一个全局变量 用来展示详情
var details = [];

function Database() {

    // Columns
    const columns = [
        {
            title: '歌曲图片',
            dataIndex: 's_pic',
            key: 's_pic',
        },
        {
            title: '歌曲名称',
            dataIndex: 's_name',
            key: 's_name',
        },
        {
            title: '歌手',
            dataIndex: 's_sname',
            key: 's_sname',
        },
        {
            title: '歌曲id',
            dataIndex: 's_id',
            key: 's_id',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle" onClick={() => handleDetailClick(record.s_id)} key={record.s_id}>
                    <a>详情</a>
                </Space>
            ),
        },
    ];

    // 新建一个Drawer
    const [open, setOpen] = useState(false);
    const [drawerinfo, setDrawerinfo] = useState("无信息");
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        pauseAudio();
    };

    // Aplayer-react
    const audioRef = useRef(null);
    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    const [contentList, setContentlist] = useState({
        tab1: <p key="tab1">无信息 tab1</p>,
        tab2: <p key="tab2">无信息 tab2</p>,
        tab3: <p key="tab3">无信息 tab3</p>,
    });
    // 资源下载列表Tabs
    const tabList = [
        {
            key: 'tab1',
            tab: '歌曲资源',
        },
        {
            key: 'tab2',
            tab: 'TTML歌词资源',
        },
        {
            key: 'tab3',
            tab: '其他资源',
        },
    ];
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    // Tabs
    const onTab1Change = (key) => {
        setActiveTabKey1(key);
    };

    // 用来接收点击事件
    const handleDetailClick = (s_id) => {
        console.log('点击详情,歌曲id:', s_id);
        const matchedDetail = details.find(detail => detail.s_id === s_id);
        console.log("匹配成功:", matchedDetail);
        setDrawerinfo([
            <p key={matchedDetail.s_pic}><img src={matchedDetail.s_pic} width="80vh" /></p>,
            <p key={matchedDetail.s_id}>歌曲id:{matchedDetail.s_id}</p>,
            <p key={matchedDetail.s_name}>歌曲名称:{matchedDetail.s_name}</p>,
            <p key={matchedDetail.s_sname}>歌手名称:{matchedDetail.s_sname}</p>,
            <p key={matchedDetail.s_downurl}><audio src={matchedDetail.s_downurl} ref={audioRef} controls /></p>,
        ])
        setContentlist(
            {
                tab1: <p key="tab1"><WarningTwoTone twoToneColor="#eb2f96"/>
                    &nbsp;仅供歌词制作使用,请勿用作非法用途
                    <br /><br />
                    <a href={matchedDetail.s_downurl} target='_blank'>歌曲文件下载</a>
                </p>,
                tab2: <p key="tab2"><WarningTwoTone twoToneColor="#eb2f96"/>
                    &nbsp;仅供歌词制作使用,请勿用作非法用途
                    <br /><br />
                    <a href={matchedDetail.ttml_downurl} target='_blank'>TTML文件下载</a>
                    <br />
                    <a href={matchedDetail.ttml_url} target='_blank'>Github歌词文件页面</a>
                </p>,
                tab3: <p key="tab3"><WarningTwoTone twoToneColor="#eb2f96"/>
                    &nbsp;仅供歌词制作使用,请勿用作非法用途
                    <br /><br />
                    <a href={"https://music.163.com/#/song?id=" + matchedDetail.s_id} target='_blank'>网易云歌曲详情页面</a>
                </p>,
            }
        );
        showDrawer();
    };

    // 从 localStorage 中检索存储的字符串
    var localdata = [];
    var storedMusicDataString = localStorage.getItem('amlldata');
    if (storedMusicDataString == null || storedMusicDataString == 'null' || storedMusicDataString == '') {
        storedMusicDataString = " { \"time_ver\": \"本地无数据\" } "
        var localdata = [];
    } else {
        // 将字符串解析为数组
        const storedMusicData = JSON.parse(storedMusicDataString);
        details = storedMusicData;
        var localdata = [];
        storedMusicData.map(item => (
            // 使用map生成React元素
            localdata.push({
                key: item.s_id,
                s_pic: <img src={item.s_pic} width='40vh' />,
                s_name: item.s_name,
                s_sname: item.s_sname,
                s_id: item.s_id,
                action: item.s_id
            })
        ))
    }
    const [data, setData] = useState(localdata);
    useEffect(() => {
        const handleStorageChange = () => {
            // 当 localStorage 发生变化时，更新组件的状态
            var upddata = [];
            var storedMusicDataString = localStorage.getItem('amlldata');
            const storedMusicData = JSON.parse(storedMusicDataString);
            storedMusicData.map(item => (
                // 使用map生成React元素
                upddata.push({
                    key: item.s_id,
                    s_pic: <img src={item.s_pic} width='40vh' />,
                    s_name: item.s_name,
                    s_sname: item.s_sname,
                    s_id: item.s_id,
                    action: item.s_id
                })
            ))
            setData(upddata);
        };
        // 添加事件监听器
        window.addEventListener('localstorageDataChanged', handleStorageChange);
        // 组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('localstorageDataChanged', handleStorageChange);
        };
    }, [data]); // 空数组表示只在组件挂载和卸载时运行

    return (
        <>
            <Table columns={columns} dataSource={data} size='middle' pagination={{ pageSize: 8, showSizeChanger: false, showQuickJumper: true }} />
            <Drawer title="歌曲详情" placement="right" onClose={onClose} open={open}>
                {drawerinfo}
                <Card style={{ width: '100%', }} title="相关资源下载" tabList={tabList} activeTabKey={activeTabKey1} onTabChange={onTab1Change} tabProps={{ size: 'middle', }}>{contentList[activeTabKey1]}</Card>
            </Drawer>
        </>
    );
}

export default Database;
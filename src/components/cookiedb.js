import React, { useState } from 'react';
import { Button, message, Progress, Input, Divider } from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';
import axios from 'axios';


function Cookiedb() {

    // 注意 请使用安全的api
    /*
                    <Input placeholder="请在此输入要查询的歌曲id/名称,支持模糊查询" onChange={(e) => setInputValue(e.target.value)} />
                <Button type="primary" onClick={handleSearch} disabled={button_disabled}>查询</Button>
    */
    const [inputValue, setInputValue] = useState('');
    var setApi;

    function handleSet() {
        setApi = inputValue;
        openSuccess();
    }

    // 全局通知
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: '(devs)更新数据库成功',
        });
    };

    const openSuccess = () => {
        messageApi.open({
            type: 'success',
            content: '(Devs)设置API成功',
        });
    };

    // Progress
    const [progressVisible, setProgressVisible] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [progressHint, setProgressHint] = useState("(Devs)初始化");

    var storedMusicDataString = localStorage.getItem('amlldata');
    // var unCookie = localStorage.getItem('cookie');
    var amll_time_ver;

    if (storedMusicDataString == null) {
        //本地无数据时,使用.
        storedMusicDataString = "{\"time_ver\":\"(Devs)本地无数据\"}";
        var storedMusicData = JSON.parse(storedMusicDataString);
        amll_time_ver = storedMusicData.time_ver
    } else {
        //本地有数据时,使用[0]查询第一个数据的ver
        storedMusicData = JSON.parse(storedMusicDataString);
        amll_time_ver = storedMusicData[0].time_ver
    }
    const [amll_ver, setAmllver] = useState(amll_time_ver);
    const [db_count, setDbCount] = useState(0);
    const [button_disabled, setButtondisabled] = useState(false);

    const updateData = () => {

        //DEV COOKIES   
        const localcookie = localStorage.getItem('cookie');
        const cookie = localStorage.getItem('cookie');
        // const cookie = getCookieValue(localcookie, 'MUSIC_U');

        function fetchData() {
            //禁用button
            setButtondisabled(true);
            // Progress
            setProgressVisible(true);
            setProgressPercent(10);
            setProgressHint("(Devs)联系Github API");
            // 获取数据
            // 从GithubAPI获取数据
            var amll_data = [];
            async function getLoginStatus(cookie = '') {
                const res = await axios({
                    // url: `https://163.ink2link.cn/login/status?timestamp=${Date.now()}`,1901371647
                    url: `https://163.ink2link.cn/song/url/v1?id=1901371647&level=standard`,
                    method: 'post',
                    data: {
                        cookie,
                    },
                })
                console.log(JSON.stringify(res.data, null, 2));
                // setInfo(JSON.stringify(res.data, null, 2));
                // document.querySelector('#info').innerText = JSON.stringify(res.data, null, 2)

            }
            fetch('https://api.github.com/repos/Steve-xmh/amll-ttml-db/contents/ncm-lyrics')
                .then(response => response.json())
                .then(data => {
                    var maplength = data.length;
                    var i = 0;
                    // 使用 Promise.all 等待所有异步请求完成
                    // 修改获取逻辑 只获取ncm-lyrics/ttml的id
                    const filesName = data;
                    const ttmlFilesInfo = filesName.filter(fileName => fileName.name.endsWith('.ttml'));
                    const promises = ttmlFilesInfo.map(async file => {
                        const ttml_id = file.name.replace(/\.ttml$/, '');
                        const ttml_url = file.html_url;
                        const ttml_downurl = "https://mirror.ghproxy.com/" + file.download_url; //ghproxy 避免raw.gh被ban
                        const time_ver_t = new Date().toLocaleString();
                        const time_ver = time_ver_t + " Devs";

                        if (i == 0) {
                            setProgressPercent(30);
                            setProgressHint("(Devs)匹配歌曲信息");
                        }
                        // 从网易云API获取数据
                        const response = await fetch('https://163.ink2link.cn/song/detail?ids=' + ttml_id);
                        const data = await response.json();
                        const s_name = data.songs[0].name;
                        const s_sname = data.songs[0].ar[0].name;
                        const s_pic = data.songs[0].al.picUrl;

                        if (i == Math.ceil(maplength / 4)) {
                            setProgressPercent(50);
                            setProgressHint("(Devs)匹配文件信息");
                        }

                        const res = await axios({
                            // url: `https://163.ink2link.cn/login/status?timestamp=${Date.now()}`,1901371647
                            url: `https://163.ink2link.cn/song/url/v1?id=` + ttml_id + `&level=standard`,
                            method: 'post',
                            data: {
                                cookie,
                            },
                        })
                        const data_1 = res.data;

                        if (i == Math.ceil(maplength / 1.5)) {
                            setProgressPercent(70);
                            setProgressHint("(Devs)处理数据");
                        }

                        // 部分无版权歌曲统一替换url
                        // console.log(i ,"获取歌曲url" , data_1.data[0].url)
                        console.log("注意", res.data);
                        if (data_1.data[0].url == null) {
                            console.log(i, "(Devs)歌曲url错误,可能为VIP歌曲或版权失效", data_1.data[0].url)
                            data_1.data[0].url = 'http://www.baidu.com';
                        }
                        const s_downurl = data_1.data[0].url.replace(/^http:/, "https:");
                        const newData = { s_id: ttml_id, s_name: s_name, s_sname: s_sname, s_pic: s_pic, s_downurl: s_downurl, ttml_url: ttml_url, ttml_downurl: ttml_downurl, time_ver: time_ver };
                        amll_data.push(newData);
                        i++;
                    });
                    // 等待所有异步请求完成
                    Promise.all(promises)
                        .then(() => {
                            // 所有异步请求完成后执行这里的代码
                            setProgressPercent(80);
                            setProgressHint("(Devs)存储数据");
                            // 存储到 localStorage
                            localStorage.setItem('amlldata', JSON.stringify(amll_data));

                            // 1. 清空存储的数据
                            storedMusicDataString = '';
                            storedMusicData = [];
                            // 2. 获取数据（异步部分）
                            // 3. 从本地存储获取数据
                            storedMusicDataString = localStorage.getItem('amlldata');
                            storedMusicData = JSON.parse(storedMusicDataString);
                            // 4. 更新状态 +歌词总数
                            setAmllver(storedMusicData[0]?.time_ver);
                            setDbCount(storedMusicData.length);

                            setProgressPercent(90);
                            setProgressHint("(Devs)更新视图");
                            // 触发自定义事件localstorageDataChanged
                            window.dispatchEvent(new Event('localstorageDataChanged'));
                            // 启用button
                            setProgressPercent(100);
                            setProgressHint("(Devs)更新完成");
                            setProgressVisible(false);
                            setButtondisabled(false);
                            success();
                            console.log("(Devs)更新数据库完成:");
                            console.log(amll_data);
                        });
                });
        }
        fetchData();
    }

    return (
        <>
            {contextHolder}
            <Button type="text" onClick={() => updateData()} disabled={button_disabled}>数据库版本: {amll_ver} &nbsp; 歌词数: {db_count}</Button>
            <Button type="primary" onClick={() => updateData()} disabled={button_disabled}> 更新</Button>
            {progressVisible && (
                <Button type="text">
                    <Progress
                        type="circle"
                        trailColor="#e6f4ff"
                        percent={progressPercent}
                        strokeWidth={20}
                        size={14}
                        format={(number) => `进行中，已完成${number}%`}
                    />
                    <span
                        style={{
                            marginLeft: 8,
                        }}
                    >
                        {progressHint}
                    </span>
                </Button>
            )}
            <Divider />
            <Input placeholder="API URL 请加入协议头 (本设置暂时无效)" onChange={(e) => setInputValue(e.target.value)} />
            <Divider />
            <Button type="primary" onClick={handleSet} disabled={button_disabled}>设置api</Button>
            <Divider />
            此处更新的Devs数据库版本将不会在顶部工具栏显示, 但是数据库仍有效<br />
            此处的更新功能将会使用您的账号进行数据拉取<br />
            如果您有会员 试听歌曲会被解锁完整版
        </>
    );
}

export default Cookiedb;
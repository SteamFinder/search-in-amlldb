import React, { useState } from 'react';
import { Button, message, Progress } from 'antd';

function Localdb() {

    // 全局通知
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: '更新数据库成功',
        });
    };

    // Progress
    const [progressVisible, setProgressVisible] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [progressHint, setProgressHint] = useState("初始化");

    var storedMusicDataString = localStorage.getItem('amlldata');
    var amll_time_ver;
    if (storedMusicDataString == null) {
        //本地无数据时,使用.
        storedMusicDataString = "{\"time_ver\":\"本地无数据\"}";
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
        function fetchData() {
            //禁用button
            setButtondisabled(true);
            // Progress
            setProgressVisible(true);
            setProgressPercent(10);
            setProgressHint("联系Github API");
            // 获取数据
            // 从GithubAPI获取数据
            var amll_data = [];
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
                        const time_ver = new Date().toLocaleString();

                        if (i == 0) {
                            setProgressPercent(30);
                            setProgressHint("匹配歌曲信息");
                        }
                        // 从网易云API获取数据
                        const response = await fetch('https://163.ink2link.cn/song/detail?ids=' + ttml_id);
                        const data = await response.json();
                        const s_name = data.songs[0].name;
                        const s_sname = data.songs[0].ar[0].name;
                        const s_pic = data.songs[0].al.picUrl;

                        if (i == Math.ceil(maplength / 4)) {
                            setProgressPercent(50);
                            setProgressHint("匹配文件信息");
                        }

                        const response_1 = await fetch('https://163.ink2link.cn/song/url/v1?id=' + ttml_id + '&level=standard');
                        const data_1 = await response_1.json();

                        if (i == Math.ceil(maplength / 1.5)) {
                            setProgressPercent(70);
                            setProgressHint("处理数据");
                        }

                        // 部分无版权歌曲统一替换url
                        // console.log(i ,"获取歌曲url" , data_1.data[0].url)
                        if (data_1.data[0].url == null) {
                            console.log(i, "歌曲url错误,可能为VIP歌曲或版权失效", data_1.data[0].url)
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
                            setProgressHint("存储数据");
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
                            setProgressHint("更新视图");
                            // 触发自定义事件localstorageDataChanged
                            window.dispatchEvent(new Event('localstorageDataChanged'));
                            // 启用button
                            setProgressPercent(100);
                            setProgressHint("更新完成");
                            setProgressVisible(false);
                            setButtondisabled(false);
                            success();
                            console.log("更新数据库完成:");
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
        </>
    );
}

export default Localdb;
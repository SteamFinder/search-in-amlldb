import React, { useState, useEffect } from 'react';
import { Card, Button, Flex } from 'antd';

// function fetchData(){
//     // 获取数据
//     // 从GithubAPI获取数据
//     var amll_data = [];
//     fetch('https://api.github.com/repos/Steve-xmh/amll-ttml-db/contents/lyrics')
//         .then(response => response.json())
//         .then(data => {
//             data.forEach(file => {
//                 const ttml_id = file.name.replace(/\.ttml$/, '');
//                 const ttml_url = file.html_url;
//                 const ttml_downurl = file.download_url;
//                 const time_ver = new Date().toLocaleString();
//                 // 从网易云API获取数据
//                 fetch('https://autumnfish.cn/song/detail?ids=' + ttml_id)
//                     .then(response => response.json())
//                     .then(data => {
//                         const s_name = data.songs[0].name;
//                         const s_sname = data.songs[0].ar[0].name;
//                         const s_pic = data.songs[0].al.picUrl;
//                         // 从网易云API获取歌曲文件数据
//                         fetch('https://autumnfish.cn/song/url/v1?id=' + ttml_id + '&level=standard')
//                             .then(response => response.json())
//                             .then(data => {
//                                 // 部分无版权歌曲统一替换url
//                                 if (data.data[0].url == null) { data.data[0].url = 'http://www.baidu.com' }
//                                 const s_downurl = data.data[0].url.replace(/^http:/, "https:");
//                                 const newData = { s_id: ttml_id, s_name: s_name, s_sname: s_sname, s_pic: s_pic, s_downurl: s_downurl, ttml_url: ttml_url, ttml_downurl: ttml_downurl, time_ver: time_ver };
//                                 amll_data.push(newData);
//                             });
//                     });
//             });
//             console.log(amll_data);
//             // 存储到localStorage
//             localStorage.setItem('amll_data3', JSON.stringify(amll_data));
//             localStorage.setItem('amll_data4', '444');
//         });
// }
/*
    const updateData = () => {
        storedMusicDataString = '';
        storedMusicData = [];
        fetchData();
        storedMusicDataString = localStorage.getItem('amlldata');
        storedMusicData = JSON.parse(storedMusicDataString);
        setAmllver(storedMusicData[0]?.time_ver)
    }
*/

function Localdb() {
    var storedMusicDataString = localStorage.getItem('amlldata');
    var amll_time_ver;
    if (storedMusicDataString == null) {
        //本地无数据时,使用.
        storedMusicDataString = "{\"time_ver\":\"本地无数据\"}";
        var storedMusicData = JSON.parse(storedMusicDataString);
        amll_time_ver = storedMusicData.time_ver
    } else {
        //本地有数据时,使用[0]查询第一个数据的ver
        var storedMusicData = JSON.parse(storedMusicDataString);
        amll_time_ver = storedMusicData[0].time_ver
    }
    const [amll_ver, setAmllver] = useState(amll_time_ver);
    const [button_disabled, setButtondisabled] = useState(false);

    const updateData = () => {
        function fetchData() {
            //禁用button
            setButtondisabled(true);
            // 获取数据
            // 从GithubAPI获取数据
            var amll_data = [];
            fetch('https://api.github.com/repos/Steve-xmh/amll-ttml-db/contents/lyrics')
                .then(response => response.json())
                .then(data => {
                    // 使用 Promise.all 等待所有异步请求完成
                    const promises = data.map(async file => {
                        const ttml_id = file.name.replace(/\.ttml$/, '');
                        const ttml_url = file.html_url;
                        const ttml_downurl = file.download_url;
                        const time_ver = new Date().toLocaleString();
                        // 从网易云API获取数据
                        const response = await fetch('https://autumnfish.cn/song/detail?ids=' + ttml_id);
                        const data = await response.json();
                        const s_name = data.songs[0].name;
                        const s_sname = data.songs[0].ar[0].name;
                        const s_pic = data.songs[0].al.picUrl;
                        const response_1 = await fetch('https://autumnfish.cn/song/url/v1?id=' + ttml_id + '&level=standard');
                        const data_1 = await response_1.json();
                        // 部分无版权歌曲统一替换url
                        if (data_1.data[0].url == null) {
                            data_1.data[0].url = 'http://www.baidu.com';
                        }
                        const s_downurl = data_1.data[0].url.replace(/^http:/, "https:");
                        const newData = { s_id: ttml_id, s_name: s_name, s_sname: s_sname, s_pic: s_pic, s_downurl: s_downurl, ttml_url: ttml_url, ttml_downurl: ttml_downurl, time_ver: time_ver };
                        amll_data.push(newData);
                    });
                    // 等待所有异步请求完成
                    Promise.all(promises)
                        .then(() => {
                            // 所有异步请求完成后执行这里的代码
                            // 存储到 localStorage
                            localStorage.setItem('amlldata', JSON.stringify(amll_data));

                            // 1. 清空存储的数据
                            storedMusicDataString = '';
                            storedMusicData = [];
                            // 2. 获取数据（异步部分）
                            // 3. 从本地存储获取数据
                            storedMusicDataString = localStorage.getItem('amlldata');
                            storedMusicData = JSON.parse(storedMusicDataString);
                            // 4. 更新状态
                            setAmllver(storedMusicData[0]?.time_ver);
                            // 触发自定义事件localstorageDataChanged
                            window.dispatchEvent(new Event('localstorageDataChanged'));
                            // 启用button
                            setButtondisabled(false);
                        });
                });
        }
        fetchData();
    }

    return (
        <>
            <Button type="text" onClick={() => updateData()} loading={button_disabled}>数据库版本: {amll_ver} </Button>
            <Button type="primary" onClick={() => updateData()} disabled={button_disabled}> 更新</Button>
        </>
    );
}

export default Localdb;
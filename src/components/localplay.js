import React, { useState, useRef, useEffect } from 'react';
import { LyricPlayer, BackgroundRender } from "@applemusic-like-lyrics/react";
import { EplorRenderer } from '@applemusic-like-lyrics/core';
import { parseTTML } from '../amll-core-src/lyric/ttml.ts'
import { PlayCircleOutlined, PlayCircleTwoTone } from '@ant-design/icons';
import { Button, Drawer, Progress, notification } from 'antd';
import './localplay.css';
import './SF-D-M.ttf';

//注意 目前amll在npm的仓库不是最新版 目前本项目的amll是dev分支手动覆盖的
//影响 amll/core amll/react

function Localplay() {

    // notification when no s_url
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement) => {
        api.error({
            message: '错误',
            description:
                '该歌曲可能为VIP歌曲或网易云版权失效',
            duration: 5,
            placement,
        });
    };

    // Progress
    const [progressVisible, setProgressVisible] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [progressHint, setProgressHint] = useState("初始化");

    // AMLL Drawer
    const [playing, setPlaying] = useState(false);
    const [size, setSize] = useState();
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setSize('default');
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        pauseAudio();
    };
    const classNames = {
        header: 'css-drawer-header',
        footer: 'css-drawer-footer',
    };

    // 绑定 更新歌词/歌曲
    const [currentTime, setCurrentTime] = useState(0);
    const [lyricLines, setLyricLines] = useState([]);
    const [drawerContent, setDrawerContent] = useState(<audio id="onAudio" controls className="onAudio" />);
    const [drawerFooter, setDrawerFooter ] = useState("");
    const [albumUrl, setAlbumUrl] = useState("");
    // const lyricPlayerRef = useRef(null);
    var playdata;
    var picUrl;

    // Mute audio
    const audioRef = useRef(null);
    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    // 接收Event
    var localdata = [];
    var storedMusicDataString = localStorage.getItem('amllplay');
    if (storedMusicDataString == null || storedMusicDataString == 'null' || storedMusicDataString == '') {
        storedMusicDataString = " { \"s_name\": \"本地无歌曲播放\" } "
        var localdata = [];
    } else {
        // 将字符串解析为数组
        const storedMusicData = JSON.parse(storedMusicDataString);
        // 使用map生成React元素
        localdata.push({
            key: storedMusicData.s_id,
            s_pic: storedMusicData.s_pic,
            s_name: storedMusicData.s_name,
            s_sname: storedMusicData.s_sname,
            s_id: storedMusicData.s_id,
            s_downurl: storedMusicData.s_downurl,
            ttml_downurl: storedMusicData.ttml_downurl,
        })
        playdata = localdata;
    }
    useEffect(() => {
        const handleplayDataChange = () => {
            // 当 localStorage 发生变化时，更新组件的状态

            // Progress
            setProgressVisible(true);
            setProgressPercent(10);
            setProgressHint("获取歌曲信息");

            //处理播放器图标
            setPlaying(true);

            var upddata = [];
            var storedMusicDataString = localStorage.getItem('amllplay');
            const storedMusicData = JSON.parse(storedMusicDataString);

            setProgressPercent(20);
            setProgressHint("查询本地数据");
            console.log("storedMusicData:", storedMusicData);

            // 使用map生成React元素
            upddata.push({
                key: storedMusicData.s_id,
                s_pic: storedMusicData.s_pic,
                s_name: storedMusicData.s_name,
                s_sname: storedMusicData.s_sname,
                s_id: storedMusicData.s_id,
                s_downurl: storedMusicData.s_downurl,
                ttml_downurl: storedMusicData.ttml_downurl,
            })
            playdata = upddata;

            setProgressPercent(40);
            setProgressHint("解析TTML");

            getAmllplayer();

            //处理 TTML歌词
            async function getAmllplayer() {
                try {
                    // console.log("playdata", playdata);
                    // console.log("ttml_url", playdata[0].ttml_downurl)
                    const response = await fetch(playdata[0].ttml_downurl); // Replace with the correct path
                    const ttmlInput = await response.text();
                    // console.log(ttmlInput);
                    const parsedResult = parseTTML(ttmlInput);
                    setLyricLines(parsedResult)

                    // 旧版 audio控件位于Drawer内部 新版 位于title
                    if (playdata[0].s_downurl == "https://www.baidu.com") {
                        openNotification('topLeft');
                    }
                    setDrawerContent(<audio src={playdata[0].s_downurl} id="onAudio" className="onAudio" controls autoPlay />);
                    setDrawerFooter(playdata[0].s_name + " - " + playdata[0].s_sname);

                    setProgressPercent(60);
                    setProgressHint("调用AMLL");

                    showDrawer();
                    executeInOrder();
                    // 使用 Promise.all 等待所有异步操作完成
                    // console.log(parsedResult);
                    // console.log("playdata" , playdata);
                    // console.log("playdata s_downurl" , playdata.s_downurl);
                    // console.log("playdata[0]s_downurl" , playdata[0].s_downurl);
                } catch (error) {
                    console.error('处理TTML时出现错误:', error.message);
                }
            }

            // 逐帧调用AMLL
            function executeInOrder() {

                setProgressPercent(100);
                setProgressHint("完成");

                function progressSuccess() {
                    setProgressVisible(false);
                }

                setTimeout(reBuffer, 1000);
                setTimeout(setBg, 1000);
                setTimeout(progressSuccess, 1000);
                function reBuffer() {
                    const audio = document.getElementById("onAudio");
                    console.log(audio);
                    let lastTime = -1;
                    const frame = (time) => {
                        if (lastTime === -1) {
                            lastTime = time;
                        }
                        if (!audio.paused) {
                            const time = (audio.currentTime * 1000) | 0;
                            setCurrentTime(time);
                        }
                        lastTime = time;
                        requestAnimationFrame(frame);
                    };
                    requestAnimationFrame(frame);
                }
                function setBg() {
                    picUrl = playdata[0].s_pic;
                    console.log('setAlbumUrl:', picUrl);
                    var albumImage = new Image();
                    albumImage.src = picUrl;
                    // albumImage.src = '/test.jpg';
                    // 解决跨域问题
                    albumImage.setAttribute('crossOrigin', '');
                    setAlbumUrl(albumImage);//bgRender
                }
            }
        };
        // 添加事件监听器
        window.addEventListener('playDataChanged', handleplayDataChange);
        // 组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('playDataChanged', handleplayDataChange);
        };
    }, []); // 空数组表示只在组件挂载和卸载时运行
    function getLines(line) {
        // line1 是 EventTarget 对象
        // console.log("getLineEvent", line);
        const line1 = line.line;
        // console.log("getTargetEvent", line1)
        // 访问 line1 的 words 属性
        const swords = line1.splittedWords;
        // 打印 words 数组
        // console.log("getStartWord", swords);
        const starttime = swords[0].startTime;
        // console.log("getStartTime", starttime);
        setCurrentTime(starttime);
        // console.log("setCurrentTime", starttime);
        // 获取 audio 元素
        const saudio = document.getElementById('onAudio');
        // 设置 audio 的当前播放时间为指定的秒数
        const starttimeInSeconds = starttime / 1000;
        saudio.currentTime = starttimeInSeconds;
        // 开始播放 audio
        saudio.play();
        saudio.play().catch(error => {
            // 处理播放被阻止的情况
            console.error('播放被阻止:', error);
        });
    }
    return (
        <>
            {contextHolder}
            {!progressVisible && (
                <Button
                    type="text"
                    icon={playing ? <PlayCircleTwoTone twoToneColor="#52c41a" /> : <PlayCircleOutlined />}
                    onClick={() => showDrawer()}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
            )}
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
            <Drawer title={drawerContent}
                placement="right"
                onClose={onClose}
                open={open}
                mask={false}
                size={size}
                className="playerDrawer"
                style={{
                    position: 'relative',
                    // overflow: "hidden",
                }}
                classNames={classNames}
                footer={drawerFooter}
            >
                <BackgroundRender
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        contain: "paint layout",
                        overflow: "hidden",
                    }}
                    album={albumUrl}
                    renderer={EplorRenderer}
                />
                <LyricPlayer
                    onLyricLineClick={(line) => getLines(line)}
                    alignPosition="0.4"
                    lyricLines={lyricLines}
                    currentTime={currentTime}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '115%',
                        height: '110%',
                        fontFamily: 'SF Pro Display Medium, sans-serif',
                        overflow: "hidden",
                        // fontSize: "var(--amll-lyric-player-font-size,max(min(5vh, 10vw),12px));",
                    }}
                />
            </Drawer>
        </>
    );
}

export default Localplay;

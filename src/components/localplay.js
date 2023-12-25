import React, { useState, useEffect, useRef } from 'react';
import { LyricPlayer } from "@applemusic-like-lyrics/react";
import { parseTTML } from '../amll-core-src/lyric/ttml.ts'
import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, Divider, Space } from 'antd';

function Localplay() {
    // AMLL Drawer
    const [size, setSize] = useState();
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setSize('large');
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        pauseAudio();
    };

    // 绑定 更新歌词/歌曲
    const [s_url, setParsedLyrics] = useState("");
    const [currentTime, setCurrentTime] = useState(0);
    const [lyricLines, setLyricLines] = useState([]);
    const [drawerContent, setDrawerContent] = useState(<audio id="onAudio" controls />);
    var playdata;

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
            var upddata = [];
            var storedMusicDataString = localStorage.getItem('amllplay');
            const storedMusicData = JSON.parse(storedMusicDataString);
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
                    setDrawerContent(<audio src={playdata[0].s_downurl} id="onAudio" controls />);
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
            function executeInOrder() {
                setTimeout(reBuffer, 3000);
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
        console.log("getLineEvent", line);
        const line1 = line.line;
        console.log("getTargetEvent", line1)
        // 访问 line1 的 words 属性
        const swords = line1.splittedWords;
        // 打印 words 数组
        console.log("getStartWord", swords);
        const starttime = swords[0].startTime;
        console.log("getStartTime", starttime);
        setCurrentTime(starttime);
        console.log("setCurrentTime", starttime);
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
            <Button
                type="text"
                icon={<PlayCircleOutlined />}
                onClick={() => showDrawer()}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <Drawer title="AMLL-React Player" placement="bottom" onClose={onClose} open={open} mask={false} size={size}>
                <Space
                    direction="vertical"
                    size="middle"
                    style={{
                        display: 'flex',
                    }}
                >
                    {drawerContent}
                    <Divider />
                    <LyricPlayer onLyricLineClick={(line) => getLines(line)} alignPosition="0.1" lyricLines={lyricLines} currentTime={currentTime} style={{ backgroundColor: 'grey', height: '60vh', width: "98%" }} />
                </Space>
            </Drawer>
        </>
    );
}

export default Localplay;

import React, { useState, useRef, useEffect } from 'react';
import { LyricPlayer, BackgroundRender } from "@applemusic-like-lyrics/react";
import { EplorRenderer } from '@applemusic-like-lyrics/core';
import { parseTTML } from '../amll-core-src/lyric/ttml.ts'
// import { parseTTML } from '../amll-dev-src/packages/bncm/src'
import { Alert } from 'antd';
import './play.css';
import './SF-D-M.ttf';
import './PF-M.ttf';

function Play() {
    var picUrl;
    // 绑定 更新歌词/歌曲
    const [currentTime, setCurrentTime] = useState(0);
    const [lyricLines, setLyricLines] = useState([]);
    const [albumUrl, setAlbumUrl] = useState("");

    useEffect(() => {
        // Parse TTML
        parseTTMLs();
        async function parseTTMLs() {
            const response = await fetch("https://mirror.ghproxy.com/https://raw.githubusercontent.com/Steve-xmh/amll-ttml-db/main/ncm-lyrics/1382781549.ttml"); // Replace with the correct path
            const ttmlInput = await response.text();
            const parsedResult = parseTTML(ttmlInput);
            setLyricLines(parsedResult)
        }

        // 逐帧调用AMLL
        function reBuffer() {
            const audio = document.getElementById("AMLLPlayer");
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
            picUrl = "https://p2.music.126.net/6CB6Jsmb7k7qiJqfMY5Row==/109951164260234943.jpg";
            console.log('[Play]setAlbumUrl:', picUrl);
            var albumImage = new Image();
            albumImage.src = picUrl;
            // albumImage.src = '/test.jpg';
            // 解决跨域问题
            albumImage.setAttribute('crossOrigin', '');
            setAlbumUrl(albumImage);//bgRender
        }
        setTimeout(reBuffer, 1000);
        setTimeout(setBg, 3000);
    }, []);
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
        const saudio = document.getElementById('AMLLPlayer');
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
            <audio id="AMLLPlayer" controls className="AMLLPlayer" src="https://ink2link.cn/83772ys62g6FD711.mp3" autoplay style={{zIndex: 999}} />
            {/* <Alert
                message="Play"
                description="This is play page."
                type="success"
                showIcon
            /> */}
            <BackgroundRender
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    contain: "paint layout",
                    overflow: "hidden",
                }}
                album={albumUrl}
                renderer={EplorRenderer}
            />
            <div className='AMLLFont'>
            <LyricPlayer
                onLyricLineClick={(line) => getLines(line)}
                alignPosition="0.4"
                lyricLines={lyricLines}
                currentTime={currentTime}
                style={{
                    position: 'absolute',
                    paddingLeft: '3vw',
                    width: '100%',
                    height: '100%',
                    fontFamily: 'Search-In-AMLLDB, SF Pro Display Medium, PingFang Medium, sans-serif',
                    overflow: "hidden",
                }}
            />
            </div>
        </>
    );
}

export default Play;
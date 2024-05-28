import "./miniplayer.css"
import React, {useEffect} from "react";
import {Button, Slider, Switch} from "antd";
import {CaretRightOutlined, FastBackwardOutlined, FastForwardOutlined, PauseOutlined} from "@ant-design/icons";
import {useSelector, useDispatch} from 'react-redux';

function MiniPlayer() {
    const song = useSelector(state => state.song);
    const isPlaying = useSelector(state => state.isPlaying);
    const progress = useSelector(state => state.progress);
    const picUrl = useSelector(state => state.picUrl);
    const dispatch = useDispatch();
    const audio = useSelector(state => state.audio);

    const togglePlay = () => {
        //没有歌曲时不执行
        if (!song) {
            return;
        }
        dispatch({type: 'TOGGLE_PLAY'});
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    };

    const changeProgress = (newProgress) => {
        dispatch({type: 'SET_PROGRESS', progress: newProgress});
        audio.currentTime = newProgress / 100 * audio.duration;
    };

    useEffect(() => {
        const handleTimeUpdate = () => {
            const newProgress = (audio.currentTime / audio.duration) * 100;
            dispatch({type: 'SET_PROGRESS', progress: newProgress});
        };

        if (audio) {

            //播放时更新isPlaying
            audio.addEventListener('play', () => {
                dispatch({type: 'TOGGLE_PLAY'});
            });

            audio.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                if (audio) {
                    audio.removeEventListener('timeupdate', handleTimeUpdate);
                }
            };
        }
    }, [audio, dispatch]);

    return (
        <div className="mini-player">
            <div className="audio-action">
                <FastBackwardOutlined style={{
                    fontSize: "25px",
                    marginRight: "10px"
                }}/>
                {isPlaying ? <PauseOutlined onClick={togglePlay} style={{
                    fontSize: "25px",
                    marginRight: "10px"
                }}/> : <CaretRightOutlined onClick={togglePlay} style={{
                    fontSize: "25px",
                    marginRight: "10px"
                }}/>}
                <FastForwardOutlined style={{
                    fontSize: "25px",
                    marginRight: "10px"
                }}/>
            </div>
            <img src={picUrl ? picUrl : "https://via.placeholder.com/40"} alt="album cover"/>
            <div className="info-conainer">
                <div className="info-inner">
                    <span>{song ? song.s_name : "Song Name"}</span><span>&nbsp;-&nbsp;{song ? song.s_sname : "Artist Name"}</span>
                </div>
                <Slider className="slider" range value={progress} defaultValue={progress} onChange={changeProgress}
                        tooltip={{open: false}} disabled={!song}/>
            </div>

        </div>
    )
}

export default MiniPlayer;

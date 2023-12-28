import React, { useState } from 'react';
import { Button, message, Progress, Input, Divider, Space } from 'antd';
import axios from 'axios';

function Cookieuser() {


    const [userdata, setUserdata] = useState("NO USER INFO");
    function getUser() {
        var storcookie = localStorage.getItem('cookie');
        // const cookie = getCookieValue(localcookie, 'MUSIC_U');
        console.log("storcookie", storcookie)

        getLoginStatus(storcookie);

        async function getLoginStatus(cookie = '') {
            const res = await axios({
                url: `https://163.ink2link.cn/login/status?timestamp=${Date.now()}`,
                // url: `https://163.ink2link.cn/song/url/v1?id=1901371647&level=standard`,
                method: 'post',
                data: {
                    cookie,
                },
            })
            console.log("User Login",JSON.stringify(res.data, null, 2));
            setUserdata(JSON.stringify(res.data, null, 2));
            // setInfo(JSON.stringify(res.data, null, 2));
            // document.querySelector('#info').innerText = JSON.stringify(res.data, null, 2)
        }
    }
    function logOut(){
        var storcookie = localStorage.getItem('cookie');
        userOut(storcookie);

        async function userOut(cookie = '') {
            const res = await axios({
                url: `https://163.ink2link.cn/logout`,
                // url: `https://163.ink2link.cn/song/url/v1?id=1901371647&level=standard`,
                method: 'post',
                data: {
                    cookie,
                },
            })
            console.log("User Logout",JSON.stringify(res.data, null, 2));
            setUserdata(JSON.stringify(res.data, null, 2));
            // setInfo(JSON.stringify(res.data, null, 2));
            // document.querySelector('#info').innerText = JSON.stringify(res.data, null, 2)
        }
    }

    return (
        <>
            <Button type="primary" onClick={() => getUser()}>getUser</Button>
            <Divider />
            <Button type="primary" onClick={() => logOut()}>logOut</Button>
            <Divider />
            {userdata}
        </>
    );

}
export default Cookieuser;
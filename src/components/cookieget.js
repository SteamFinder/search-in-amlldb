import axios from 'axios';
import react, { useState } from 'react';
import { Button, notification, Divider } from 'antd';
import Testimg from '../logo.svg';

function Cookieget() {
    // notification when no s_url
    const [api, contextHolder] = notification.useNotification();
    const openSuccess = (placement) => {
        api.success({
            message: '成功',
            description:
                '您已成功通过QR Code登录',
            duration: 5,
            placement,
        });
    };

    const openError = (placement) => {
        api.error({
            message: '错误',
            description:
                '二维码已过期, 请重新获取',
            duration: 5,
            placement,
        });
    };

    const [qrimg, setQRimg] = useState("qrimg");
    const [info, setInfo] = useState("Info");

    const qrlogin = () => {
        async function checkStatus(key) {
            const res = await axios({
                url: `https://163.ink2link.cn/login/qr/check?key=${key}&timestamp=${Date.now()}`,
            })
            return res.data
        }
        async function getLoginStatus(cookie = '') {
            const res = await axios({
                url: `https://163.ink2link.cn/login/status?timestamp=${Date.now()}`,
                method: 'post',
                data: {
                    cookie,
                },
            })
            setInfo(JSON.stringify(res.data, null, 2));
            // document.querySelector('#info').innerText = JSON.stringify(res.data, null, 2)
        }
        async function login() {
            localStorage.setItem('cookie', "");
            let timer
            let timestamp = Date.now()
            const cookie = localStorage.getItem('cookie')
            getLoginStatus(cookie)
            const res = await axios({
                url: `https://163.ink2link.cn/login/qr/key?timestamp=${Date.now()}`,
            })
            const key = res.data.data.unikey
            const res2 = await axios({
                url: `https://163.ink2link.cn/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`,
            })
            // document.querySelector('#qrImg').src = res2.data.data.qrimg
            setQRimg(res2.data.data.qrimg);

            timer = setInterval(async () => {
                const statusRes = await checkStatus(key)
                if (statusRes.code === 800) {
                    // alert('二维码已过期,请重新获取')
                    openError("topRight")
                    clearInterval(timer)
                }
                if (statusRes.code === 803) {
                    // 这一步会返回cookie
                    clearInterval(timer)
                    // alert('授权登录成功')
                    openSuccess("topRight")
                    await getLoginStatus(statusRes.cookie)
                    localStorage.setItem('cookie', statusRes.cookie)
                    console.log("statusRes.cookie",statusRes.cookie)
                }
            }, 3000)
        }
        login();
    };

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={() => qrlogin()}>getQR</Button>
            <Divider />
            <img src={qrimg} />
            <Divider />
            {info}
            {/* <img id="qrImg" />
            <div id="info" className="info"></div> */}
        </>
    );
}
export default Cookieget;
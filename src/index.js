import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from 'react-router-dom';
import {Provider} from 'react-redux';
import router from './router';
import store from './redux/store'; // 引入你的store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}> {/* 使用Provider组件包裹你的应用，并传入store作为props */}
            <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>
);

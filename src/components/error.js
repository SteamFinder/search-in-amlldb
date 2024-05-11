import React from 'react';
import { Alert } from 'antd';

function Error() {
    return (
        <Alert
            message="错误"
            description="未知的路由项, 请检查您的URL路径"
            type="error"
            showIcon
        />
    );
}

export default Error;
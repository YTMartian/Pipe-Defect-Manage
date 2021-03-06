import axios from "axios";


const request = axios.create({
    baseURL: "http://127.0.0.1:8000/blog/",
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
    timeout: 7000,
    responseType: 'json',
    headers: {
        "content-type": "application/json" //将表单数据传递转化为form-data类型
    },
});

export default request;

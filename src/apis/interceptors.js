import axios from "axios";

const instance = axios.create({
    baseURL: "/",
    timeout: 30000,
});

// 請求攔截器
instance.interceptors.request.use(
    config => {
        // 請求前做點什麼？
        if (!config.data) {
            config.data = {};
        }

        return config;
    },
    error => {
        // 處理請求錯誤
        console.log(error); // 用於調試
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => {
        const res = response.data;

        // 正常
        if (res.code === 0) {
            return res;
            // 如果有特定的錯誤可以在這邊一起處理
            // }else if(res.code === 10000){
            //     return res;
        } else {
            // TODO 顯示錯誤
            return res;
        }
    },
    err => {
        if (err && err.response) {
            switch (err.response.status) {
                case 404:
                    console.log("找不到該頁面");
                    break;
                case 500:
                    console.log("伺服器出錯");
                    break;
                case 503:
                    console.log("服務失效");
                    break;
                default:
                    console.log(`連接錯誤${err.response.status}`);
            }
        } else {
            console.log("連接到服務器失敗");
        }
        return Promise.resolve(err.response);
    }
);

export default instance;

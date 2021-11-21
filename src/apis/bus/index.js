import axios from "../interceptors";
import { GetAuthorizationHeader } from "./authorization";
import { serialize } from "@/apis/helpers";

const config = {
    baseURL: "https://ptx.transportdata.tw/MOTC/v2/Bus",
    "content-type": "application/json; charset=utf-8",
    headers: GetAuthorizationHeader(),
};

// https://ptx.transportdata.tw/MOTC?t=Tourism&v=2#!/Tourism/TourismApi_ScenicSpot
export const getCities = (type = "array") => {
    const cities = {
        臺北市: "Taipei",
        新北市: "NewTaipei",
        桃園市: "Taoyuan",
        臺中市: "Taichung",
        臺南市: "Tainan",
        高雄市: "Kaohsiung",
        基隆市: "Keelung",
        新竹市: "Hsinchu",
        新竹縣: "HsinchuCounty",
        苗栗縣: "MiaoliCounty",
        彰化縣: "ChanghuaCounty",
        南投縣: "NantouCounty",
        雲林縣: "YunlinCounty",
        嘉義縣: "ChiayiCounty",
        嘉義市: "Chiayi",
        屏東縣: "PingtungCounty",
        宜蘭縣: "YilanCounty",
        花蓮縣: "HualienCounty",
        臺東縣: "TaitungCounty",
        金門縣: "KinmenCounty",
        澎湖縣: "PenghuCounty",
        連江縣: "LienchiangCounty",
    };
    return new Promise(resolve => {
        setTimeout(() => {
            switch (type) {
                case "array":
                    const result = [];
                    for (const [key, value] of Object.entries(cities)) {
                        result.push({
                            zh: key,
                            en: value,
                        });
                    }
                    resolve(result);
                    break;
                case "object":
                default:
                    resolve(cities);
                    break;
            }
        }, 0);
    });
};

export const getRandomCity = async () => {
    return new Promise(async resolve => {
        const cities = await getCities();
        resolve(cities[Math.floor(Math.random() * (cities.length - 1))]);
    });
};

/**
 *  GET /v2/Bike/Station/{City}
 *  取得指定[縣市]的公共自行車租借站位資料
 *  @params City {Object}
 *  @params params { $select, $filter, $orderby, $top, $skip, $spatialFilter, health }
 */
// export const getBikeStations = (City, params = {}) => {
//     const query = Object.keys(params).length !== 0 ? `?${serialize(params)}` : "";

//     return axios.get(`/Station/${City}${query}`, {
//         ...config,
//     });
// };

/**
 *  GET /v2/Bike/Availability/{City}
 *  取得動態指定[縣市]的公共自行車即時車位資料
 *  @params City {Object}
 *  @params params { $select, $filter, $orderby, $top, $skip, $spatialFilter, health }
 */
// export const getBikeAvailability = (City, params = {}) => {
//     const query = Object.keys(params).length !== 0 ? `?${serialize(params)}` : "";

//     return axios.get(`/Availability/${City}${query}`, {
//         ...config,
//     });
// };

/**
 *  GET /v2/Cycling/Shape/{City}
 *  取得指定縣市之自行車道路網圖資
 *  @params City {Object}
 *  @params params { $select, $filter, $orderby, $top, $skip, $spatialFilter, health }
 */
// export const getCyclingShape = (City, params = {}) => {
//     const query = Object.keys(params).length !== 0 ? `?${serialize(params)}` : "";

//     return axios.get(`/Cycling/Shape/${City}${query}`, {
//         ...config,
//     });
// };

/**
 *  GET /v2/Bike/Station/NearBy
 *  取得指定[位置,範圍]的全臺公共自行車租借站位資料
 *  @params City {Object}
 *  @params params { $select, $filter, $orderby, $top, $skip, $spatialFilter, health }
 */
// export const getBikeStationNearBy = (params = {}) => {
//     const query = Object.keys(params).length !== 0 ? `?${serialize(params)}` : "";

//     return axios.get(`/Bike/Station/NearBy${query}`, {
//         ...config,
//     });
// };

/**
 *  GET /v2/Bike/Availability/NearBy
 *  取得指定[位置,範圍]的全臺公共自行車即時車位資料
 *  @params City {Object}
 *  @params params { $select, $filter, $orderby, $top, $skip, $spatialFilter, health }
 */
// export const getBikeAvailabilityNearBy = (params = {}) => {
//     const query = Object.keys(params).length !== 0 ? `?${serialize(params)}` : "";

//     return axios.get(`/Bike/Availability/NearBy${query}`, {
//         ...config,
//     });
// };

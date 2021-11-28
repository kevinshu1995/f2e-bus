import axios from "../interceptors";
import { GetAuthorizationHeader } from "./authorization";
import { serialize } from "@/apis/helpers";
import { distance } from "@/plugins/mixins.js";

const config = date => {
    return {
        baseURL: "https://ptx.transportdata.tw/MOTC/v2/Bus",
        "content-type": "application/json; charset=utf-8",
        headers: GetAuthorizationHeader(date),
    };
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
 *
 * @param {*} params
 * @returns
 */
export const GET_currentCity = async ({ lat = "", lng = "" }) => {
    if (!lat || !lng) return null;
    try {
        const nearbyStops = await GET_NearbyStops({
            $spatialFilter: `nearby(${lat}, ${lng}, 1000)`,
            $filter: `City ne null`,
        });
        return nearbyStops.reduce((target, current) => {
            const { PositionLon, PositionLat } = current.StopPosition;
            const currentDistance = distance([PositionLon, PositionLat], [lat, lng]);
            if (!target.distance || target.distance > currentDistance) return { ...current, currentDistance };
            return target;
        }, {});
    } catch (error) {
        console.error("GET_currentCity", error);
        return null;
    }
};

/**
 *  GET /v2/Bus/EstimatedTimeOfArrival/NearBy
 *  取得指定[位置,範圍]的全臺公車預估到站資料(N1)
 *  @param {Object} params { $select, $filter, $orderby, $top, $skip, $spatialFilter: required, health }
 */
export const GET_NearbyEstimatedTimeOfArrival = (params = {}) => {
    const query = Object.keys(params).length !== 0 ? `?${serialize(params)}` : "";
    return axios.get(`/EstimatedTimeOfArrival/NearBy${query}`, {
        ...config(new Date()),
    });
};

/**
 *  GET /v2/Bus/EstimatedTimeOfArrival/City/{City}/PassThrough/Station/{StationID}
 *  取得指定[縣市],[站位]的市區公車預估到站資料(N1)
 *  @param {String} City
 *  @param {String} StationID
 *  @param {Object} params { $select, $filter, $orderby, $top, $skip, $spatialFilter: required, health }
 */
export const GET_StationEstimatedTimeOfArrival = (city = "", stationId = "", params = {}) => {
    const query = Object.keys(params).length !== 0 ? `?${serialize(params)}` : "";
    return axios.get(`/EstimatedTimeOfArrival/City/${city}/PassThrough/Station/${stationId}${query}`, {
        ...config(new Date()),
    });
};

/**
 *  /v2/Bus/RealTimeNearStop/City/{City}/PassThrough/Station/{StationID}
 *  取得指定[縣市],[站位]的市區公車動態定點資料(A2)
 *  @param {String} City
 *  @param {String} StationID
 *  @param {Object} params { $select, $filter, $orderby, $top, $skip, $spatialFilter: required, health }
 */
export const GET_StationRealTimeNearStop = (city = "", stationId = "", params = {}) => {
    const query = Object.keys(params).length !== 0 ? `?${serialize(params)}` : "";
    return axios.get(`/RealTimeNearStop/City/${city}/PassThrough/Station/${stationId}${query}`, {
        ...config(new Date()),
    });
};

/**
 *  GET /v2/Bus/Route/City/{City}/PassThrough/Station/{StationID}
 *  取得指定[縣市],[站位]的市區公車路線資料
 *  @param {String} City
 *  @param {String} StationID
 *  @param {Object} params { $select, $filter, $orderby, $top, $skip, $spatialFilter: required, health }
 */
export const GET_RouteInfo = (city = "", stationId = "", params = {}) => {
    const query = Object.keys(params).length !== 0 ? `?${serialize(params)}` : "";
    return axios.get(`/Route/City/${city}/PassThrough/Station/${stationId}${query}`, {
        ...config(new Date()),
    });
};

/**
 *  /v2/Bus/Stop/NearBy
 *  取得指定[位置,範圍]的全臺公車站牌資料
 *  @param {Object} params { $select, $filter, $orderby, $top, $skip, $spatialFilter, health }
 */
export const GET_NearbyStops = (params = {}) => {
    const query = Object.keys(params).length !== 0 ? `?${serialize(params)}` : "";

    return axios.get(`/Stop/NearBy${query}`, {
        ...config(new Date()),
    });
};

/**
 *  GET /v2/Bus/Station/NearBy
 *  取得指定[位置,範圍]的全臺公車站位資料
 *  @param {Object} params { $select, $filter, $orderby, $top, $skip, $spatialFilter, health }
 */
export const GET_NearbyStations = (params = {}) => {
    const query = Object.keys(params).length !== 0 ? `?${serialize(params)}` : "";

    return axios.get(`/Station/NearBy${query}`, {
        ...config(new Date()),
    });
};

export function ISO_cityCode(cityCode = "") {
    const iso_to_cityValue = {
        TPE: "Taipei",
        NWT: "NewTaipei",
        TAO: "Taoyuan",
        TXG: "Taichung",
        TNN: "Tainan",
        KHH: "Kaohsiung",
        KEE: "Keelung",
        HSZ: "Hsinchu",
        HSQ: "HsinchuCounty",
        MIA: "MiaoliCounty",
        CHA: "ChanghuaCounty",
        NAN: "NantouCounty",
        YUN: "YunlinCounty",
        CYQ: "ChiayiCounty",
        CYI: "Chiayi",
        PIF: "PingtungCounty",
        ILA: "YilanCounty",
        HUA: "HualienCounty",
        TTT: "TaitungCounty",
        KIN: "KinmenCounty",
        PEN: "PenghuCounty",
        LIE: "LienchiangCounty",
    };
    if (!iso_to_cityValue[cityCode]) {
        console.log("找不到 city code");
        return "";
    }
    return iso_to_cityValue[cityCode];
}

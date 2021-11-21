import jsSHA from "jssha";

export function GetAuthorizationHeader() {
    var AppID = "e77d946a64da48c5b1cf8f2eec92ddb6";
    var AppKey = "92245sN-nGRg4j10sTUSiw8cYGI";

    var GMTString = new Date().toGMTString();
    var ShaObj = new jsSHA("SHA-1", "TEXT", {
        hmacKey: { value: AppKey, format: "TEXT" },
        encoding: "UTF8",
    });
    ShaObj.update("x-date: " + GMTString);
    var HMAC = ShaObj.getHash("B64");
    var Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"';

    return { Authorization: Authorization, "X-Date": GMTString /*,'Accept-Encoding': 'gzip'*/ }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}
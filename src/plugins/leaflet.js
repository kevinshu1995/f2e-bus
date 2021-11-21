import "leaflet/dist/leaflet.css";
import "leaflet";

const defaultPosition = [25.0466152, 121.5159722];

function initMap() {
    const map = L.map("map", {
        center: defaultPosition,
        zoom: 16,
        minZoom: 8,
        maxZoom: 18,
        preferCanvas: true,
        maxBounds: [
            [25.750424835909385, 122.72899398813598],
            [21.570610571132676, 118.75743637094848],
        ],
        preferCanvas: true,
        zoomControl: false,
    });
    const token = "pk.eyJ1Ijoia2V2aW5od3MiLCJhIjoiY2t3NTV6amhqMjkwdDJwbm9lM3JnZG9tdSJ9.88tQ3UDCZp1i09IeXpTg6A";
    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`, {
        attribution: `<span class="pr-2">
                Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>
            </span>`,
        id: "mapbox/dark-v10",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: token,
    }).addTo(map);
    return map;
}

export { initMap };

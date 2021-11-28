import "leaflet/dist/leaflet.css";
import "leaflet";

const defaultLocations = {
    taipei: [25.0466152, 121.5159722],
    zhongLi: [24.956063294889482, 121.21563434600831],
    taiChung: [24.147703227978166, 120.67296981811525],
};
const defaultPosition = defaultLocations.taiChung;

const leaflet = L;

const iconOptions = {
    iconSize: [32, 32], // size of the icon
    shadowSize: [0, 0], // size of the shadow
    iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 0], // the same for the shadow
    popupAnchor: [0, -24], // point from which the popup should open relative to the iconAnchor
};

const icons = {
    default: L.icon({
        iconUrl: "/mapMarker-default.svg",
        ...iconOptions,
    }),
    outline: L.icon({
        iconUrl: "/mapMarker-outline.svg",
        ...iconOptions,
    }),
    active: L.icon({
        iconUrl: "/mapMarker-active.svg",
        ...iconOptions,
    }),
    self: L.icon({
        iconUrl: "/mapMarker-currentPosition.svg",
        iconSize: [22, 22], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [11, 11], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0], // the same for the shadow
        popupAnchor: [0, -19], // point from which the popup should open relative to the iconAnchor
    }),
};

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

export { initMap, leaflet, icons };

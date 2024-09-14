const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.log(`error in geolocation : ${error}`);
    },
        {
            enableHighAccuracy: true,
            timeout: 5000, // it will send new location after every 5 sec
            maximumAge: 0, // for no caching always pick new data and not cached data
        })
}

var map = L.map('map').setView([0, 0], 16);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Trackify(vipin yadav's application)"
}).addTo(map);

const markers = {};

socket.on("received-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (markers[id]) { markers[id].setLatLng([latitude, longitude]); }
    else {
        markers[id] = L.marker(([latitude, longitude])).addTo(map);
    }

})


socket.on("User-disconnected", (id) => {

    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
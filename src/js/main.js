const countryTimezone = require('country-timezone');
const L = require('leaflet');
const moment = require('moment');
const geoTz = require('geo-tz');

require('moment-timezone');
require('../css/style.scss');
require('../../node_modules/leaflet/dist/leaflet.css');

const gu = require('./genUtility');

console.log(`new2`);

// Variable Declarations
const timeDateContainer = gu.selClass('date-day');
const descriptContainer = gu.selClass('weather-desc');
const outerContainer = gu.selClass('outer-container');
const iconContainer = gu.selClass('weather-icon');
const iconTempDesc = gu.selClass('temp-icon-desc');
const inputElem = gu.crElem('input');
const imgElem = gu.crElem('img');
const mapOpt = gu.crElem('div');
const icon = gu.crElem('img');
descriptContainer.insertBefore(inputElem, iconTempDesc);
inputElem.className = 'weather-desc__input';
inputElem.setAttribute('maxlength', '30');
inputElem.setAttribute('type', 'text');
inputElem.setAttribute('placeholder', 'City');
imgElem.className = 'weather-icon__img';
icon.className = 'weather-icon__img';
let lastDesc;

// important vars
const apiKey = 'f80c5ae3ac3a4eb1bf965456210404';
let mapLastLat = 51.04;
let mapLastLng = -0.64;
let lastVal = inputElem.value;
let raw = moment.tz(moment(), 'Asia/Tokyo');
inputElem.value = 'Manila';

let dateTime = raw.format('LLL');
const thirdSpace = gu.find(' ', dateTime)[2];

// tool func
function getTz(lat, lang) {
    return geoTz(lat, lang)[0];
}
function displayError(message) {
    const errorBoxContainer = document.querySelector('.error-box');
    const errorMsg = document.querySelector('.error-box__message');
    errorMsg.textContent = message;
    errorBoxContainer.className += ' fade-in';
    setTimeout(() => {
        errorBoxContainer.className = errorBoxContainer.className.replace(
            `${errorBoxContainer.className.slice(9, 17)}`,
            ''
        );
    }, 3000);
}
async function weathApi(place) {
    iconTempDesc.textContent = 'Loading...';
    const a = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${place}`
    );
    const data = await a.json();
    return data;
}
function displayWeathApiRes(data) {
    iconContainer.removeChild(document.querySelector('.weather-icon__img'));
    imgElem.src = `https://${data.current.condition.icon.slice(2)}`;
    iconTempDesc.textContent = `${data.current.condition.text} \r\n ${data.current.temp_c}\u00B0C`;
    iconContainer.appendChild(imgElem);
}
function moveTime() {
    setTimeout(() => {
        raw = moment.tz(moment(), `${getTz(mapLastLat, mapLastLng)}`);
        dateTime = raw.format('LLL');
        timeDateContainer.textContent = `${dateTime.slice(
            thirdSpace + 1
        )} - ${raw.format('ddd')}\r\n${raw.format('L')}`;
        console.log('+1');
        moveTime();
    }, 60000);
}
function initialDisplay() {
    // Initial time and date display
    timeDateContainer.textContent = `${dateTime.slice(
        thirdSpace + 1
    )} - ${raw.format('ddd')}\r\n${raw.format('L')}`;
    moveTime();
    // Initial weather display
    (async function () {
        iconTempDesc.textContent = 'Loading...';
        const a = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${inputElem.value}`
        );
        const data = await a.json();
        icon.src = `https://${data.current.condition.icon.slice(2)}`;
        iconContainer.appendChild(icon);
        iconTempDesc.textContent = `${data.current.condition.text} \r\n ${data.current.temp_c}\u00B0C`;
        lastDesc = iconTempDesc.textContent;
        // iconLink = icon.src;
    })();
}
initialDisplay();

// Events
inputElem.addEventListener('change', async () => {
    if (inputElem.value !== lastVal && inputElem.value !== '') {
        // Check if input is non equal to last val and nonempty
        const p = inputElem.value.match(/[\s]/);
        const q = inputElem.value.match(/[0-9]/g);
        if ((!p && !q) || (p && !q)) {
            // Check if input contains no space and no numbers, or spaces but not numbers
            const data = await weathApi(inputElem.value);
            console.log(data);
            if (data.error) {
                displayError(`Uh oh, no result for "${inputElem.value}"`);
                iconTempDesc.textContent = lastDesc;
                inputElem.value = lastVal;
            } else if (inputElem.value === data.location.name) {
                // Check if input matches the location
                lastVal = inputElem.value;
                displayWeathApiRes(data);
                raw = moment.tz(
                    moment(),
                    countryTimezone.getTimezones(inputElem.value)[0]
                );
                dateTime = raw.format('LLL');
                timeDateContainer.textContent = `${dateTime.slice(
                    thirdSpace + 1
                )} - ${raw.format('ddd')}\r\n${raw.format('L')}`;
            } else {
                displayError(`Uh oh, no result for "${inputElem.value}"`);
                iconTempDesc.textContent = lastDesc;
                inputElem.value = lastVal;
            }
        } else {
            displayError('Hm, only letters are allowed');
            inputElem.value = lastVal;
        }
    } else {
        displayError("Nope, it can't be blank");
        inputElem.value = lastVal;
    }
});
inputElem.addEventListener('focusin', () => {
    mapOpt.setAttribute('class', 'mapOpt');
    mapOpt.textContent = 'Use a map instead';
    descriptContainer.insertBefore(mapOpt, iconTempDesc);
});
inputElem.addEventListener('focusout', () => {
    setTimeout(() => {
        mapOpt.className += ' fade-out';
        setTimeout(() => {
            mapOpt.remove();
        }, 1000);
    }, 1000);
});
mapOpt.addEventListener('click', async () => {
    const mapDiv = gu.crElem('div');
    mapDiv.id = 'map';
    outerContainer.appendChild(mapDiv);

    const mymap = L.map('map', {
        zoomControl: false,
    }).setView([mapLastLat, mapLastLng], 13);
    L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken:
                'pk.eyJ1Ijoic2tyci10ZWNoIiwiYSI6ImNrbjVwbG55MTA1OWoydXF2a2FoZ2dnNzAifQ.6S7NXcvOygILiPJoo23ceQ',
        }
    ).addTo(mymap);
    const iconRetinaUrl = '../../img/marker-icon-2x.png';
    const iconUrl = '../../img/marker-icon.png';
    const shadowUrl = '../../img/marker-shadow.png';

    L.Marker.prototype.options.icon = L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
    });
    const markerA = L.marker([mapLastLat, mapLastLng], {
        draggable: true,
    }).addTo(mymap);
    L.control
        .zoom({
            position: 'topright',
        })
        .addTo(mymap);
    // Important variable for events below
    let latLng = `${mapLastLat}, ${mapLastLng}`;
    // Variables for userPlace and backElem event
    const userPlace = gu.crElem('div');
    const backElem = gu.crElem('div');
    userPlace.className = 'user-place';
    backElem.className = 'back-btn';
    backElem.textContent = '<';
    userPlace.textContent = 'Set this place';
    outerContainer.appendChild(userPlace);
    outerContainer.appendChild(backElem);

    // Events inside map
    markerA.on('moveend', (e) => {
        const lat = e.sourceTarget._latlng.lat
            .toString()
            .slice(0, e.sourceTarget._latlng.lat.toString().indexOf('.') + 5);
        const lng = e.sourceTarget._latlng.lng
            .toString()
            .slice(0, e.sourceTarget._latlng.lat.toString().indexOf('.') + 5);
        latLng = `${lat},${lng}`;
        mapLastLat = Number(lat);
        mapLastLng = Number(lng);
    });
    mymap.on('click', (e) => {
        markerA.setLatLng(e.latlng);
        const lat = e.latlng
            .toString()
            .slice(
                e.latlng.toString().indexOf('(') + 1,
                e.latlng.toString().indexOf(')')
            )
            .replace(' ', '')
            .slice(
                0,
                e.latlng
                    .toString()
                    .slice(
                        e.latlng.toString().indexOf('(') + 1,
                        e.latlng.toString().indexOf(')')
                    )
                    .replace(' ', '')
                    .indexOf(',')
            )
            .slice(
                0,
                e.latlng
                    .toString()
                    .slice(
                        e.latlng.toString().indexOf('(') + 1,
                        e.latlng.toString().indexOf(')')
                    )
                    .replace(' ', '')
                    .slice(
                        0,
                        e.latlng
                            .toString()
                            .slice(
                                e.latlng.toString().indexOf('(') + 1,
                                e.latlng.toString().indexOf(')')
                            )
                            .replace(' ', '')
                            .indexOf(',')
                    )
                    .indexOf('.') + 5
            );
        const lng = e.latlng
            .toString()
            .slice(
                e.latlng.toString().indexOf('(') + 1,
                e.latlng.toString().indexOf(')')
            )
            .replace(' ', '')
            .slice(
                e.latlng
                    .toString()
                    .slice(
                        e.latlng.toString().indexOf('(') + 1,
                        e.latlng.toString().indexOf(')')
                    )
                    .replace(' ', '')
                    .indexOf(',') + 1
            )
            .slice(
                0,
                e.latlng
                    .toString()
                    .slice(
                        e.latlng.toString().indexOf('(') + 1,
                        e.latlng.toString().indexOf(')')
                    )
                    .replace(' ', '')
                    .slice(
                        e.latlng
                            .toString()
                            .slice(
                                e.latlng.toString().indexOf('(') + 1,
                                e.latlng.toString().indexOf(')')
                            )
                            .replace(' ', '')
                            .indexOf(',') + 1
                    )
                    .indexOf('.') + 5
            );
        latLng = `${lat},${lng}`;
        mapLastLat = Number(lat);
        mapLastLng = Number(lng);
    });
    userPlace.addEventListener('click', async () => {
        mapDiv.remove();
        userPlace.remove();
        backElem.remove();
        displayWeathApiRes(await weathApi(latLng));
        inputElem.value = latLng;
        raw = moment.tz(moment(), `${getTz(mapLastLat, mapLastLng)}`);
        dateTime = raw.format('LLL');
        timeDateContainer.textContent = `${dateTime.slice(
            thirdSpace + 1
        )} - ${raw.format('ddd')}\r\n${raw.format('L')}`;
    });
    backElem.addEventListener('click', () => {
        mapDiv.remove();
        userPlace.remove();
        backElem.remove();
    });
});

/*
2. store user's location on localStorage then put it in the input.value
3. automatically get the user's location via geolocation api

/*
1. set the initial place or lat based on users position or last input using localStorage
2. get the time based on given point in map

0. change pointer icon to red
0.1. add transition when opening and closing map
*/

(function outer() {
    const height = window.innerHeight;
    const width = window.innerWidth;

    const outerContainer = document.querySelector(`.outer-container`);
    outerContainer.style.height = `${height}px`;
    outerContainer.style.width = `${width}px`;

    const innerContainer = document.querySelector(`.inner-container`);
    innerContainer.style.width = `${width * 0.50}px`;
    innerContainer.style.height = `${height * 0.90}px`;

    const navElem = document.querySelector(`.nav`);
    const iconContainer = document.querySelector(`.icon-container`);
    const iconTempDesc = document.querySelector(`.icon-temp-desc`);
    const descriptContainer = document.querySelector(`.description-container`);

    const inputElem = document.createElement(`input`);
    const icon = document.createElement(`img`);

    inputElem.setAttribute(`type`, `text`);
    inputElem.setAttribute(`placeholder`, `City`);

    descriptContainer.insertBefore(inputElem, iconTempDesc);

    inputElem.value = 'Manila';

    function displayError(message) {
        const errorBoxContainer = document.querySelector(`.error-box-container`);
        const errorIcon = document.querySelector(`.error-box-container img`);
        const errorMsg = document.querySelector(`.error-message`);

        errorMsg.textContent = message;

        errorBoxContainer.className += " fade-in";

        setTimeout(() => {
            errorBoxContainer.className = errorBoxContainer.className.replace(`${errorBoxContainer.className.slice(19, 27)}`, ``);


        }, 3000);

    }
    async function weathApi(place) {
        iconTempDesc.textContent = `Loading...`;
        const a = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${place}`);
        console.log(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${place}`);
        const data = await a.json();
        return data;

    }
    function displayWeathApiRes(data) {
        iconTempDesc.textContent = `${data.current.condition.text} \r\n ${data.current.temp_c}\u00B0C`;

        iconContainer.removeChild(document.querySelector(`.icon-container img`));
        const imgElem = document.createElement(`img`);
        imgElem.src = `https://${data.current.condition.icon.slice(2)}`;
        iconContainer.appendChild(imgElem);
    }

    let lastVal = inputElem.value;
    let lastDesc;

    inputElem.addEventListener(`change`, async () => {
        console.log();
        if (inputElem.value != lastVal && inputElem.value != "") { // Check if input is non equal to last val and nonempty
            const p = inputElem.value.match(/[\s]/)
            const q = inputElem.value.match(/[0-9]/g);
            if ((!p && !q) || (p && !q)) { // Check if input contains no space and no numbers, or spaces but not numbers

                const data = await weathApi(inputElem.value);
                if (inputElem.value == data.location.name) { // Check if input matches the location
                    lastVal = inputElem.value;
                    console.log(data);
                    displayWeathApiRes(data);
                } else {
                    //document.createElement(`div`);

                    displayError(`Uh oh, no result for \"${inputElem.value}\"`);

                    iconTempDesc.textContent = lastDesc;
                    inputElem.value = lastVal;
                }
            } else {
                displayError(`Hm, only letters are allowed`);
                inputElem.value = lastVal;
            }

        }
        else {
            displayError(`Nope, it can't be blank`);

            inputElem.value = lastVal;
        }
    });

    const mapOpt = document.createElement(`div`);

    inputElem.addEventListener(`focusin`, () => {
        mapOpt.setAttribute(`class`, `mapOpt`);
        mapOpt.textContent = "Use a map instead";

        descriptContainer.insertBefore(mapOpt, iconTempDesc);

    });
    inputElem.addEventListener(`focusout`, () => {
        setTimeout(() => {
            mapOpt.className += " fade-out";
            setTimeout(() => {
                mapOpt.remove();
            }, 1000);
        }, 1000);
    });

    let mapLastLat = 51.04;
    let mapLastLng = -0.64;
    mapOpt.addEventListener(`click`, () => {

        const mapDiv = document.createElement(`div`);
        mapDiv.id = "map";
        outerContainer.appendChild(mapDiv);

        const mymap = L.map('map', {
            zoomControl: false
        }).setView([mapLastLat, mapLastLng], 13);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1Ijoic2tyci10ZWNoIiwiYSI6ImNrbjVwbG55MTA1OWoydXF2a2FoZ2dnNzAifQ.6S7NXcvOygILiPJoo23ceQ'
        }).addTo(mymap);

        const markerA = L.marker([mapLastLat, mapLastLng], {
            draggable: true
        }).addTo(mymap);
        L.control.zoom({
            position: 'topright'
        }).addTo(mymap);

        let latLng;
        markerA.on('moveend', (e) => {
            // console.log(e.sourceTarget._latlng.lat);
            const lat = e.sourceTarget._latlng.lat.toString();
            const lng = e.sourceTarget._latlng.lng.toString();
            const lat2 = lat.slice(0, lat.indexOf(`.`) + 5);
            const lng2 = lng.slice(0, lng.indexOf(`.`) + 5);        
            latLng = `${lat2},${lng2}`;
            console.log(latLng);
            mapLastLat = Number(lat2);
            mapLastLng = Number(lng2);
            
        });
        mymap.on(`click`, (e) => {
            markerA.setLatLng(e.latlng);
            // console.log(e.sourceTarget._latlng.lat);
            // latLng = `${e.latlng.toString().slice(e.latlng.toString().indexOf(`(`), e.latlng.toString(`)`))}`;
            const a = e.latlng.toString();
            const b = a.indexOf(`(`) + 1;
            const c = a.indexOf(`)`);
            const d = a.slice(b, c);
            const f = d.replace(" ", "");
            const lat = f.slice(0, f.indexOf(`,`));
            const lng = f.slice(f.indexOf(`,`) + 1);
            const lat2 = lat.slice(0, lat.indexOf(`.`) + 5);
            const lng2 = lng.slice(0, lng.indexOf(`.`) + 5);
            // console.log(`${lat2} ${lng2}`);
            latLng = `${lat2},${lng2}`;
            mapLastLat = Number(lat2);
            mapLastLng = Number(lng2);
        });

        (function () {

            const userPlace = document.createElement(`div`);
            userPlace.className = "user-place";
            userPlace.textContent = "Set this place";

            outerContainer.appendChild(userPlace);

            const backElem = document.createElement(`div`);
            backElem.className = "back-btn";
            backElem.textContent = "<";
            outerContainer.appendChild(backElem);

            userPlace.addEventListener(`click`, async () => {
                console.log(latLng);                
                displayWeathApiRes(await weathApi(latLng));
                inputElem.value = latLng;

                mapDiv.remove();
                userPlace.remove();
                backElem.remove();
            })
            backElem.addEventListener(`click`, async () => {                
                mapDiv.remove();
                userPlace.remove();
                backElem.remove();
            })

        })();
    });

    const apiKey = `f80c5ae3ac3a4eb1bf965456210404`;

    (async function () {
        iconTempDesc.textContent = `Loading...`;

        const a = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${inputElem.value}`);
        const data = await a.json();

        icon.src = `https://${data.current.condition.icon.slice(2)}`;
        iconContainer.appendChild(icon);

        iconTempDesc.textContent = `${data.current.condition.text} \r\n ${data.current.temp_c}\u00B0C`;
        lastDesc = iconTempDesc.textContent;
    })();
})();
/*
2. store user's location on localStorage then put it in the input.value
3. automatically get the user's location via geolocation api

/*
0. change pointer icon to red
1. set the initial place or lat based on users position or last input using localStorage
2.get the time based on given point in map
*/
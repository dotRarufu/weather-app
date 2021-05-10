const L = require('leaflet');
const gu = require('./genUtility');

module.exports = function (elems) {
  const handler = {};
  for (let k = 0; k < elems.length; k += 1) {
    handler[`${k}`] = elems[k];
  }

  const mapElems = gu.createElems({
    div: { userPlace: 'user-place', backElem: 'back-elem' },
  });

  const map = gu.crElem('div');
  mapElems.userPlace.textContent = 'Set this location';
  mapElems.backElem.textContent = '‹';
  map.id = 'map';

  let mapLat = 'false'; // default, for condition
  let mapLng = 'false'; // default, for condition
  let mapDidNotSelect = true;
  let activeHandler;

  for (let l = 0; l < elems.length; l += 1) {
    if (handler[l].isActive) {
      activeHandler = l;
    }
  }

  if (activeHandler !== undefined) {
    gu.appendElems(
      {
        body$1: [map, mapElems.userPlace, mapElems.backElem],
      },
      [document]
    );

    const myMap = L.map('map', {
      zoomControl: false,
    }).setView(
      [
        handler[activeHandler].lastLatFromMap,
        handler[activeHandler].lastLngFromMap,
      ],
      13
    );

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
    ).addTo(myMap);

    const iconRetinaUrl = './img/marker-icon-2x.png';
    const iconUrl = './img/marker-icon.png';
    const shadowUrl = './img/marker-shadow.png';

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

    const markerA = L.marker(
      [
        handler[activeHandler].lastLatFromMap,
        handler[activeHandler].lastLngFromMap,
      ],
      {
        draggable: true,
      }
    ).addTo(myMap);

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(myMap);

    myMap.on('click', (e) => {
      markerA.setLatLng(e.latlng);
      mapLat = Number(e.latlng.lat);
      mapLng = Number(e.latlng.lng);
      mapDidNotSelect = false;
    });
    mapElems.userPlace.addEventListener('click', async () => {
      map.remove();
      mapElems.userPlace.remove();
      mapElems.backElem.remove();

      if (mapDidNotSelect) {
        handler[activeHandler].latFromMap =
          handler[activeHandler].lastLatFromMap;
        handler[activeHandler].lngFromMap =
          handler[activeHandler].lastLngFromMap;
      } else {
        handler[activeHandler].latFromMap = mapLat;
        handler[activeHandler].lngFromMap = mapLng;
        handler[activeHandler].lastLatFromMap =
          handler[activeHandler].latFromMap;
        handler[activeHandler].lastLngFromMap =
          handler[activeHandler].lngFromMap;
      }
      handler[
        activeHandler
      ].cardItemInput.value = `${handler[activeHandler].latFromMap},${handler[activeHandler].lngFromMap}`;
      await handler[activeHandler].inputDataValidation('map');
      handler[activeHandler].kebabClicked.remove();
      handler[activeHandler].updateCardTip();
    });
    mapElems.backElem.addEventListener('click', () => {
      map.remove();
      mapElems.userPlace.remove();
      mapElems.backElem.remove();
    });
  }
};

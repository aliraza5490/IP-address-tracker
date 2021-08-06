const submitButton = document.getElementById('submit');
submitButton.removeEventListener('click', handleClick);
submitButton.addEventListener('click', handleClick);

function handleClick(event) {
  event.preventDefault();
  let value = document.getElementById('query').value;
  var query = { query: value };
  if (value) {
    sendQuery(query)
  }
}

function setValuesInDOM(data) {
  let ipELem = document.getElementById('ip');
  let ispELem = document.getElementById('isp');
  let locationELem = document.getElementById('location');
  let timezoneELem = document.getElementById('timezone');
  ipELem.innerText = data.ip;
  ispELem.innerText = data.as.name;
  locationELem.innerText = `${data.location.city}, ${data.location.country} ${data.location.postalCode} `;
  timezoneELem.innerText = `UTC ${data.location.timezone}`
}

var mymap = L.map('map', {
  zoomControl: false,
  attributionControl: false
})

var titleLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(mymap);

// To store previous marker
var marker;

function showPositionOnMap(lat, lon) {
  var latLon = [lat, lon];
  if (marker) {
    marker.remove();
  }
  mymap.setView(latLon, 13);
  var myIcon = L.icon({
    iconUrl: '/image',
  });
  marker = L.marker(latLon, { icon: myIcon }).addTo(mymap)
}

function sendQuery(query) {
  $.post("/api", query, function (data, status) {
    if (status == 'success') {
      showPositionOnMap(data.location.lat, data.location.lng);
      setValuesInDOM(data)
    } else {
      console.log("Query status: " + status)
      alert('Error in fetching.')
    }
  });
}

fetch('https://api.ipify.org?format=json').then(res => {
  res.json().then(res => {
    let query = { query: res.ip }
    sendQuery(query)
  })
})
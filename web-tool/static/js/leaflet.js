var leafletMap = L.map('JSLeafletMap', {
    preferCanvas: true,
    maxZoom: 11
}).setView([49.783425, 15.643964], 8);

var mapboxLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoidm9qdGE5NyIsImEiOiJja2ttb2s0emwxbHozMm90ZG50enNjeDJwIn0.X6ONkQ0A4vVEHQ4uMNnqJA'
}).addTo(leafletMap);

var velTiles = L.tileLayer('../static/data/tiles/vel/{z}/{x}/{y}.png', {
    tms: true,
    opacity: 0.6,
}).addTo(leafletMap);

var clickedInfo;

d3.request("../static/data/geotiff-id-c.tif").responseType('arraybuffer').get( function (error, dataT) {
    let val = L.ScalarField.fromGeoTIFF(dataT.response);

    clickedInfo = L.canvasLayer.scalarField(val, {
        opacity: 0
    }).addTo(leafletMap);

    clickedInfo.on('click', function (e) {
        if (e.value !== null && isNaN(e.value) === false) {
            let id = e.value;
            let htmlPopUp = popUpChart(id);
            let popup = L.popup({
                    maxWidth: 'auto',
                    maxHeight: 'auto'
                })
                .setLatLng(e.latlng)
                .setContent(htmlPopUp)
                .openOn(leafletMap);
        }
    });
});

hideLoader();

// Vytvoření a vložení legendy
createLegend();

function createLegend() {
    let container = '<div class="legend-inside-container">';

    let btn = '<a href="#" id="JSLegendBtn" class="legend-responsive-btn">Legenda</a>';

    let div = '<ul class="legend list-group list-unstyled">',
        grades = [-21.01, -20.01, -10.01, -5.01, -1.01, 1, 5, 10, 20],
        labels = [
            '<li class="title"><strong>Legenda</strong></li>',
            '<li class="under-title">Rychlost pohybu (mm/rok)</li>'
        ],
        from, to;

    for (var i = 0; i < grades.length; i++)
    {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<li class="legend-row r-' + i + '">\
            <span class="badge badge-primary badge-pill" style="background:' + color(from + 1) + '"> </span>'
            + (i === 0 ? ('<&nbsp;&nbsp;&nbsp;' + (from + 1).toFixed(2)) : ((to === undefined ? '>&nbsp;&nbsp;&nbsp;' + (from + 0.01).toFixed(2) : (from + 0.01).toFixed(2)))) + (to !== undefined && i > 0  ? '&nbsp;&nbsp;&nbsp;&ndash;&nbsp;&nbsp;&nbsp;' + to.toFixed(2) : '') + '</li>');
    }

    div += labels.join('');
    div += '</ul>';
    container += btn;
    container += div;
    container += '</div>';

    $('#JSLegendWrapper').append(container);
}

leafletMap.on('popupopen', function(e) {

    showLoader();

    if (chart !== undefined && chart !== null)
    {
        chart.destroy();
    }

    let content = $(this._popup._content);

    let id = $(content).find('.JSChart').data('id');

    if (id === undefined)
    {
        let labels = $(content).find('.JSChart').data('labels').split(', ');
        let data = $(content).find('.JSChart').data('dataset').split(', ');

        setTimeout(function () {
            makeChart(labels, data);
        }, 200);
    }
    else
    {
        let strId = String(id);
        let jsonId = strId.substring(0, 6);

        setTimeout(function () {
            ajaxGetData(jsonId, strId);
        }, 200);
    }
});

/* FUNKCE */
function color(vel) {
    let color;

    if (vel > 20 || vel < -20)
    {
        color = "#7e1700";
    }
    else if (vel > 10 || vel < -10)
    {
        color = "#033198";
    }
    else if (vel > 5 || vel < -5)
    {
        color = "#b68c32";
    }
    else if (vel > 1 || vel < -1)
    {
        color = "#399dc7";
    }
    else
    {
        color = "#c1eac3";
    }

    return color;
}

function popUpChart(id)
{
    let customPopup = "<div class='popup'>";
    customPopup += "<h3>Kumulativní posun</h3>";
    customPopup += "<div class='chart-container JSChart' data-id='" + id + "'><canvas id='chart1'></canvas></div>";
    customPopup += "</div>";

    return  customPopup;
}
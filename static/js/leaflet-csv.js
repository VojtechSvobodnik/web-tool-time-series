var markersCSV;

function loadCsvFile(path)
{
    $.get(path, function(data) {
        data = csvToJson(data);
        showDataInMap(JSON.parse(data));
    });
}

function showDataInMap(data)
{
    leafletMap.removeLayer(velTiles);
    leafletMap.removeLayer(clickedInfo);

    if(leafletMap.hasLayer(markersCSV))
    {
        leafletMap.removeLayer(markersCSV);
    }

    leafletMap.options.maxZoom = 18;

    markersCSV = L.geoJson(data, {
        pointToLayer: function (feature) {
            return L.circleMarker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
                color: color(feature.properties['VEL']),
                fillOpacity: 1,
                radius: 4
            });
        },
        onEachFeature: popUpCSVChart,
    });

    markersCSV.addTo(leafletMap);

    leafletMap.fitBounds(markersCSV.getBounds());

    hideLoader();
}

function csvToJson(csv)
{
  let lines = csv.split('\n');
  let outerJson = {'type': 'FeatureCollection', 'features': []};
  let headers = lines[0].split(',');

  for (let i = 1; i < lines.length - 1; i++)
  {
	  let obj = {'type': 'Feature',
                       'geometry': {'type': 'Point',
                                    'coordinates': []},
                       'properties': {}};

	  let currentLine = lines[i].split(',');

	  for(let j = 0; j < headers.length; j++)
	  {
	      if (headers[j] == 'LAT' || headers[j] == 'LON')
          {
              obj.geometry.coordinates.push(currentLine[j]);
          }
	      else
          {
              obj.properties[headers[j]] = currentLine[j];
          }
	  }

	  outerJson.features.push(obj);
  }

  return JSON.stringify(outerJson);
}

function popUpCSVChart(feature, layer)
{
    let labels = '';
    let data = '';
    let coherence = null;
    let velocity = null;
    let singleFeature = feature.properties;
    let regex = /^\d{1,4}-\d{1,2}-\d{1,2}$/;

    $.each(singleFeature, function (key, item) {
        if (key.match(regex))
        {
            labels += key + ", ";
            data += item + ", ";
        }
        else if (key == 'COHER' || key == 'COHERENCE')
        {
            coherence = item;
        }
        else if (key == 'VEL' || key == 'VELOCITY')
        {
            velocity = item;
        }
    });

    labels = labels.slice(0, -2);
    data = data.slice(0, -2);

    var customPopup = "<div class='popup'>";
    customPopup += "<h3>" + dataCSVTitle + "</h3>";
    customPopup += "<div class='chart-container JSChart' data-labels='" + labels + "' data-dataset='" + data + "'>" +
        "<canvas id='chart1'></canvas>" +
        "</div>";

    if (velocity !== null || coherence !== null)
    {
        customPopup += "<div class='text-container'>";

        if (velocity !== null)
        {
            customPopup += "<p><strong>Rychlost pohybu (mm/rok):</strong> " + velocity + "</p>";
        }

        if (coherence !== null)
        {
            customPopup += "<p><strong>Koherence:</strong> " + coherence + "</p>";
        }

        customPopup += "</div>";
    }

    customPopup += "</div>";

    layer.bindPopup(customPopup, {
        maxWidth: 'auto',
        maxHeight: 'auto'
    });
}
import geojson
import xarray as xr
import os
import glob

# CONFIG

# SET DATA DIR
dataDir = 'C:/Users/svobo/AppData/Local/Programs/Python/dp/diplomovaprace/data/all-nc'

# SET COLS
cols = ['vel']


def datasetToGeojson(dataDir, properties, lat='latitude', lon='longitude'):
    geoJsonVar = {'type': 'FeatureCollection', 'features': []}

    for filepath in glob.glob(os.path.join(dataDir, '*.nc')):
        print('FILE: {}'.format(filepath))
        dataset = xr.open_dataset(filepath)
        dataset = dataset[['vel']].to_dataframe().dropna().reset_index()

        for _, row in dataset.iterrows():
            lonIdCoords = "{:.4f}".format(row[lon])
            latIdCoords = "{:.4f}".format(row[lat])

            lonId = lonIdCoords.replace('.', '')
            latId = latIdCoords.replace('.', '')

            idVar = str(lonId) + str(latId)

            feature = {'type': 'Feature',
                       'geometry': {'type': 'Point',
                                    'coordinates': []},
                       'properties': {}}

            feature['geometry']['coordinates'] = [float(lonIdCoords), float(latIdCoords)]
            feature['properties']['ID'] = idVar

            for prop in properties:
                feature['properties'][str(prop)] = "{:.1f}".format(row[prop])

            geoJsonVar['features'].append(feature)

    return geoJsonVar


geoJson = datasetToGeojson(dataDir, cols, 'lat', 'lon')

with open('../static/data/data-without-time.json', 'w') as file:
    geojson.dump(geoJson, file, separators=(',', ':'))

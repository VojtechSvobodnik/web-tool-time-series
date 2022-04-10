import os

import ujson
import pandas as pd
import xarray as xr
import rioxarray as rio

# CREATE netCDF
file = open('../static/data/data-without-time.json', 'r')
data = ujson.load(file)

velData = {
    'lon': [],
    'lat': [],
    'vel': [],
}

for feature in data['features']:
    velData['lat'].append(feature['geometry']['coordinates'][1])
    velData['lon'].append(feature['geometry']['coordinates'][0])
    velData['vel'].append(float(feature['properties']['vel']))

df = pd.DataFrame(velData).set_index(['lat', 'lon'])

df = xr.Dataset.from_dataframe(df[~df.index.duplicated()])

df.to_netcdf('../data/from-json/nc/vel.nc', 'w')

# Create TIFF
dataDir = '../data/from-json/nc/vel.nc'

gdal_translate = 'gdal_translate -r bilinear -a_srs EPSG:4326 -mo AREA_OR_POINT=POINT -of GTiff ' \
                 '-co "TILED=YES" ' + dataDir + ' ../data/from-json/tiff/geotiff-vel.tif'

print(gdal_translate)

os.system(gdal_translate)

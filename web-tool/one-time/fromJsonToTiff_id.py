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
    'ID': [],
}

for feature in data['features']:
    velData['lat'].append(feature['geometry']['coordinates'][1])
    velData['lon'].append(feature['geometry']['coordinates'][0])
    velData['ID'].append(int(feature['properties']['ID']))

df = pd.DataFrame(velData).set_index(['lat', 'lon'])

df = xr.Dataset.from_dataframe(df[~df.index.duplicated()])

df.to_netcdf('../data/from-json/nc/id.nc', 'w')

# Create TIFF
dataDir = '../data/from-json/nc/id.nc'

gdal_translate = 'gdal_translate -r bilinear -a_srs EPSG:4326 -mo AREA_OR_POINT=POINT -of GTiff -co "TILED=YES" ' \
                 + dataDir + ' ../static/data/geotiff-id.tif'

print(gdal_translate)

os.system(gdal_translate)

gdal_compression = 'gdal_translate -r bilinear -a_srs EPSG:4326 -mo AREA_OR_POINT=POINT -of GTiff ' \
                   '-co "COMPRESS=LZW" -co "TILED=YES" ../static/data/geotiff-id.tif ' \
                   '../static/data/geotiff-id-c.tif'

print(gdal_compression)

os.system(gdal_compression)

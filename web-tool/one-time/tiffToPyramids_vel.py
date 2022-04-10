import sys, os

os.chdir('../data/from-json/tiff/')

name = 'geotiff-vel'
file = name + '.tif'
tiles = '../../../static/data/tiles/vel/'
gdal2tiles_rep = 'C:/Users/svobo/anaconda3/envs/dp2/Scripts/gdal2tiles.py'

gdaldem = 'gdaldem color-relief -alpha ' + file + ' ../../../one-time/helpers/palette_vel.txt -of GTiff ' + name + \
          '-colorized.tif '

os.system(gdaldem)

gdal2tiles = 'python ' + gdal2tiles_rep + ' -r bilinear -z 0-11 -w leaflet ' + name + '-colorized-point.tif ' + \
             tiles

os.system(gdal2tiles)


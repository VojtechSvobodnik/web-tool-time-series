# web-tool-time-series
Web-based tool for dissemination of satellite radar interferometry outputs which allows to display time series data for a given point.

# How to run
1. Install packages: django, os, sys, ujson, geojson, glob, time, pandas, xarray, rioxarray, gdal. You can use Anaconda.
2. Run server: py manage.py runserver or python manage.py runserver.
3. If some static files missing, use command py manage.py collectstatic or python manage.py collectstatic.

It is possible to import NetCDF data (go to web-tool/one-time) or use CSV file with upload in running app.

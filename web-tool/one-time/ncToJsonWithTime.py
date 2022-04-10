import ujson
import xarray as xr
import os
import glob
import time

# CONFIG

# SET DATA DIR
dataDir = 'C:/Users/svobo/AppData/Local/Programs/Python/dp/diplomovaprace/data/all-nc'

# SET DATA DIR OUTPUTS
dataDirOutput = 'C:/Users/svobo/AppData/Local/Programs/Python/dp/diplomovaprace/static/data/with-time'


def datasetToGeojson(dataDir, lat='latitude', lon='longitude'):
    for filepath in glob.glob(os.path.join(dataDir, '*.nc')):
        start_time = time.time()
        print('FILE: {}'.format(filepath))

        dataset = xr.open_dataset(filepath)
        dataset = dataset[['time', 'vel', 'coh', 'cum']].to_dataframe().dropna().reset_index()

        dataset['layer_id'] = dataset[lon].map('{:.4f}'.format).str.replace('.', '') + dataset[lat].map(
            '{:.4f}'.format).str.replace('.', '')
        dataset['json_id'] = dataset[lon].map('{:.4f}'.format).str.replace('.', '')
        dataset['vel'] = dataset['vel'].map('{:.1f}'.format)
        dataset['coh'] = dataset['coh'].map('{:.2f}'.format)
        dataset['cum'] = dataset['cum'].map('{:.1f}'.format)
        dataset['time_cum'] = 'cumT' + dataset['time'].dt.strftime('%Y-%m-%d')

        dataset = dataset.drop(columns=['lat', 'lon', 'time'])

        dataset = dataset.pivot(index=['layer_id', 'json_id', 'vel', 'coh'], columns='time_cum', values=['cum'])
        dataset.columns = dataset.columns.map(lambda x: f'{x[1]}')

        print('COUNT ROWS: {}'.format(len(dataset.index)))

        for index, row in dataset.iterrows():

            fileName = dataDirOutput + '/data-time-' + index[1] + '.json'

            if not os.path.isfile(fileName):
                geoJsonVar = {'data': []}

                with open(fileName, 'w') as file:
                    ujson.dump(geoJsonVar, file)

            with open(fileName, 'r') as file:
                jsonData = ujson.load(file)

            if not jsonData['data']:
                feature = {index[0]: {}}

                feature[index[0]]['vel'] = index[2]
                feature[index[0]]['coh'] = index[3]

                for prop in dataset.columns:
                    feature[index[0]][str(prop)] = row[prop]

                jsonData['data'].append(feature)

            else:
                newLayer = True

                if str(index[0]) in jsonData['data'][0]:
                    for prop in dataset.columns:
                        jsonData['data'][0][index[0]][str(prop)] = row[prop]

                    newLayer = False

                if newLayer:
                    feature = {index[0]: {}}

                    feature[index[0]]['vel'] = index[2]
                    feature[index[0]]['coh'] = index[3]

                    for prop in dataset.columns:
                        feature[index[0]][str(prop)] = row[prop]

                    jsonData['data'].append(feature)

            with open(fileName, 'w') as file:
                ujson.dump(jsonData, file)

        print("--- %s seconds ---" % (time.time() - start_time))


datasetToGeojson(dataDir, 'lat', 'lon')

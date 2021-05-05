import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error
from tensorflow.keras.preprocessing.sequence import TimeseriesGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv1D, MaxPooling1D, LSTM
#from keras.layers import RepeatVector
#from keras.layers import TimeDistributed
#from keras.optimizers import Adadelta
from tensorflow.keras.models import model_from_json
from datetime import date, timedelta
from sklearn.preprocessing import MinMaxScaler
#from sklearn.preprocessing import LabelEncoder
import nsepy as nse
from get_data import get_stock_data, calculate_indicators
import talib
import tensorflow as tf
import pickle
#import keras.backend.tensorflow_backend as tfback

'''def _get_available_gpus():
    """Get a list of available gpu devices (formatted as strings).

    # Returns
        A list of available GPU devices.
    """
    #global _LOCAL_DEVICES
    if tfback._LOCAL_DEVICES is None:
        devices = tf.config.list_logical_devices()
        tfback._LOCAL_DEVICES = [x.name for x in devices]
    return [x for x in tfback._LOCAL_DEVICES if 'device:gpu' in x.lower()]
'''

print("tf.__version__ is", tf.__version__)
print("tf.keras.__version__ is:", tf.keras.__version__)

#tfback._get_available_gpus = _get_available_gpus

model_dir = '../Models'

print()

def predict(ticker, pred_period = 1):
    pred_values = []
    json_file = open(model_dir + '/' + ticker + '/model.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    model = model_from_json(loaded_model_json)
    # load weights into new model
    model.load_weights(model_dir + '/' + ticker + "/model.h5")
    #print("Loaded model from disk")
    #model.summary()

    today = date.today()
    days = timedelta(80)
    period = today - days

    data = get_stock_data(ticker,start_date = period, end_date = today).reset_index(drop = True)
    clean_data = data.dropna()
    clean_data = clean_data.iloc[:-10]
    scaler = pickle.load(open(model_dir + '/' + ticker +"/scaler.pkl", "rb"))


    #print(data)
    for i in range(pred_period):    

        req_data = clean_data.values
        if i == 0:
            pred_values.append({"Open": req_data[-1,0], "High": req_data[-1,1], "Low": req_data[-1,2], "Close": req_data[-1,3], "Day": i})
        scaled = scaler.transform(req_data)

        print()
        to_pred = scaled[-5:]
        to_pred = to_pred.reshape((1, 5, scaled.shape[1]))
        
        ######PREDICTION#######

        #print('before pred')
        pred  = model.predict(to_pred)
        #print('after_pred')
        #print(pred)
        pred1 = np.zeros((to_pred.shape[0],18))
        pred1[:,:4] = pred[0]
        pred1 = np.around(scaler.inverse_transform(pred1), decimals = 2)

        pred_values.append({"Open": pred1[0,0], "High": pred1[0,1], "Low": pred1[0,2], "Close": pred1[0,3], "Day": i+1})

        if pred_period >1:
            data.loc[len(data)] = pred1[0]
            clean_data = calculate_indicators(data).dropna()
            #print(data)
        #print(data.loc[data.index.max()])
        #new = new + timedelta(1)
        #print("The predicted value for the next trading day for " + ticker + " is : " + str(pred1[0,3]))

    return pred_values

if __name__ == '__main__':

    ticker = input("Enter the Symbol: ")
    values = predict(ticker, pred_period= 2)
    print(values)
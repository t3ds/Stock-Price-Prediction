import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
#from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error
from tensorflow.keras.preprocessing.sequence import TimeseriesGenerator
from tensorflow.keras import Sequential
from tensorflow.keras import Model
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv1D, MaxPooling1D, LSTM
#from keras.layers import RepeatVector
from tensorflow.keras.layers import TimeDistributed
from tensorflow.keras.optimizers import Adadelta
from tensorflow.keras.models import model_from_json
from datetime import date, timedelta
from matplotlib import pyplot as plt
import math
from get_data import get_stock_data
from pathlib import Path
import tensorflow as tf
import pickle
import json
#import keras.backend.tensorflow_backend as tfback


model_dir = '../Models'


from numpy.random import seed
seed(1)
from tensorflow.compat.v1 import set_random_seed
set_random_seed(2)
#tf.debugging.set_log_device_placement(True)
#tf.compat.v1.Session(config=tf.compat.v1.ConfigProto(log_device_placement=True))
print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))
print("tf.__version__ is", tf.__version__)
print("tf.keras.__version__ is:", tf.keras.__version__)


def create_dir(path):
    Path(path).mkdir(exist_ok=True)

def reshape_actual(actual_data):


    shaped_data = [actual_data[i][1] for i in range(len(actual_data))]
    shaped_data = np.concatenate(shaped_data, axis=0)
    shaped_data = shaped_data.reshape((shaped_data.shape[0], 4))
    return shaped_data


def plot_them_graphs(actual, predicted, type, ticker, scaler):
    pred = np.zeros((actual.shape[0], 18))
    pred[:, 0:4] = actual[:, 0:4]
    pred = np.around(scaler.inverse_transform(pred), decimals=2)

    pred1 = np.zeros((actual.shape[0], 18))
    pred1[:, 0:4] = predicted[:, 0:4]
    pred1 = np.around(scaler.inverse_transform(pred1), decimals=2)

    pred_open, pred_close, pred_high, pred_low = [], [], [], []

    for  i in range(actual.shape[0]):
        

        pred_open.append({"Day": i+1, "Actual": pred[i,0], "Predicted": pred1[i,0]})
        pred_high.append({"Day": i+1, "Actual": pred[i,1], "Predicted": pred1[i,1]})
        pred_low.append({"Day": i+1, "Actual": pred[i,2], "Predicted": pred1[i,2]})
        pred_close.append({"Day": i+1, "Actual": pred[i,3], "Predicted": pred1[i,3]})

    return {"Open":pred_open, "High": pred_high, "Low": pred_low, "Close": pred_close}
    '''fig, axs = plt.subplots(4)
    titles = ["Open", "Close", "High", "Low"]
    for i in range(4):
        axs[i].plot(pred[:, i], label='actual')
        axs[i].plot(pred1[:, i], label='predicted')
        axs[i].legend(loc = "best")
        axs[i].set_title(titles[i])
    #fig1 = plt.gcf()
    plt.subplot_tool()
    plt.show()
    plt.savefig(ticker + '_' + type + "1.png", transparent=False)
    '''


def train(ticker):

    #Initializing the Paths
    create_dir(model_dir + '/' + ticker)

    output = {}
    present_date = date.today()
    prev_date = date.today() - timedelta(days = 5457)
    dataset = get_stock_data(ticker,start_date = prev_date, end_date = present_date, drop_na= True).reset_index(drop = True)
    
    dataset.to_csv(model_dir + '/' + ticker + '/' + str(ticker) + '.csv', index=False)

    


    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled = scaler.fit_transform(dataset.values)

    pickle.dump(scaler, open(model_dir + '/' + ticker + '/scaler.pkl', 'wb'))

    ##### TRAIN TEST SPLITTING #####
    '''
    train_gen = TimeseriesGenerator(scaled, scaled[:,0:4], start_index = 0, end_index = int(len(scaled) * 0.90), length = 1, batch_size = 256)
    test_gen = TimeseriesGenerator(scaled, scaled[:,0:4], start_index = int(len(scaled) * 0.90), end_index = int(len(scaled) - 1), length = 1, batch_size = 256)
    '''
    train_gen = TimeseriesGenerator(scaled, scaled[:,:4], start_index = 0, end_index = int(len(scaled) * 0.85), length = 5, batch_size = 16)
    test_gen = TimeseriesGenerator(scaled, scaled[:,:4], start_index = int(len(scaled) * 0.85), end_index = int(len(scaled) - 1), length = 5, batch_size = 16)
    ##### MODEL CREATION ######

    '''
    model = Sequential()
    model.add(Conv1D(18, kernel_size=3, activation='relu', padding = 'valid', strides=1, input_shape=(1,18), data_format='channels_first'))
    model.add(Conv1D(18, kernel_size=3, activation='relu', padding = 'valid', strides=1))
    #model.add(MaxPooling1D(pool_size=2))
    model.add(LSTM(100, activation = 'tanh', recurrent_activation = 'sigmoid', unroll = False, use_bias = True, recurrent_dropout = 0, return_sequences=True))
    model.add(Dropout(0.4))
    model.add(LSTM(100, activation = 'tanh', recurrent_activation = 'sigmoid', unroll = False, use_bias = True, recurrent_dropout = 0,return_sequences=True))
    model.add(Dropout(0.4))
    model.add(LSTM(100, activation = 'tanh', recurrent_activation = 'sigmoid', unroll = False, use_bias = True, recurrent_dropout = 0,return_sequences= True))
    model.add(Dropout(0.2))
    model.add(Flatten())
    model.add(Dense(4, activation = 'linear'))
    adadelta = Adadelta(learning_rate=1.0, rho=0.95)
    model.compile(loss= 'mae', optimizer = adadelta, metrics=[tf.keras.metrics.MeanAbsolutePercentageError()])
    #model.summary()
    '''
    from tensorflow.keras.regularizers import l1
    model = Sequential()
    model.add(Conv1D(18, kernel_size=3, activation='relu', padding = 'valid', strides=1, input_shape=(5,18), data_format='channels_first'))
    model.add(Conv1D(18, kernel_size=4, activation='relu', padding = 'valid', strides=1))
    #model.add(MaxPooling1D(pool_size=2))
    model.add(LSTM(100, activation = 'tanh', recurrent_activation = 'sigmoid', unroll = False, use_bias = True, recurrent_dropout = 0, return_sequences=True, kernel_regularizer=l1(0.001)))
    model.add(Dropout(0.4))
    model.add(LSTM(50, activation = 'tanh', recurrent_activation = 'sigmoid', unroll = False, use_bias = True, recurrent_dropout = 0,return_sequences=True, activity_regularizer=l1(0.001)))
    model.add(Dropout(0.4))
    model.add(LSTM(25, activation = 'tanh', recurrent_activation = 'sigmoid', unroll = False, use_bias = True, recurrent_dropout = 0,return_sequences= True, activity_regularizer=l1(0.001)))
    model.add(Dropout(0.2))
    model.add(Flatten())
    model.add(Dense(4, activation = 'linear'))
    adadelta = Adadelta(learning_rate= 1.0, rho=0.95)

    model.compile(loss= 'mse', optimizer = adadelta, metrics=[tf.keras.metrics.RootMeanSquaredError()])
    model.summary()
    ##### TRAINING #####
    my_callbacks = [
    #tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', patience=4, factor=0.2, min_lr=0.001),
    tf.keras.callbacks.ModelCheckpoint(filepath=model_dir + "/" + ticker + "/model" + ".h5", save_weights_only=True, save_best_only= True, monitor = "val_root_mean_squared_error", mode="min"),
    ]
    history = model.fit_generator(train_gen, epochs = 300, verbose = 0, shuffle = True, validation_data = test_gen, callbacks=my_callbacks)


    ##### PLOTTING LOSS ######
    '''plt.plot(history.history['loss'], label='train')
    plt.plot(history.history['val_loss'], label='test')
    plt.legend()
    plt.show()
    score = model.evaluate_generator(test_gen, verbose = 1)
    print()
    print('Test loss:', score[0])
    print('Test accuracy:', score[1])
    print()'''

    ###### RESHAPE ACTUAL DATA #######
    actual_train = reshape_actual(train_gen)
    predictions_train = model.predict_generator(train_gen, verbose = 0)
    print(predictions_train)

    ##### RSME FOR TRAIN #####
    rmse_train = math.sqrt(mean_squared_error(actual_train[:], predictions_train[:]))
    print(rmse_train)


    ###### TEST DATA ######
    actual_test = reshape_actual(test_gen)
    predictions_test = model.predict_generator(test_gen, verbose = 0)
    rmse_test = math.sqrt(mean_squared_error(actual_test[:], predictions_test[:]))
    print(rmse_test)

    output["Accuracy"] = {"Train": round(rmse_train*100,2), "Test": round(rmse_test*100,2)}

    ###### PLOT TEST ######
    output["Train"] = plot_them_graphs(actual_train, predictions_train, "train", ticker, scaler)
    output["Test"] = plot_them_graphs(actual_test, predictions_test, "test", ticker, scaler)


    ##### SAVE IT!!!!!! #####

    model_json = model.to_json()
    with open(model_dir + "/" + ticker + "/model" + ".json", "w") as json_file:
        json_file.write(model_json)
    #model.save_weights(model_dir + "/" + ticker + "/model" + ".h5")
    print("Saved model to disk")

    data = {
        "name": ticker,
        "date": present_date.strftime("%d-%b-%Y")
    }

    with open(model_dir + "/" + ticker + '/data.json', 'w') as outfile:
        json.dump(data, outfile)

    return output

if __name__ == "__main__":

    ticker = input("Please enter symbol: ")
    data = train(ticker)
    print(data)



    





from flask import Flask, jsonify, request
from fetch_data import fetch_data, fetch_gainers, fetch_losers
from predict import predict
from nsepy import get_history
from datetime import date,timedelta
from ConvLSTM import train
import pandas as pd
import os
import json
import requests

app = Flask(__name__)

@app.route('/api/<string:ticker>', methods = ['GET'])
def api(ticker):
    return fetch_data(ticker)

@app.route('/history/<string:ticker>', methods = ['GET'])
def history(ticker):
    today = date.today()
    days = timedelta(30)
    period = today - days
    data = get_history(symbol = ticker, start = period, end = today)
    dates = []
    for day in data.index.values:
         dates.append(day.strftime("%d-%b-%Y"))

    formatted_data = pd.DataFrame(zip(dates, data["Close"]), columns = ["Date", "Price"])
    return formatted_data.to_json(orient="records")

@app.route('/gainers', methods = ['GET'])
def gainers():
    return fetch_gainers()

@app.route('/losers', methods = ['GET'])
def losers():
    return fetch_losers()

@app.route('/models', methods = ['GET'])
def models():
    jsons = []
    for sub_dir in os.listdir('../Models'):

        with open('../Models/' + sub_dir + '/data.json') as json_file:
            jsons.append(json.load(json_file))

    return jsonify(jsons)

@app.route('/predict', methods = ['GET'])
def prediction():
    ticker = request.args.get('ticker', None)
    days = request.args.get('days', None)
    #print(ticker, type(ticker))
    #print(days, type(days))
    return jsonify(predict(ticker,int(days)))
    
@app.route('/train/<string:ticker>', methods = ['GET'])
def training(ticker):
    return jsonify(train(ticker))
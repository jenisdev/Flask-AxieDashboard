# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""
""" 
from flask   import json, url_for, jsonify, render_template
from jinja2  import TemplateNotFound
from app     import app

from . models import User
from app    import app,db,bc,mail
from . common import *
from sqlalchemy import desc,or_
import hashlib
from flask_mail  import Message
import re
from flask       import render_template """


""" 
import      os, datetime, time, random

# build a Json response
def response( data ):
    return app.response_class( response=json.dumps(data),
                               status=200,
                               mimetype='application/json' )

def g_db_commit( ):

    db.session.commit( );    

def g_db_add( obj ):

    if obj:
        db.session.add ( obj )

def g_db_del( obj ):

    if obj:
        db.session.delete ( obj )
"""


from app.models import Scholarship
from urllib.request import urlopen
import json, datetime, time

from app import db

import requests
from requests.api import put

def getRateForToken(currency="usd", id="smooth-love-potion"):
    url = f"https://api.coingecko.com/api/v3/coins/{id}"
    with urlopen(url) as url:
        market_data = json.loads(url.read().decode())
        percentage = market_data['market_data']['price_change_percentage_24h']
        price = market_data['market_data']['current_price'][currency]

        return {"price": price, "percent": percentage}
#Uses coingecko to get the current value in json and parse it.
#Default currency is PHP which is what the scholars use, but you can change it to whatever you need.
def getRateForSLP(currency="usd"):
    currency=currency.lower() #avoinds keyerror if given in caps

    slp_token = "0xcc8fa225d80b9c7d42f96e9570156c65d6caaa25" #Token for the crypto we're using. Don't change this.

    url = f"https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses={slp_token}&vs_currencies={currency}"

    with urlopen(url) as url:
        statsData = json.loads(url.read().decode())
        value = statsData[slp_token][currency]

    return(value)

# Get All currencies.
def getAllCurrencies():
    coin_url = f"https://api.coingecko.com/api/v3/coins/list?include_platform=false"
    coins = []
    """ 
    with urlopen(coin_url) as res:
        data = json.loads(res.read().decode())
        for item in data:
            coins.append(item['symbol']) """

    currency_url = f"https://api.coingecko.com/api/v3/simple/supported_vs_currencies"
    currencies = []
    with urlopen(currency_url) as res:
        currencies = json.loads(res.read().decode())
    
    res = currencies + coins
    res.sort()

    
    for i in range(len(res)):
        res[i] = res[i].upper()
    return res

# Get market cap change percentage
def getChangePercent():
    url = f"https://api.coingecko.com/api/v3/coins/smooth-love-potion?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
    
    with urlopen(url) as res:
        market_data = json.loads(res.read().decode())
        percentage = market_data['market_data']['market_cap_change_percentage_24h']
    return percentage

# Utilities to get Averages.

#calculates the average of the list
def Average(lst):
    if len(lst) == 0:
        return 0
    return sum(lst) / len(lst)


#converts tuple lists to normal lists
def Convert(tup, lst):
    for line in tup:
        newLine = [line[0],line[1]]
        lst.append(newLine)
    return lst


def Todays_Average_Gain():
    scholars = db.engine.execute("SELECT TodaysGains FROM scholarship_tracker")
    todayGains = []
    for item in scholars:
        todayGains.append(item[0])

    average = sum(todayGains) / len(todayGains)
    return(average)


def Yesterday_Average_Gain():
    scholars = db.engine.execute("SELECT RoninAddress FROM scholarship_tracker")
    yesterdayGains = []
    for scholar in scholars:
        wallet = scholar[0]
        gain = db.engine.execute("SELECT Gained FROM scholar_daily_totals WHERE RoninAddress = %s ORDER BY Date DESC LIMIT 1", (str(wallet),)).fetchone()
        yesterdayGains.append(gain[0])
    
    average = sum(yesterdayGains) / len(yesterdayGains)
    return(average)

#gets the averages based on the two provided dates. Provide dates in the format "dd/mm/yyyy"
def Average_Gained_On_Date(dateTwo):

    #establish a first date which will be the beginning of the previous day
    dateOne = datetime.datetime.strptime(dateTwo, "%d/%m/%Y")
    dateOne = dateOne - datetime.timedelta(days=1)
    dateOne = dateOne.strftime("%d/%m/%Y")

    #establish a third date which will be the end of the second date
    dateThree = datetime.datetime.strptime(dateTwo, "%d/%m/%Y")
    dateThree = dateThree + datetime.timedelta(days=1)
    dateThree = dateThree.strftime("%d/%m/%Y")

    #convert to timestamps
    dateOne = int(time.mktime(datetime.datetime.strptime(dateOne, "%d/%m/%Y").timetuple()))
    dateTwo = int(time.mktime(datetime.datetime.strptime(dateTwo, "%d/%m/%Y").timetuple()))
    dateThree = int(time.mktime(datetime.datetime.strptime(dateThree, "%d/%m/%Y").timetuple()))

    #get list of todays values
    statement = "SELECT RoninAddress, SLP FROM scholar_daily_totals WHERE Date BETWEEN %s and %s"
    values = (dateTwo,dateThree)
    todaysValuesRaw = db.engine.execute(statement, values)
    # todaysValuesRaw = cursor.fetchall()
    
    #get list of yesterdays values
    statement = "SELECT RoninAddress, SLP FROM scholar_daily_totals WHERE Date BETWEEN %s and %s"
    values = (dateOne,dateTwo)
    yesterdaysValuesRaw = db.engine.execute(statement, values)
    # yesterdaysValuesRaw = cursor.fetchall()

    #convert tuple lists to normal lists
    todaysValues = []
    yesterdaysValues = []
    Convert(todaysValuesRaw, todaysValues)
    Convert(yesterdaysValuesRaw, yesterdaysValues)

    #assemble everyones data together in 1 line per person
    for line in todaysValues:
        for item in yesterdaysValues:
            if line[0] == item[0]:
                line.append(item[1])
    allValues = todaysValues

    #calculate all differences and assemble into a list
    differences = []
    for line in allValues:
        try:
            item = line[1]-line[2]
            if item >= 0:
                differences.append(item)
            else:
                differences.append(0)
        except:
            differences.append(0)



    return(round(Average(differences),2))

# Manage Scholar

def add_scholar(auth, sholar_data):
    param = '0xdb3091a67f647cf209514ace00e13d2d4638cc17'
    url = auth['url']
    usr = auth['user']
    passwd = auth['pswd']
    
    response = requests.post(
        #link we go to
        url+param,

        #authenticate who we are
        auth=requests.auth.HTTPBasicAuth(usr, passwd),

        #data we want to write to the scholar
        data=sholar_data
    )
    return(response.json())
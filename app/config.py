# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os
from   decouple import config

# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():

    CSRF_ENABLED = True
	
    # Set up the App SECRET_KEY
    SECRET_KEY = config('SECRET_KEY', default='S#perS3crEt_007')
    SECURITY_PASSWORD_SALT = config('SECURITY_PASSWORD_SALT', default='S#perS3crEt_008')
    MAIL_DEFAULT_SENDER = 'baidawardipendar@gmail.com'

    # This will create a file in <app> FOLDER
    SQLALCHEMY_DATABASE_URI = 'mysql://dbmasteruser:)+wH{,O3xEU$DHW0fU)AuTwJNipA+0^T@ls-16a5009e4d9680ee447daa82c8ece035b4bedff2.cvasw40kycww.eu-west-2.rds.amazonaws.com/dbmaster' #'sqlite:///db.sqlite3'
    # SQLALCHEMY_DATABASE_URI = 'mysql://root@localhost/axie' #'sqlite:///db.sqlite3'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""
import os
import sys
basedir = os.path.abspath(os.path.dirname(__file__))
print(basedir)
sys.path.insert(0, '/var/www/axie-dashboard')
from app import app, db

# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from xml.dom.domreg import registered
from app         import db
from flask_login import UserMixin
import datetime

class User(UserMixin, db.Model):
    id       = db.Column(db.Integer,     primary_key=True)
    user     = db.Column(db.String(64),  unique = True)
    email    = db.Column(db.String(120), unique = True)
    password = db.Column(db.String(500))
    admin  = db.Column(db.Boolean, nullable=False, default=False)
    registered_on = db.Column(db.DateTime, nullable=False)
    confirmed = db.Column(db.Boolean, nullable=False, default=False)
    confirmed_on = db.Column(db.DateTime, nullable=True)    

    def __init__(self, user, email, password, confirmed, admin=False, confirmed_on=None):
        self.user           = user
        self.password       = password
        self.email          = email
        self.admin          = admin
        self.confirmed      = confirmed
        self.confirmed_on   = confirmed_on
        self.registered_on  = datetime.now()

    def __repr__(self):
        return str(self.id) + ' - ' + str(self.user)

    def save(self):

        # inject self into db session    
        db.session.add ( self )

        # commit change and save the object
        db.session.commit( )

        return self 

class Scholarship(db.Model):
    __tablename__ = 'scholarship_tracker'
    id                      = db.Column(db.Integer, primary_key=True)
    ScholarshipID           = db.Column(db.Integer)
    Name                    = db.Column(db.String(50),  unique = True)
    RoninAddress            = db.Column(db.String(255),  unique = True)
    DiscordID               = db.Column(db.String(18),  unique = True)
    TotalSLP                = db.Column(db.Integer)
    ClaimedSLP              = db.Column(db.Integer)
    UnclaimedSLP            = db.Column(db.Integer)
    UnclaimedDailyAverage   = db.Column(db.Integer)
    GuildRank               = db.Column(db.String(255))
    ScholarShare            = db.Column(db.Integer)
    ManagerShare            = db.Column(db.Integer)
    LastClaim               = db.Column(db.Integer)
    NextClaim               = db.Column(db.Integer)
    MMR                     = db.Column(db.Integer)
    ArenaRank               = db.Column(db.Integer)
    Matches                 = db.Column(db.Integer)
    WinRate                 = db.Column(db.String(255))
    Wins                    = db.Column(db.Integer)
    Draws                   = db.Column(db.Integer)
    Losses                  = db.Column(db.Integer)
    ScholarDataBasecol      = db.Column(db.String(45))

    def __init__(self):
        pass

""" class TimeRecords(db.Model):
    __tablename__ = 'timeRecords'
    DateTime                = db.Column(db.Text())
    Name                    = db.Column(db.Text(),  unique = True)
    Ronin                   = db.Column(db.Text(),  unique = True, primary_key=True)
    Total                   = db.Column(db.Integer())

    def __init__(self):
        pass 
"""
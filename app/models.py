# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from app         import db
from flask_login import UserMixin

class User(UserMixin, db.Model):

    id       = db.Column(db.Integer,     primary_key=True)
    user     = db.Column(db.String(64),  unique = True)
    email    = db.Column(db.String(120), unique = True)
    password = db.Column(db.String(500))

    def __init__(self, user, email, password):
        self.user       = user
        self.password   = password
        self.email      = email

    def __repr__(self):
        return str(self.id) + ' - ' + str(self.user)

    def save(self):

        # inject self into db session    
        db.session.add ( self )

        # commit change and save the object
        db.session.commit( )

        return self 

class MainTable(db.Model):
    __tablename__ = 'mainTable'
    Name                    = db.Column(db.Text(),  unique = True)
    RoninAddress            = db.Column(db.Text(),  unique = True)
    DiscordID               = db.Column(db.Integer(),  unique = True, primary_key=True)
    TotalSLP                = db.Column(db.Integer(),  unique = True)
    ClaimedSLP              = db.Column(db.Integer(),  unique = True)
    UnclaimedSLP            = db.Column(db.Integer(),  unique = True)
    UnclaimedDailyAverage   = db.Column(db.Integer(),  unique = True)
    GuildRank               = db.Column(db.Text(),  unique = True)
    ScholarShare            = db.Column(db.Integer(),  unique = True)
    ManagerShare            = db.Column(db.Integer(),  unique = True)
    LastClaim               = db.Column(db.String(20),  unique = True)
    NextClaim               = db.Column(db.String(20),  unique = True)
    MMR                     = db.Column(db.Integer(),  unique = True)
    ArenaRank               = db.Column(db.Integer(),  unique = True)
    Matches                 = db.Column(db.Integer(),  unique = True)
    WinRate                 = db.Column(db.Text(),  unique = True)
    Wins                    = db.Column(db.Integer(),  unique = True)
    Draws                   = db.Column(db.Integer(),  unique = True)
    Losses                  = db.Column(db.Integer(),  unique = True)

    def __init__(self):
        pass

class TimeRecords(db.Model):
    __tablename__ = 'timeRecords'
    DateTime                = db.Column(db.Text())
    Name                    = db.Column(db.Text(),  unique = True)
    Ronin                   = db.Column(db.Text(),  unique = True, primary_key=True)
    Total                   = db.Column(db.Integer())

    def __init__(self):
        pass
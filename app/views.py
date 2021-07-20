# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

# Python modules
import os, logging
from traceback import print_tb 

# Flask modules
from flask               import render_template, request, url_for, redirect, send_from_directory
from flask_login         import login_user, logout_user, current_user, login_required
from werkzeug.exceptions import HTTPException, NotFound, abort
from jinja2              import TemplateNotFound

# App modules
from app        import app, lm, db, bc
from app.models import User, MainTable, TimeRecords
from app.forms  import LoginForm, RegisterForm
from sqlalchemy.sql import func

# provide login manager with load_user callback
@lm.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Logout user
@app.route('/logout.html')
def logout():
    logout_user()
    return redirect(url_for('index'))

# Register a new user
@app.route('/register.html', methods=['GET', 'POST'])
def register():
    
    # declare the Registration Form
    form = RegisterForm(request.form)

    msg     = None
    success = False

    if request.method == 'GET': 

        return render_template( 'accounts/register.html', form=form, msg=msg )

    # check if both http method is POST and form is valid on submit
    if form.validate_on_submit():

        # assign form data to variables
        username = request.form.get('username', '', type=str)
        password = request.form.get('password', '', type=str) 
        email    = request.form.get('email'   , '', type=str) 

        # filter User out of database through username
        user = User.query.filter_by(user=username).first()

        # filter User out of database through username
        user_by_email = User.query.filter_by(email=email).first()

        if user or user_by_email:
            msg = 'Error: User exists!'
        
        else:         

            pw_hash = bc.generate_password_hash(password)

            user = User(username, email, pw_hash)

            user.save()

            msg     = 'User created, please <a href="' + url_for('login') + '">login</a>'     
            success = True

    else:
        msg = 'Input error'     

    return render_template( 'accounts/register.html', form=form, msg=msg, success=success )

# Authenticate user
@app.route('/login.html', methods=['GET', 'POST'])
def login():
    
    # Declare the login form
    form = LoginForm(request.form)

    # Flask message injected into the page, in case of any errors
    msg = None

    # check if both http method is POST and form is valid on submit
    if form.validate_on_submit():

        # assign form data to variables
        username = request.form.get('username', '', type=str)
        password = request.form.get('password', '', type=str) 

        # filter User out of database through username
        user = User.query.filter_by(user=username).first()

        if user:
            
            if bc.check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for('index'))
            else:
                msg = "Wrong password. Please try again."
        else:
            msg = "Unknown user"

    return render_template( 'accounts/login.html', form=form, msg=msg )

""" # App main route + generic routing
@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path>')
def index1(path):

    # if not current_user.is_authenticated:
    #     return redirect(url_for('login'))
    try:

        if not path.endswith( '.html' ):
            path += '.html'

        # Serve the file (if exists) from app/templates/FILE.html
        return render_template( path )
    
    except TemplateNotFound:
        return render_template('page-404.html'), 404
    
    except:
        return render_template('page-500.html'), 500
"""
# Return sitemap
@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'sitemap.xml')

@app.route('/')
def tracker():
    user_info = MainTable.query.all()
    print(user_info)
    slpdata = db.session.query( \
        func.avg(MainTable.TotalSLP).label('avg_total'), \
        func.sum(MainTable.TotalSLP).label('sum_total'), \
        # func.count(MainTable.Name).label('total_count'), \
        func.sum(MainTable.UnclaimedSLP).label('sum_unclaimed'), \
        func.sum(MainTable.ClaimedSLP).label('sum_claimed'), \
        func.sum(MainTable.ManagerShare).label('sum_manager'), \
        func.sum(MainTable.ScholarShare).label('sum_scholar'), \
        ).all()

    tabledata = db.session.query( \
        MainTable.Name, \
        MainTable.RoninAddress, \
        MainTable.TotalSLP.label('total'), \
        MainTable.UnclaimedSLP.label('unclaimed'), \
        MainTable.ClaimedSLP.label('claimed'), \
        MainTable.ManagerShare.label('manager'), \
        MainTable.ScholarShare.label('scholar'), \
        )\
        .all()
    print("Total SLP AVG: ", slpdata[0].avg_total)
    return render_template('scholar-tracker.html', slpdata=slpdata, tabledata=tabledata)


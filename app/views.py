# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

# Python modules
import os
import decimal 

# Flask modules
from flask               import json, jsonify, render_template, request, url_for, redirect, send_from_directory, flash
from sqlalchemy.sql.expression import desc
from flask_login         import login_user, logout_user, current_user, login_required
import sqlalchemy
from werkzeug.exceptions import HTTPException, NotFound, abort
from jinja2              import TemplateNotFound

# App modules
from app                 import app, check_confirmed, lm, db, bc, send_email
from app.models          import ScholarshipDaily, User, Scholarship
from app.forms           import LoginForm, RegisterForm
from app.token           import generate_confirmation_token, confirm_token
from sqlalchemy.sql      import func
from sqlalchemy          import table, text
# Utils
from .util import getAllCurrencies, getChangePercent, getRateForSLP
from datetime import datetime, date

class DecimalEncoder(json.JSONEncoder):

    def default(self, o):

        if isinstance(o, decimal.Decimal):
            return str(o)

        super(DecimalEncoder, self).default(o)

app.json_encoder = DecimalEncoder

def datatime_from_epoch(epoch_time):
    if epoch_time == None:
        return "--"
    return datetime.fromtimestamp(epoch_time)

def humanize_ts(timestamp=False):
    """
    Get a datetime object or a int() Epoch timestamp and return a
    pretty string like 'an hour ago', 'Yesterday', '3 months ago',
    'just now', etc
    """
    now = datetime.now()
    diff = now - datetime.fromtimestamp(timestamp)
    second_diff = diff.seconds
    day_diff = diff.days

    if day_diff < 0:
        return ''

    if day_diff == 0:
        if second_diff < 10:
            return "just now"
        if second_diff < 60:
            return str(int(second_diff)) + " seconds ago"
        if second_diff < 120:
            return "a minute ago"
        if second_diff < 3600:
            return str(int(second_diff / 60)) + " minutes ago"
        if second_diff < 7200:
            return "an hour ago"
        if second_diff < 86400:
            return str(int(second_diff / 3600)) + " hours ago"
    if day_diff == 1:
        return "Yesterday"
    if day_diff < 7:
        return str(day_diff) + " days ago"
    if day_diff < 31:
        return str(int(day_diff / 7)) + " weeks ago"
    if day_diff < 365:
        return str(int(day_diff / 30)) + " months ago"
    return str(int(day_diff / 365)) + " years ago"

app.jinja_env.filters['humanize'] = humanize_ts
app.jinja_env.filters['datetime_from_epoch'] = datatime_from_epoch

# provide login manager with load_user callback
@lm.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Logout user
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

# Register a new user
@app.route('/register', methods=['GET', 'POST'])
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

            user = User(username, email, pw_hash, confirmed=False)

            user.save()

            msg     = 'User created, please <a href="' + url_for('login') + '">login</a>'     
            success = True

            token = generate_confirmation_token(user.email)
            confirm_url = url_for('confirm_email', token=token, _external=True)
            html = render_template('confirm_email.html', confirm_url=confirm_url)
            subject = "Please confirm your email"
            send_email(user.email, subject, html)

            flash('A confirmation email has been sent via email.', 'success')
            login_user(user)
            return redirect(url_for("unconfirmed"))

    else:
        msg = 'Input error'     

    return render_template( 'accounts/register.html', form=form, msg=msg, success=success )

@app.route('/confirm/<token>')
@login_required
def confirm_email(token):
    try:
        email = confirm_token(token)
    except:
        flash('The confirmation link is invalid or has expired.', 'danger')
    user = User.query.filter_by(email=email).first_or_404()
    if user.confirmed:
        flash('Account already confirmed. Please login.', 'success')
    else:
        user.confirmed = True
        user.confirmed_on = datetime.now()
        db.session.add(user)
        db.session.commit()
        flash('You have confirmed your account. Thanks!', 'success')
    return redirect(url_for('login'))

@app.route('/unconfirmed')
@login_required
def unconfirmed():
    if current_user.confirmed:
        return redirect('index')
    flash('Please confirm your account!', 'warning')
    return render_template('unconfirmed.html')

@app.route('/resend')
@login_required
def resend_confirmation():
    token = generate_confirmation_token(current_user.email)
    confirm_url = url_for('confirm_email', token=token, _external=True)
    html = render_template('confirm_email.html', confirm_url=confirm_url)
    subject = "Please confirm your email"
    send_email(current_user.email, subject, html)
    flash('A new confirmation email has been sent.', 'success')
    return redirect(url_for('unconfirmed'))

# Authenticate user
@app.route('/login', methods=['GET', 'POST'])
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
                if user.confirmed:
                    return redirect(url_for('index'))
                return redirect(url_for('unconfirmed'))
            else:
                msg = "Wrong password. Please try again."
        else:
            msg = "Unknown user"

    return render_template( 'accounts/login.html', form=form, msg=msg )

# App main route + generic routing
""" @app.route('/', defaults={'path': 'trackers/scholar-tracker.html'})
@app.route('/<path>')
def index(path):

    if not current_user.is_authenticated:
        return redirect(url_for('login'))
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
def index():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))

    slpdata = db.session.query( \
        func.avg(Scholarship.daily_average).label('avg_total'), \
        func.sum(Scholarship.TotalSLP).label('sum_total'), \
        # func.count(Scholarship.Name).label('total_count'), \
        func.sum(Scholarship.UnclaimedSLP).label('sum_unclaimed'), \
        func.sum(Scholarship.ClaimedSLP).label('sum_claimed'), \
        func.sum(Scholarship.ManagerShare).label('sum_manager'), \
        func.sum(Scholarship.ScholarShare).label('sum_scholar'), \
        ) \
        .one_or_none()
    # func.count(case([((Child.naughty == True), Child.id)], else_=literal_column("NULL"))).label("naughty")])

    today_date = date.today()
    today_epoch = datetime(today_date.year, today_date.month, today_date.day, 0, 0).timestamp() # today 00:00:00
    yesterday_epoch = today_epoch-86400 # yesterday 00:00:00
    
    tabledata = db.session.query( 
        ScholarshipDaily.Name,
        Scholarship.RoninAddress,
        Scholarship.TotalSLP.label('total'),
        Scholarship.UnclaimedSLP.label('unclaimed'),
        Scholarship.ClaimedSLP.label('claimed'),
        Scholarship.ManagerShare.label('manager'),
        Scholarship.ScholarShare.label('scholar'),
        Scholarship.LastClaim.label('lastclaim'),
        Scholarship.NextClaim.label('nextclaim'),
        Scholarship.MMR.label('mmr'),
        Scholarship.ArenaRank.label('rank'),
        Scholarship.daily_average.label('avg'),
        func.sum(func.IF((ScholarshipDaily.Date > today_epoch) & (ScholarshipDaily.Date < today_epoch+86400), ScholarshipDaily.SLP, 0)).label('today_total'),
        func.sum(func.IF((ScholarshipDaily.Date > yesterday_epoch) & (ScholarshipDaily.Date < yesterday_epoch+86400), ScholarshipDaily.SLP, 0)).label('yesterday_total')
    )\
    .join(Scholarship, Scholarship.RoninAddress==ScholarshipDaily.RoninAddress)\
    .group_by(ScholarshipDaily.Name)\
    .all()
    # .paginate(per_page=10, page=1, error_out=True)
    # .all()
    # sql = text(f""" \
    #     SELECT
    #         d.`Name`,
    #         s.RoninAddress,
    #         s.TotalSLP as total,
    #         s.UnclaimedSLP as unclaimed,
    #         s.ClaimedSLP as claimed,
    #         s.ManagerShare as manager,
    #         s.ScholarShare as scholar,
    #         s.LastClaim as lastclaim,
    #         s.NextClaim as nextclaim,
    #         s.MMR as mmr,
    #         s.ArenaRank as `rank`,
    #         s.daily_average as avg,
    #         SUM(CASE WHEN (d.Date > {today_epoch} AND d.Date < {today_epoch+86400}) THEN d.SLP ELSE 0 END) AS today_total,
    #         SUM(CASE WHEN (d.Date > {yesterday_epoch} AND d.Date < {yesterday_epoch+86400}) THEN d.SLP ELSE 0 END) AS yesterday_total
    #     FROM scholar_daily_totals d
    #     LEFT JOIN scholarship_tracker s
    #     ON d.RoninAddress = s.RoninAddress
    #     GROUP BY `Name`
    #     """)
    # print(sql)
    # tabledata = db.engine.execute(sql)
    
    currentRateForSLP = getRateForSLP()
    percentage = getChangePercent()
    
    return render_template('trackers/scholar-tracker.html', slpdata=slpdata, tabledata=tabledata, currentRateForSLP=currentRateForSLP, percentage=percentage)

@app.route('/data', methods=['POST', 'GET'])
def data():

    page_num = request.form.get('page_num')
    per_page = request.form.get('per_page')

    # func.sum(func.IF((ScholarshipDaily.Date > today_epoch) & (ScholarshipDaily.Date < today_epoch+86400), ScholarshipDaily.SLP, 0)).label('today_total'),
    # func.sum(func.IF((ScholarshipDaily.Date > yesterday_epoch) & (ScholarshipDaily.Date < yesterday_epoch+86400), ScholarshipDaily.SLP, 0)).label('yesterday_total'),

    today_date = date.today()
    today_epoch = datetime(today_date.year, today_date.month, today_date.day, 0, 0).timestamp() # today 00:00:00
    yesterday_epoch = today_epoch-86400 # yesterday 00:00:00
    tabledata = db.session.query( 
        Scholarship.RoninAddress,
        Scholarship.Name,
        Scholarship.daily_average.label('avg'),
        Scholarship.UnclaimedSLP.label('unclaimed'),
        Scholarship.ClaimedSLP.label('claimed'),
        Scholarship.TotalSLP.label('total'),
        Scholarship.LastClaim.label('lastclaim'),
        Scholarship.NextClaim.label('nextclaim'),
        Scholarship.ManagerShare.label('manager'),
        Scholarship.ScholarShare.label('scholar'),
        Scholarship.MMR.label('mmr'),
        Scholarship.ArenaRank.label('rank'),
        Scholarship.id
    )\
    .all()

    res_list = []

    for row in tabledata:
        # Get Ronin Address
        roninAddress = row[0]
        # Get 3 SLP Ordered by Date 
        slpdata = db.session.query(ScholarshipDaily.SLP).filter(ScholarshipDaily.RoninAddress==roninAddress).order_by(desc(ScholarshipDaily.Date)).limit(3).all()
        # Get Earned SLP of today and yesterday
        today_slp = yesterday_slp = 0
        
        if len(slpdata) == 3:
            today_slp = abs( int(0 if slpdata[0][0] is None else slpdata[0][0]) - int(0 if slpdata[1][0] is None else slpdata[1][0]) )
            yesterday_slp = abs( int(0 if slpdata[1][0] is None else slpdata[1][0]) - int(0 if slpdata[2][0] is None else slpdata[2][0]) )

        plain_row = [roninAddress, row[1], today_slp, yesterday_slp, row[2], row[3],\
             row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11]]
        res_list.append(plain_row)
    
    res = {"data": res_list}

    return jsonify(res)

@app.route('/getRate', methods=['POST'])
def getRate():
    currency = request.form.get('currency')
    rate = getRateForSLP(currency)
    return json.dumps({"rate": rate})


# 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 

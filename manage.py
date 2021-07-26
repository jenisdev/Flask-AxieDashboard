import datetime
from flask_script import Manager
from app import app, db, bc
from app.models import User
manager = Manager(app)


"""Creates the admin user."""
@manager.command
@manager.option('-u', '--username', help='Super admin username')
@manager.option('-e', '--useremail', help='Super admin email')
@manager.option('-p', '--password', help='Super admin password')
def create_admin(username, useremail, password):
    pw_hash = bc.generate_password_hash(password)
    print(username, useremail, password)
    user = User(username, useremail, pw_hash, admin=True, confirmed=True, confirmed_on=datetime.now())

    user.save()

    print("Created super admin successfully")

if __name__ == "__main__":
    manager.run()
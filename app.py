import os

from flask import (Flask, redirect, render_template, request,
                   send_from_directory, url_for)

app = Flask(__name__)


@app.route('/')
def index():
   print('Request for index page received')
   return render_template('home.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/account')
def account():
    user = {
        'name': 'Taylor Morgan',
        'account_number': 'TELCO-2025001',
        'email': 'taylor.morgan@mytelco.com',
        'phone': '+1 (555) 246-8100',
        'plan': 'Premium Unlimited',
        'balance': '$15.75',
        'status': 'Active',
        'address': '789 Oak Avenue, Gotham, USA'
    }
    return render_template('account.html', user=user)

@app.route('/hello', methods=['POST'])
def hello():
   name = request.form.get('name')

   if name:
       print('Request for hello page received with name=%s' % name)
       return render_template('hello.html', name = name)
   else:
       print('Request for hello page received with no name or blank name -- redirecting')
       return redirect(url_for('index'))


if __name__ == '__main__':
   app.run()






# votify

## Local build

Clone this repo by using
```
git clone http://github.com/krasnikovra/votify
```

### Backend

Everywhere here we assume we are in the `backend` directory

Create and activate virtual environment
```
python -m venv ./venv
.\venv\Scripts\activate
```

Install all the dependencies by executing:
```
pip3 install -r requirements.txt
```

Create `votify/secrets.py` file containing:
```python
SECRET_KEY = "YOUR_SECRET_KEY"
```

#### Database

Create a PostgreSQL database, go to `votify/settings.py` and change the following settings
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'votify',
        'USER': 'postgres',
        'PASSWORD': 'gpnb0b',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```
with your database name, user, password, host and port. You can use any other database, i.e. MySQL, but this application is tested and stable with the PostgreSQL.

#### Migrations

Run the following to create and apply migrations:
```
python manage.py makemigrations
python manage.py migrate
```

#### Development server

Start a development server with:
```
python manage.py runserver
```

If everything is ok, you will see:
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
October 19, 2022 - 19:31:52
Django version 4.1.1, using settings 'votify.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Frontend

Everywhere here we assume we are in the `frontend` directory

#### Installing dependencies

Install node.js dependencies with:
```
npm install
```

#### Development server

Start a development server with:
```
npm start
```

If everything is ok, you will see:
```
Compiled successfully!

You can now view frontend in the browser.        

  Local:            http://localhost:3000        
  On Your Network:  http://192.168.0.181:3000    

Note that the development build is not optimized.
To create a production build, use npm run build. 

webpack compiled successfully
```

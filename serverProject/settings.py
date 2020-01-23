"""
Django settings for serverProject project.

Generated by 'django-admin startproject' using Django 2.0.9.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'ml)j)2fmq7!l+9or(4jvcd2h2!18r72%g5!5yo7^9_b(j(=cjv'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['jackie.tgen.org', '10.56.0.21']

# Application definition

INSTALLED_APPS = [
  'leaflet',
  'newick.apps.NewickConfig',
  'rest_framework',
  'django.contrib.admin',
  'django.contrib.auth',
  'django.contrib.contenttypes',
  'django.contrib.sessions',
  'django.contrib.messages',
  'django.contrib.staticfiles',
  'mod_wsgi.server',
]

MIDDLEWARE = [
  'django.middleware.security.SecurityMiddleware',
  'django.contrib.sessions.middleware.SessionMiddleware',
  'django.middleware.common.CommonMiddleware',
  'django.middleware.csrf.CsrfViewMiddleware',
  'django.contrib.auth.middleware.AuthenticationMiddleware',
  'django.contrib.messages.middleware.MessageMiddleware',
  'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'serverProject.urls'

TEMPLATES = [
  {
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [os.path.join(BASE_DIR, 'serverProject/templates')],
    'APP_DIRS': True,
    'OPTIONS': {
      'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
      ],
    },
  },
]

# mod_wsgi-express start-server --url-alias /static static --port 1408 serverProject/wsgi.py
# start server, set static url, set port 1408, and point to wsgi
WSGI_APPLICATION = 'serverProject.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
  }
}

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}


# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
  {
    'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
  },
  {
    'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
  },
  {
    'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
  },
  {
    'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
  },
]


# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

SITE_URL = "epitools/"

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = os.path.join("/", SITE_URL, "static")

STATICFILES_DIRS = [
  os.path.join(BASE_DIR, "static"),
]

STATIC_ROOT = os.path.join(BASE_DIR, "static")
#STATIC_ROOT = os.path.join("/static")

# Redirect to home URL after login (Default redirects to /accounts/profile/)
LOGIN_REDIRECT_URL = 'newick/'

# map setting
LEAFLET_CONFIG = {
  'SPATIAL_EXTENT': (-115.7, 38, -108, 30.2),
  'DEFAULT_CENTER': (-112, 34.5),
  'DEFAULT_ZOOM': 7,
  'MIN_ZOOM': 6,
  'MAX_ZOOM': 14,
  'ATTRIBUTION_PREFIX': 'Tgen North',
  'ATTRIBUTION': 'stuff',
  'TILES': [],
  #  ('Gray', 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {'attribution': 'Esri &mdash; Esri, DeLorme, NAVTEQ', 'maxZoom': 16}),
  #  ('Gray', 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Gray_Base/MapServer/tile/{z}/{y}/{x}', {'attribution': 'Esri &mdash; Esri, DeLorme, NAVTEQ', 'maxZoom': 16}),
  #],
  #'OVERLAYS': [
  #  ('arizona', '/static/newick/images/map.png', {'attribution': '&copy; IGN'}),
  #],
}

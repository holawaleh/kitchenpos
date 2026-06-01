from pathlib import Path
from datetime import timedelta
import os
from urllib.parse import parse_qs, unquote, urlparse

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent


def load_env_file(path, override=False):

    if not path.exists():
        return

    for raw_line in path.read_text().splitlines():

        line = raw_line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)

        key = key.strip()

        value = value.strip().strip('"').strip("'")

        if override:
            os.environ[key] = value

        else:
            os.environ.setdefault(key, value)


load_env_file(PROJECT_ROOT / ".env")

if os.environ.get("DJANGO_SETTINGS_MODULE") == "food.settings_production":

    load_env_file(
        PROJECT_ROOT / ".env.production",
        override=True,
    )


def get_csv_env(name, default=""):

    return [
        item.strip()
        for item in os.environ.get(name, default).split(",")
        if item.strip()
    ]


def get_database_config():

    database_url = os.environ.get(
        "DATABASE_URL",
        "",
    ).strip()

    if not database_url:

        return {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }

    parsed = urlparse(database_url)

    if parsed.scheme.startswith("postgres"):

        query = parse_qs(parsed.query)

        options = {
            key: values[-1]
            for key, values in query.items()
            if values and key in {
                "sslmode",
                "channel_binding",
            }
        }

        return {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": unquote(parsed.path.lstrip("/")),
            "USER": unquote(parsed.username or ""),
            "PASSWORD": unquote(parsed.password or ""),
            "HOST": parsed.hostname or "",
            "PORT": parsed.port or 5432,
            "CONN_MAX_AGE": int(
                os.environ.get(
                    "DATABASE_CONN_MAX_AGE",
                    "600",
                )
            ),
            "OPTIONS": options,
        }

    raise ValueError(
        f"Unsupported DATABASE_URL scheme: {parsed.scheme}"
    )


# SECURITY

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

DEBUG = os.environ.get(
    "DJANGO_DEBUG",
    "False",
) == "True"

ALLOWED_HOSTS = get_csv_env(
    "DJANGO_ALLOWED_HOSTS",
    "127.0.0.1,localhost",
)


# APPLICATIONS

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Local apps
    "accounts",
    "audit",
    "common",
    "inventory",
    "payment",
    "products",
    "report",
    "sales",

    # Third party
    "rest_framework",
    "corsheaders",
]


# MIDDLEWARE

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",

    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.middleware.gzip.GZipMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "food.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

        "APP_DIRS": True,

        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "food.wsgi.application"


# DATABASE

DATABASES = {
    "default": get_database_config()
}


# DJANGO REST FRAMEWORK

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}


# JWT

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=72),

    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}


# CORS

CORS_ALLOWED_ORIGINS = get_csv_env(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
)

CSRF_TRUSTED_ORIGINS = get_csv_env(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
)

CORS_ALLOW_ALL_ORIGINS = os.environ.get(
    "DJANGO_CORS_ALLOW_ALL_ORIGINS",
    "False",
) == "True"


# PASSWORD VALIDATION

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME":
        "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },

    {
        "NAME":
        "django.contrib.auth.password_validation.MinimumLengthValidator",
    },

    {
        "NAME":
        "django.contrib.auth.password_validation.CommonPasswordValidator",
    },

    {
        "NAME":
        "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# INTERNATIONALIZATION

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# STATIC FILES

STATIC_URL = "static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_STORAGE = (
    "whitenoise.storage.CompressedManifestStaticFilesStorage"
)


# MEDIA FILES

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"


# DEFAULT PRIMARY KEY

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# CUSTOM USER MODEL

AUTH_USER_MODEL = "accounts.User"

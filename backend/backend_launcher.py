import os

from waitress import serve

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "food.settings")

from food.wsgi import application

print("Starting POS backend...")

print("Backend running on:")

print("http://127.0.0.1:8000")

serve(
    application,
    host="127.0.0.1",
    port=8000,
)

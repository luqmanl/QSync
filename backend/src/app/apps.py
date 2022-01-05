from django.apps import AppConfig
import app.top_currency_subscriber as tcs


class AppConfig(AppConfig):
    name = 'app'

    def ready(self) -> None:
        super().ready()

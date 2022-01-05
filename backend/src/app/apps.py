from django.apps import AppConfig
import app.top_currency_subscriber as tcs
from multiprocessing import Process


class AppConfig(AppConfig):
    name = 'app'

    def ready(self) -> None:
        super().ready()
        p2 = Process(target=tcs.run)
        p2.start()

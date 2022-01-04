from django.apps import AppConfig
import app.feed_handler as fh
import app.top_currency_subscriber as tcs
from multiprocessing import Process


class AppConfig(AppConfig):
    name = 'app'

    def ready(self) -> None:
        super().ready()
        p1 = Process(target=fh.run)
        p1.start()
        p2 = Process(target=tcs.run)
        p2.start()

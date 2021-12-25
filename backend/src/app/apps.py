from django.apps import AppConfig
import app.feed_handler as fh
from multiprocessing import Process


class AppConfig(AppConfig):
    name = 'app'

    def ready(self) -> None:
        super().ready()
        p = Process(target=fh.run)
        p.start()

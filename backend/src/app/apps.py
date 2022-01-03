from django.apps import AppConfig
import subprocess


class AppConfig(AppConfig):
    name = 'app'

    def ready(self) -> None:
        super().ready()

from django.apps import AppConfig
import subprocess
from .subscriber import ListenerThread
from qpython.qtype import QException
import numpy
from qpython.qcollection import QTable
from qpython.qconnection import QConnection


class AppConfig(AppConfig):
    name = 'app'

    def ready(self) -> None:
        super().ready()
        # subprocess.run(["redis-server"])
        ListenerThread().start()

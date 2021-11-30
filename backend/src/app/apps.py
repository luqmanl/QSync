from django.apps import AppConfig
import subprocess
from qpython.qtype import QException
import numpy
from qpython.qcollection import QTable
from qpython.qconnection import QConnection
import app.feed_handler as fh
import threading
from multiprocessing import Process


class AppConfig(AppConfig):
    name = 'app'

    def ready(self) -> None:
        super().ready()
        p = Process(target=fh.run)
        p.start()

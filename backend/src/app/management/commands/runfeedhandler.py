from django.core.management.base import BaseCommand, CommandError
import app.feed_handler as fh
from multiprocessing import Process


class Command(BaseCommand):
    help = 'starts up the feedhandler'

    def handle(self, *args, **options):
        p = Process(target=fh.run)
        p.start()

        self.stdout.write(self.style.SUCCESS(
            'Successfully initialised feedhandler '))

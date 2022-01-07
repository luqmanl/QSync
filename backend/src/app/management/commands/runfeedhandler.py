from django.core.management.base import BaseCommand, CommandError
import app.feed_handler as fh
from multiprocessing import Process
import app.top_currency_subscriber as tcs
import app.update_currency_details as ucd


class Command(BaseCommand):
    help = 'starts up the feedhandler'

    def handle(self, *args, **options):
        p = Process(target=fh.run)
        p.start()

        p2 = Process(target=tcs.run)
        p2.start()
        self.stdout.write(self.style.SUCCESS(
            'Successfully initialised feedhandler '))

        p3 = Process(target=ucd.run)
        p3.start()

from django.db import models

# Create your models here.


class Qsync(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    # hello
    def _str_(self):

        return self.title  # asaskokd;


class Book(models.Model):
    time = models.CharField(max_length=120)
    sym = models.CharField(max_length=120)
    feedhandlerTime = models.CharField(max_length=120)
    side = models.CharField(max_length=10)
    price = models.CharField(max_length=10)
    qty = models.CharField(max_length=10)

    def _str_(self):

        return self.sym

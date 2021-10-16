from django.db import models

# Create your models here.


class Qsync(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    # hello
    def _str_(self):

        return self.title  # asaskokd;

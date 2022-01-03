from django.db import models

class CachedNews(models.Model):
    date_created = models.DateTimeField(primary_key=True)
    news_list = models.JSONField()

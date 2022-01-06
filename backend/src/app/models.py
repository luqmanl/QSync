from django.core.exceptions import DisallowedRedirect
from django.db import models

class CachedNews(models.Model):
    date_created = models.DateTimeField(primary_key=True)
    news_list = models.JSONField()

class SupportedExchanges(models.Model):
    exchange_name = models.TextField(primary_key=True)

class SupportedCurrencies(models.Model):
    ticker = models.TextField(primary_key=True)
    data_supplying_exchange = models.ForeignKey(SupportedExchanges, on_delete=models.SET_DEFAULT, default="UNKNOWN")

class CurrencyDescriptions(models.Model):
    currency = models.OneToOneField(SupportedCurrencies, on_delete=models.CASCADE, primary_key=True)
    general_description = models.TextField() 
    full_name = models.TextField()
    
class CurrencyCharacteristics(models.Model):
    characteristic = models.TextField(primary_key=True)
    description = models.TextField()

class RelatedCharacteristics(models.Model):
    characteristic = models.ForeignKey(CurrencyCharacteristics, on_delete=models.CASCADE)
    currency = models.ForeignKey(SupportedCurrencies, on_delete=models.CASCADE)

class CurrencyInformation(models.Model):
    currency = models.OneToOneField(SupportedCurrencies, on_delete=models.CASCADE, primary_key=True)
    current_supply = models.FloatField(blank=True, null=True)
    total_supply = models.FloatField(blank=True, null=True)
    transactions_per_second = models.FloatField(blank=True, null=True)
    total_transactions = models.FloatField(blank=True, null=True)
    market_dominance_percentage = models.FloatField(blank=True, null=True)
    active_addresses = models.FloatField(blank=True, null=True)
    transactions_24h = models.FloatField(blank=True, null=True)
    average_transaction_fee_usd_24h = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PriceInformation(models.Model):
    currency = models.OneToOneField(SupportedCurrencies, on_delete=models.CASCADE, primary_key=True)
    high_24h = models.FloatField(blank=True, null=True)
    low_24h = models.FloatField(blank=True, null=True)
    high_1y = models.FloatField(blank=True, null=True)
    low_1y = models.FloatField(blank=True, null=True)
    change_24h = models.FloatField(blank=True, null=True)
    change_1y = models.FloatField(blank=True, null=True)
    volume_24h = models.IntegerField(blank=True, null=True)
    market_cap = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class FutureInformation(models.Model):
    currency = models.OneToOneField(SupportedCurrencies, on_delete=models.CASCADE, primary_key=True)
    perpetual_price = models.FloatField(blank=True, null=True)
    funding_rate = models.FloatField(blank=True, null=True)
    basis = models.FloatField(blank=True, null=True)
    open_interest = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

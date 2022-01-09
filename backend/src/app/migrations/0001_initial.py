# Generated by Django 4.0 on 2022-01-09 13:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CachedNews',
            fields=[
                ('date_created', models.DateTimeField(
                    primary_key=True, serialize=False)),
                ('news_list', models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='CurrencyCharacteristics',
            fields=[
                ('characteristic', models.TextField(
                    primary_key=True, serialize=False)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='SupportedCurrencies',
            fields=[
                ('ticker', models.TextField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='SupportedExchanges',
            fields=[
                ('exchange_name', models.TextField(
                    primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='CoinGeckoCurrencyIDs',
            fields=[
                ('currency', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE,
                 primary_key=True, serialize=False, to='app.supportedcurrencies')),
                ('api_id', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='CurrencyDescriptions',
            fields=[
                ('currency', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE,
                 primary_key=True, serialize=False, to='app.supportedcurrencies')),
                ('general_description', models.TextField()),
                ('full_name', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='supportedcurrencies',
            name='data_supplying_exchange',
            field=models.ForeignKey(
                default='UNKNOWN', on_delete=django.db.models.deletion.SET_DEFAULT, to='app.supportedexchanges'),
        ),
        migrations.CreateModel(
            name='RelatedCharacteristics',
            fields=[
                ('id', models.AutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('characteristic', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='app.currencycharacteristics')),
                ('currency', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='app.supportedcurrencies')),
            ],
        ),
        migrations.CreateModel(
            name='PriceInformation',
            fields=[
                ('id', models.AutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('high_24h', models.FloatField(blank=True, null=True)),
                ('low_24h', models.FloatField(blank=True, null=True)),
                ('high_1y', models.FloatField(blank=True, null=True)),
                ('low_1y', models.FloatField(blank=True, null=True)),
                ('change_24h', models.FloatField(blank=True, null=True)),
                ('change_1y', models.FloatField(blank=True, null=True)),
                ('volume_24h', models.IntegerField(blank=True, null=True)),
                ('market_cap', models.FloatField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('currency', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='app.supportedcurrencies')),
            ],
        ),
        migrations.CreateModel(
            name='FutureInformation',
            fields=[
                ('id', models.AutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('perpetual_price', models.FloatField(blank=True, null=True)),
                ('funding_rate', models.FloatField(blank=True, null=True)),
                ('basis', models.FloatField(blank=True, null=True)),
                ('open_interest', models.FloatField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('currency', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='app.supportedcurrencies')),
            ],
        ),
        migrations.CreateModel(
            name='CurrencyInformation',
            fields=[
                ('id', models.AutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('current_supply', models.FloatField(blank=True, null=True)),
                ('total_supply', models.FloatField(blank=True, null=True)),
                ('transactions_per_second', models.FloatField(blank=True, null=True)),
                ('total_transactions', models.FloatField(blank=True, null=True)),
                ('market_dominance_percentage',
                 models.FloatField(blank=True, null=True)),
                ('active_addresses', models.FloatField(blank=True, null=True)),
                ('transactions_24h', models.FloatField(blank=True, null=True)),
                ('average_transaction_fee_usd_24h',
                 models.FloatField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('currency', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='app.supportedcurrencies')),
            ],
        ),
    ]

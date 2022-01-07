from time import sleep
from app.models import FutureInformation, PriceInformation, SupportedCurrencies, CurrencyInformation, CoinGeckoCurrencyIDs
from django.forms.models import model_to_dict
from requests import get
from math import nan
from json import dumps
from django.utils import timezone

BLOCKCHAIR_URL = "https://api.blockchair.com/{}/stats"
COINGECKO_URL = "https://api.coingecko.com/api/v3/coins/{}"


def run():

    while True:
        currencies = SupportedCurrencies.objects.all()

        for currency in currencies:
            ticker = model_to_dict(currency)["ticker"]

            api_id = model_to_dict(CoinGeckoCurrencyIDs.objects.filter(
                currency=ticker)[0])["api_id"]

            coingecko_data = get(COINGECKO_URL.format(api_id)).json()
            blockchair_data = get(BLOCKCHAIR_URL.format(api_id)).json()["data"]

            currency_info = CurrencyInformation(
                currency=currency,
                current_supply=coingecko_data["market_data"]["circulating_supply"],
                total_supply=coingecko_data["market_data"]["max_supply"],
                transactions_per_second=(
                    float(blockchair_data["transactions_24h"]) / (24.0 * 60.0 * 60.0)),
                total_transactions=(
                    blockchair_data["transactions"] if "transactions" in blockchair_data else nan),
                market_dominance_percentage=(
                    blockchair_data["market_dominance_percentage"] if "market_dominance_percentage" in blockchair_data else nan),
                active_addresses=(
                    blockchair_data["hodling_addresses"] if "hodling_addresses" in blockchair_data else nan),
                transactions_24h=(
                    blockchair_data["transactions_24h"] if "transactions_24h" in blockchair_data else nan),
                average_transaction_fee_usd_24h=(
                    blockchair_data["average_transaction_fee_usd_24h"] if "average_transaction_fee_usd_24h" in blockchair_data else nan),
                created_at=timezone.now(),
                updated_at=timezone.now()
            )

            currency_info.save()

            price_information = PriceInformation(
                currency=currency,
                high_24h=coingecko_data["market_data"]["high_24h"]["usd"],
                low_24h=coingecko_data["market_data"]["low_24h"]["usd"],
                high_1y=nan,
                low_1y=nan,
                change_24h=coingecko_data["market_data"]["price_change_percentage_24h"],
                change_1y=coingecko_data["market_data"]["price_change_percentage_1y"],
                volume_24h=coingecko_data["market_data"]["total_volume"]["usd"],
                market_cap=coingecko_data["market_data"]["market_cap"]["usd"],
                created_at=timezone.now(),
                updated_at=timezone.now()
            )

            price_information.save()

            future_information = FutureInformation(
                currency=currency,
                perpetual_price=nan,
                funding_rate=nan,
                basis=nan,
                open_interest=nan,
                created_at=timezone.now(),
                updated_at=timezone.now()
            )

            future_information.save()

        sleep(30 * 60)

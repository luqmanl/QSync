from django.urls import path
from app.consumers import L2orderbookConsumer, L2overviewConsumer, BasisTableConsumer, TradeTableConsumer, TopCurrenciesConsumer


ws_urlpatterns = [path('ws/data/l2overview/', L2overviewConsumer()),
                  path('ws/data/l2orderbook/', L2orderbookConsumer()),
                  path('ws/data/basis/', BasisTableConsumer()),
                  path('ws/data/trade/', TradeTableConsumer()),
                  path('ws/data/top_currencies_table/', TopCurrenciesConsumer())]

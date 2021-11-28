from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url
from django.urls import path
from channels.security.websocket import AllowedHostsOriginValidator
from app.consumers import L2orderbookConsumer, L2overviewConsumer, BasisTableConsumer, TradeTableConsumer


ws_urlpatterns = [path('ws/data/l2overview/', L2overviewConsumer()),
                  path('ws/data/l2orderbook/', L2orderbookConsumer()),
                  path('ws/data/basis/', BasisTableConsumer()),
                  path('ws/data/trade/', TradeTableConsumer())]

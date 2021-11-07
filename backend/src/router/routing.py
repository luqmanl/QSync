from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url
from django.urls import path
from channels.security.websocket import AllowedHostsOriginValidator
from app.consumers import QsyncConsumer


ws_urlpatterns = [path(
    'ws/data/<str:exchange_name>/<str:pair_name>/<str:data_type>/', QsyncConsumer())]
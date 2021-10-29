from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url
from channels.security.websocket import AllowedHostsOriginValidator
from app.consumers import QsyncConsumer

application = ProtocolTypeRouter({
  'websocket': AllowedHostsOriginValidator(
    URLRouter(
      [
        url("ws/data", QsyncConsumer())
      ]
    )
  )
})

from django.urls import path

from . import views

urlpatterns = [
    path('', views.index)
]

# from django.urls import re_path

# from . import consumers

# websocket_urlpatterns = [
#     re_path(r'ws/(?P<room_name>\w+)/$', consumers.ChatConsumer),
# ]
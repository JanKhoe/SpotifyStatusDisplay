from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    # name is used as a formal name so that a redirect function knows which path to follow within the app
    path('', index, name=""),
    path('join', index),
    path('create', index),
    # Varible path names are denoted in django as <type: varName>
    path('room/<str:roomCode>', index)
]

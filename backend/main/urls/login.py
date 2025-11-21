from django.urls import path
from main.views.login import login_view

urlpatterns = [
    path('', login_view, name='login'),
]


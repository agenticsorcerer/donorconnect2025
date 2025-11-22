from django.urls import path
from main.views.donate import donate_form_view

urlpatterns = [
    path('', donate_form_view, name='donate-form'),
]


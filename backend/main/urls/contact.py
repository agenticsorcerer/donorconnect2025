from django.urls import path
from main.views.contact import contact_form_view

urlpatterns = [
    path('', contact_form_view, name='contact-form'),
]







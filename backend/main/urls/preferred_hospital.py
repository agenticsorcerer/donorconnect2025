from rest_framework.routers import DefaultRouter
from django.urls import path, include 
from main.views.preferred_hospital import PreferredHospitalView

router = DefaultRouter()
router.register(r'preferred-hospitals', PreferredHospitalView, basename='preferred-hospital')

urlpatterns = [
    path('', include(router.urls)),
]
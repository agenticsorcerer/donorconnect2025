from rest_framework.routers import DefaultRouter
from django.urls import path, include
from main.views.donation_type import DonationTypeView

router = DefaultRouter()
router.register(r'donation-types', DonationTypeView, basename='donation-type')

urlpatterns = [
    path('', include(router.urls)),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from main.views.donation_request import DonationRequestView

router = DefaultRouter()
router.register(r'donation-requests', DonationRequestView, basename='donation-request')

urlpatterns = [
    path('', include(router.urls)),
]
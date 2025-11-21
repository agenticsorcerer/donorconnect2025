from rest_framework.routers import DefaultRouter
from django.urls import path, include
from main.views.donor_profile import DonorProfileView

router = DefaultRouter()
router.register(r'', DonorProfileView, basename='donor-profile')

urlpatterns = [
    path('', include(router.urls)),
]
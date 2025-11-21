"""
URL configuration for donorconnect project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from donorconnect.views import serve_frontend

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints - these should come before frontend routes
    path('api/users/', include('main.urls.user')),
    path('api/role/', include('main.urls.role')),
    path('api/donation-requests/', include('main.urls.donation_request')),# Also keep original API paths for backward compatibility
    path('api/donation-types/', include('main.urls.donation_type')),
    path('api/donor-profiles/', include('main.urls.donor_profile')),
    path('api/notification-types/', include('main.urls.notification_type')),
    path('api/notifications/', include('main.urls.notifications')),
    path('api/preferred-hospitals/', include('main.urls.preferred_hospital')),
        # Serve static files from frontend/assets
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': str(settings.FRONTEND_DIR / 'assets')}),
    # Serve components directory
    re_path(r'^components/(?P<path>.*)$', serve, {'document_root': str(settings.FRONTEND_DIR / 'components')}),
    # Serve js directory
    re_path(r'^js/(?P<path>.*)$', serve, {'document_root': str(settings.FRONTEND_DIR / 'js')}),
    # Root path
    path('', serve_frontend, kwargs={'path': ''}),
    # Serve frontend HTML files (this should be last to catch all other routes)
    re_path(r'^(?P<path>.+)$', serve_frontend),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 
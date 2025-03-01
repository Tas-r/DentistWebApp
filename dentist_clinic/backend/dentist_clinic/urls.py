"""
URL configuration for dentist_clinic project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.urls import path, include
from django.http import JsonResponse # added to test api endpoint
from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
 ) # added for the login page


def test_api(request):
    return JsonResponse({"message": "django api is working"})

def home_view(request):
    return HttpResponse("homepage dot html") 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('billing.urls')),
    path('api/', include('appointments.urls')), 
    
    # start stuff i'm adding in to make the frontend
    path('api/test/', test_api), # added to test api endpoint
    path('', home_view), # i dont like the weird page
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # login api
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    # end stuff i'm adding in to make the frontend
]


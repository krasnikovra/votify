from django.urls import path
from .views import (
    LoginAPIView, RegistrationAPIView, UserAPIView
)

urlpatterns = [
    path('register/', RegistrationAPIView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('user/', UserAPIView.as_view()),
]

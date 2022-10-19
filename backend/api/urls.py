from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'questions', views.QuestionViewSet, basename='question')

urlpatterns = [
    path('', include(router.urls)),
    path('vote/', views.VoteView.as_view()),
]

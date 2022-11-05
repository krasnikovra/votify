from django.urls import path, include
from rest_framework import routers
from . import views

urlpatterns = [
    path('vote/', views.VoteView.as_view()),
    path('question/<int:pk>/', views.QuestionViewSet.as_view({'get': 'get_specific', 'options': 'options'})),
    path('question/', views.QuestionViewSet.as_view({'post': 'post', 'options': 'options'}))
]

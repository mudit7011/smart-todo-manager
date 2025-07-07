from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, CategoryViewSet, ContextEntryViewSet, ai_suggestions

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'contexts', ContextEntryViewSet, basename='context')

urlpatterns = [
    path('', include(router.urls)),
    path('ai/suggestions/', ai_suggestions, name='ai-suggestions'),
]

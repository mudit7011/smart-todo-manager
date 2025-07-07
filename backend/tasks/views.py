from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Task, Category, ContextEntry
from .serializers import TaskSerializer, CategorySerializer, ContextEntrySerializer
from .ai_module import get_task_suggestions

# ViewSets for CRUD operations

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ContextEntryViewSet(viewsets.ModelViewSet):
    queryset = ContextEntry.objects.all().order_by('-timestamp')
    serializer_class = ContextEntrySerializer


# AI Suggestion Endpoint
@api_view(['POST'])
def ai_suggestions(request):
    """
    Expects:
    {
        "title": "Buy groceries",
        "description": "Need to restock veggies and fruits",
        "category": "Personal",
        "context": ["You’re running low on apples", "Reminder to eat healthier"]
    }
    """
    data = request.data
    suggestions = get_task_suggestions(
        title=data.get("title", ""),
        description=data.get("description", ""),
        category=data.get("category", ""),
        context_list=data.get("context", [])
    )
    return Response(suggestions, status=200)

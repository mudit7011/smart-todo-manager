from django.contrib import admin

from django.contrib import admin
from .models import Category, Task, ContextEntry

admin.site.register(Category)
admin.site.register(Task)
admin.site.register(ContextEntry)

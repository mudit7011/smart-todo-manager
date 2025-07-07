from rest_framework import serializers
from .models import Task, Category, ContextEntry

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    # This field is for reading (GET requests) – it will display the category's name.
    # It accesses the 'name' attribute of the related 'category' object.
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Task
        # Explicitly list all fields from your Task model, including the foreign key 'category'.
        # 'category_name' is read-only and won't be expected in incoming data.
        fields = [
            'id',
            'title',
            'description',
            'category', # This is the foreign key. On write, it expects the Category ID.
            'category_name', # For reading/displaying the category's name.
            'priority_score',
            'deadline',
            'status',
            'created_at',
            'updated_at',
        ]
        # Use extra_kwargs to explicitly define write behavior for the 'category' foreign key.
        # This tells DRF that 'category' expects an ID when creating/updating tasks.
        # 'write_only': True makes it so this field is not returned in GET requests,
        # relying on category_name for display. You can remove it if you want the ID returned too.
        extra_kwargs = {
            'category': {'write_only': True, 'required': False} # 'required=False' allows tasks without a category
        }

class ContextEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContextEntry
        fields = '__all__'
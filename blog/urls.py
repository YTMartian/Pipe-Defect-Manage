from django.urls import path
from . import views

urlpatterns = [
    path('add_project/', views.add_project, ),
    path('delete_project/', views.delete_project, ),
    path('get_project/', views.get_project, ),
]

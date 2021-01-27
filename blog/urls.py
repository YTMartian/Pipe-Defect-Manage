from django.urls import path
from . import views

urlpatterns = [
    path('add_student/', views.add_student, ),
    path('show_students', views.show_students, ),
]
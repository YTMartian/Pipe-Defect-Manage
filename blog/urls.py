from django.urls import path
from . import views

urlpatterns = [
    path('get_project/', views.get_project),
    path('delete_project/', views.delete_project),
    path('add_project/', views.add_project),
    path('get_line/', views.get_line),
    path('delete_line/', views.delete_line),
    path('add_line/', views.add_line),
    path('get_point/', views.get_point),
    path('delete_point/', views.delete_point),
    path('add_point/', views.add_point),
    path('get_video/', views.get_video),
    path('delete_video/', views.delete_video),
    path('add_video/', views.add_video),
    path('get_video_stream/<str:path>/', views.get_video_stream),
    path('get_defect_grade/', views.get_defect_grade),
    path('get_defect/', views.get_defect),
    path('delete_defect/', views.delete_defect),
    path('add_defect/', views.add_defect),
    path('get_report/<int:project_id>', views.get_report),
]

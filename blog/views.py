from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.core import serializers
from django.shortcuts import render
from . import models
import json

# Create your views here.

@require_http_methods(['GET'])
def add_student(request):
    res={}
    try:
        stu=models.Student(name=request.GET.get('name'))
        stu.save()
        res['msg']='success'
        res['error_num']=0
    except Exception as e:
        res['msg']=str(e)
        res['error_num']=1
    return JsonResponse(res)

@require_http_methods(['GET'])
def show_students(request):
    res={}
    try:
        stus=models.Student.objects.filter()
        res['list']=json.loads(serializers.serialize('json',stus))
        res['msg']='success'
        res['error_num']=0
    except Exception as e:
        res['msg']=str(e)
        res['error_num']=1
    return JsonResponse(res)
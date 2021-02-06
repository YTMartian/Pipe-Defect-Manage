from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core import serializers
from . import models
import datetime
import json


@csrf_exempt
@require_http_methods(['POST'])
def add_project(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        if data['isEdit']:  # 如果是编辑，就先删除原先的再重新插入
            models.Project.objects.filter(project_id=data['project_id']).delete()
        models.Project.objects.create(**data['values'])
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def get_project(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        projects = None
        if data['condition'] == 'all':
            projects = models.Project.objects.all().order_by('start_date')
        elif data['condition'] == 'project_id':
            projects = models.Project.objects.filter(project_id=data['project_id'])
        res['list'] = json.loads(serializers.serialize('json', projects))
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def delete_project(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        for project_id in data['project_ids']:
            models.Project.objects.filter(project_id=project_id).delete()
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)

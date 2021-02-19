from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from . import models
import json


@csrf_exempt
@require_http_methods(['POST'])
def add_project(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        if data['isEdit']:
            models.Project.objects.filter(project_id=data['project_id']).update(**data['values'])
        else:
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
            projects = models.Project.objects.all()
            projects = reversed(projects)
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


@csrf_exempt
@require_http_methods(['POST'])
def get_line(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        lines = None
        if data['condition'] == 'all':
            lines = models.Line.objects.filter(project_id=data['project_id'])
            lines = reversed(lines)
        elif data['condition'] == 'line_id':
            lines = models.Line.objects.filter(line_id=data['line_id'])
        res['list'] = json.loads(serializers.serialize('json', lines))
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def delete_line(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        for line_id in data['line_ids']:
            models.Line.objects.filter(line_id=line_id).delete()
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def add_line(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        if data['isEdit']:
            models.Line.objects.filter(line_id=data['line_id']).update(**data['values'])
        else:
            # 插入带外键数据，先要获取外键对象
            data['values']['project_id'] = models.Project.objects.get(project_id=data['project_id'])
            data['values']['regional_importance_id'] = models.Regional.objects.get(
                regional_id=data['values']['regional_importance_id'])
            data['values']['soil_id'] = models.Soil.objects.get(soil_id=data['values']['soil_id'])
            models.Line.objects.create(**data['values'])
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def get_point(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        points = None
        if data['condition'] == 'all':
            points = models.Point.objects.filter(line_id=data['line_id'])
            points = reversed(points)
        elif data['condition'] == 'point_id':
            points = models.Point.objects.filter(point_id=data['point_id'])
        res['list'] = json.loads(serializers.serialize('json', points))
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def delete_point(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        for point_id in data['point_ids']:
            models.Point.objects.filter(point_id=point_id).delete()
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def add_point(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        if data['isEdit']:
            models.Point.objects.filter(point_id=data['point_id']).update(**data['values'])
        else:
            # 插入带外键数据，先要获取外键对象
            data['values']['line_id'] = models.Line.objects.get(line_id=data['line_id'])
            models.Point.objects.create(**data['values'])
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def get_video(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        videos = None
        if data['condition'] == 'all':
            videos = models.Video.objects.filter(project_id=data['project_id'])
            videos = reversed(videos)
        elif data['condition'] == 'video_id':
            videos = models.Video.objects.filter(video_id=data['video_id'])
        res['list'] = json.loads(serializers.serialize('json', videos))
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def delete_video(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        for video_id in data['video_ids']:
            models.Video.objects.filter(video_id=video_id).delete()
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def add_video(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        if data['isEdit']:
            models.Video.objects.filter(video_id=data['video_id']).update(**data['values'])
        else:
            # 插入带外键数据，先要获取外键对象
            data['values']['project_id'] = models.Project.objects.get(project_id=data['project_id'])
            data['values']['line_id'] = models.Line.objects.get(line_id=data['values']['line_id'])
            models.Video.objects.create(**data['values'])
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['GET'])
def get_video_stream(request, path):
    try:
        # path = r'F:\Graduation-Project\排水管道系统\PipeSight\Videos\a4gptz2rl45.mp4'
        # path = r'F:\ice_video_20210122-140208.mp4'
        # path = r'F:\1.mp4'
        # path = r'F:\gaofengkuaiban.webm'

        data = open(path, 'rb')
        response = FileResponse(data, content_type='video/mp4')
        # headers添加几个内容，否则无法拖动视频滚动条
        response['Content-Transfer-Encoding'] = 'binary'
        response['Accept-Ranges'] = 'bytes'
        response['Content-Range'] = ''
        return response
    except Exception as e:
        print(e)
        raise Http404


@csrf_exempt
@require_http_methods(['POST'])
def get_defect_grade(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        defect_grades = models.DefectGrade.objects.filter(defect_type_id=data['defect_type_id'])
        res['list'] = json.loads(serializers.serialize('json', defect_grades))
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def get_defect(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        defects = None
        if data['condition'] == 'all':
            defects = models.Defect.objects.filter(video_id=data['video_id'])
            defects = reversed(defects)
        elif data['condition'] == 'defect_id':
            defects = models.Defect.objects.filter(defect_id=data['defect_id'])
        res['list'] = json.loads(serializers.serialize('json', defects))
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def delete_defect(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        for defect_id in data['defect_ids']:
            models.Defect.objects.filter(defect_id=defect_id).delete()
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def add_defect(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        if data['isEdit']:
            models.Defect.objects.filter(defect_id=data['defect_id']).update(**data['values'])
        else:
            # 插入带外键数据，先要获取外键对象
            data['values']['video_id'] = models.Video.objects.get(project_id=data['video_id'])
            data['values']['defect_type_id'] = models.DefectType.objects.get(
                defect_type_id=data['values']['defect_type_id'])
            data['values']['defect_grade_id'] = models.DefectGrade.objects.get(
                defect_grade_id=data['values']['defect_grade_id'])
            models.Defect.objects.create(**data['values'])
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)

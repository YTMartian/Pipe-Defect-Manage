from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from docxtpl import DocxTemplate, InlineImage
from matplotlib import font_manager as fm
from django.core import serializers
import matplotlib.pyplot as plt
from docx.shared import Mm
from matplotlib import cm
from . import models
import numpy as np
import matplotlib
import datetime
import shutil
import json
import time
import os
import cv2

'''
auto update content table:https://blog.csdn.net/weixin_42670653/article/details/81476147
'''

font = {
    'family': 'SimHei',
    'weight': 'bold',
    'size': 12
}
matplotlib.rc("font", **font)


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
            # defects = reversed(defects)
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
            data['values']['video_id'] = models.Video.objects.get(video_id=data['values']['video_id'])
            data['values']['defect_type_id'] = models.DefectType.objects.get(
                defect_type_id=data['values']['defect_type_id'])
            data['values']['defect_grade_id'] = models.DefectGrade.objects.get(
                defect_grade_id=data['values']['defect_grade_id'])
            a = models.Defect.objects.create(**data['values'])
            res['pk'] = a.pk
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['GET'])
def get_report(request, project_id):
    res = {}
    try:
        file_name = generate_report(project_id)
        time.sleep(2)
        data = open('final.docx', 'rb')
        response = FileResponse(data,
                                content_type='application/msword')
        response['Content-Disposition'] = f'attachment; filename={file_name}.docx'
        return response
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


# 如果defect_type_id在[1,2,4,6,7,10,11,13,14,15]中,则为结构性缺陷.
structure_defect_types = ['AJ', 'BX', 'CK', 'CR', 'FS', 'PL', 'QF', 'SL', 'TJ', 'TL']
function_defect_types = ['CJ', 'CQ', 'FZ', 'JG', 'SG', 'ZW']
structure_defect_names = ['支管暗接', '变形', '错口', '异物穿入', '腐蚀', '破裂', '起伏', '渗漏', '脱节', '接口材料脱落']
function_defect_names = ['沉积', '残墙、坝根', '浮渣', '结垢', '树根', '障碍物']
colors = ['00B0F0', 'FFFF00', 'FFC000', 'FF0000']
grade = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ']
images_path = 'misc/images/'  # 图片保存路径
doc = None


# 表5-1
def get_pipe_defect_summary(project_id):
    res = {'pipe_with_defect_amount': 0,
           'pipe_with_structure_defect_amount': 0,
           'pipe_with_function_defect_amount': 0,
           'pipe_with_both_defect_amount': 0,
           'pipe_without_defect_amount': 0,
           'pipe_defects': [],
           'defects_count': {}
           }
    number = 1
    for i in structure_defect_types + function_defect_types:
        for j in range(1, 5):
            res['defects_count'][i + str(j)] = 0
            res['defects_count']['grade' + str(j)] = 0
        res['defects_count'][i + 'total'] = 0
    res['defects_count']['grade_total'] = 0
    lines = models.Line.objects.filter(project_id=project_id)
    for line in lines:
        temp = {'number': number}
        number += 1
        temp['pipe_no'] = f'{line.start_number}~{line.end_number}'
        temp['diameter'] = line.diameter
        temp['pipe_material'] = line.material
        temp['pipe_length'] = line.total_length
        temp['structure_defects'] = []
        temp['function_defects'] = []
        videos = models.Video.objects.filter(line_id=line.line_id)
        defects = [models.Defect.objects.filter(video_id=video.video_id) for video in videos]
        defects = [i for j in defects for i in j]  # 二维数组转一维
        flag = True
        with_structure_flag = False
        with_function_flag = False
        for defect in defects:
            t = {'defect_distance': defect.defect_distance,
                 'defect_grade': defect.defect_grade_id.defect_grade_name[0],
                 'defect_type': defect.defect_type_id.defect_type_name[3:-1],
                 'defect_length': defect.defect_length
                 }
            defect_type_code = defect.defect_type_id.defect_type_name[0:2]
            res['defects_count'][defect_type_code + str(t['defect_grade'])] += 1
            res['defects_count'][defect_type_code + 'total'] += 1
            res['defects_count']['grade' + str(t['defect_grade'])] += 1
            res['defects_count']['grade_total'] += 1
            if defect_type_code in structure_defect_types:
                temp['structure_defects'].append(t.copy())
                if flag:
                    res['pipe_with_defect_amount'] += 1
                if not with_structure_flag:
                    res['pipe_with_structure_defect_amount'] += 1
                with_structure_flag = True
            else:
                temp['function_defects'].append(t.copy())
                if flag:
                    res['pipe_with_defect_amount'] += 1
                if not with_function_flag:
                    res['pipe_with_function_defect_amount'] += 1
                with_function_flag = True
            flag = False
        if with_structure_flag and with_function_flag:
            res['pipe_with_both_defect_amount'] += 1
        elif flag:
            res['pipe_without_defect_amount'] += 1
        res['pipe_defects'].append(temp.copy())
    return res


# 附件二、管段状况评估表
def get_pipes(project_id):
    global colors
    global grade
    res = []
    lines = models.Line.objects.filter(project_id=project_id)
    for line in lines:
        data = {
            'pipe_no': f'{line.start_number}~{line.end_number}',
            'pipe_diameter': line.diameter,
            'pipe_length': line.total_length,
            'pipe_material': line.material,
            'detection_length': line.detection_length,
            'structure_average_score': 0,
            'function_average_score': 0,
            'structure_F': 0,
            'function_G': 0,
            'structure_SM': 0,
            'function_YM': 0,
            'structure_RI': 0,
            'function_MI': 0,
        }
        K = line.regional_importance_id.regional_value
        E = data['pipe_diameter']
        if E > 1500:
            E = 10
        elif E > 1000:
            E = 6
        elif E > 600:
            E = 3
        else:
            E = 0
        T = line.soil_id.soil_value
        alpha = 1.1
        structure_n1, structure_n2 = 0, 0
        function_n1, function_n2 = 0, 0
        data['structure_max_score'] = 0
        data['function_max_score'] = 0
        data['structure_evaluation'] = ''
        data['function_evaluation'] = ''
        videos = models.Video.objects.filter(line_id=line.line_id)
        defects = [models.Defect.objects.filter(video_id=video.video_id) for video in videos]
        defects = [i for j in defects for i in j]  # 二维数组转一维
        for defect in defects:
            if defect.defect_type_id.defect_type_name[:2] in structure_defect_types:
                if float(defect.defect_distance) > 1.5:
                    data['structure_average_score'] += float(defect.defect_grade_id.score)
                    data['structure_SM'] += float(defect.defect_grade_id.score) * float(defect.defect_length)
                    structure_n1 += 1
                elif float(defect.defect_distance) > 1.0:
                    data['structure_average_score'] += alpha * float(defect.defect_grade_id.score)
                    data['structure_SM'] += alpha * float(defect.defect_grade_id.score) * float(defect.defect_length)
                    structure_n2 += 1
                data['structure_max_score'] = max(data['structure_max_score'], float(defect.defect_grade_id.score))
            elif defect.defect_type_id.defect_type_name[:2] in function_defect_types:
                if float(defect.defect_distance) > 1.5:
                    data['function_average_score'] += float(defect.defect_grade_id.score)
                    data['function_YM'] += float(defect.defect_grade_id.score) * float(defect.defect_length)
                    function_n1 += 1
                elif float(defect.defect_distance) > 1.0:
                    data['function_average_score'] += alpha * float(defect.defect_grade_id.score)
                    data['function_YM'] += alpha * float(defect.defect_grade_id.score) * float(defect.defect_length)
                    function_n2 += 1
                data['function_max_score'] = max(data['function_max_score'], float(defect.defect_grade_id.score))

        data['structure_F'] = max(data['structure_average_score'], data['structure_max_score'])
        data['function_G'] = max(data['function_average_score'], data['function_max_score'])

        data['structure_RI'] = 0.7 * data['structure_F'] + 0.1 * K + 0.05 * E + 0.15 * T
        data['function_MI'] = 0.8 * data['function_G'] + 0.15 * K + 0.05 * E

        if data['structure_average_score'] * float(data['pipe_length']) != 0.0:
            data['structure_SM'] /= data['structure_average_score'] * float(data['pipe_length'])
        if data['function_average_score'] * float(data['pipe_length']) != 0.0:
            data['function_YM'] /= data['function_average_score'] * float(data['pipe_length'])

        if structure_n1 + structure_n2 > 0:
            data['structure_average_score'] /= structure_n1 + structure_n2
        if function_n1 + function_n2 > 0:
            data['function_average_score'] /= function_n1 + function_n2

        if data['structure_SM'] < 0.1:
            data['structure_evaluation'] += '(局部缺陷)'
        elif data['structure_SM'] < 0.5:
            data['structure_evaluation'] += '(部分或整体缺陷)'
        else:
            data['structure_evaluation'] += '(整体缺陷)'
        if data['function_YM'] < 0.1:
            data['function_evaluation'] += '(局部缺陷)'
        elif data['function_YM'] < 0.5:
            data['function_evaluation'] += '(部分或整体缺陷)'
        else:
            data['function_evaluation'] += '(整体缺陷)'

        if data['structure_F'] <= 1:
            data['structure_defect_grade'] = 'Ⅰ'
            data['structure_evaluation'] += '无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能。'
        elif data['structure_F'] <= 3:
            data['structure_defect_grade'] = 'Ⅱ'
            data['structure_evaluation'] += '管段缺陷明显超过一级，具有变坏的趋势。'
        elif data['structure_F'] <= 6:
            data['structure_defect_grade'] = 'Ⅲ'
            data['structure_evaluation'] += '管段缺陷严重，结构状况受到影响。'
        else:
            data['structure_defect_grade'] = 'Ⅳ'
            data['structure_evaluation'] += '管段存在重大缺陷，损坏严重或即将导致破坏。'
        if data['function_G'] <= 1:
            data['function_defect_grade'] = 'Ⅰ'
            data['function_evaluation'] += '无或有轻微影响，管道运行基本不受影响。'
        elif data['function_G'] <= 3:
            data['function_defect_grade'] = 'Ⅱ'
            data['function_evaluation'] += '管道过流有一定的受阻，运行受影响不大。'
        elif data['function_G'] <= 6:
            data['function_defect_grade'] = 'Ⅲ'
            data['function_evaluation'] += '管道过流受阻比较严重，运行受到明显影响。'
        else:
            data['function_defect_grade'] = 'Ⅳ'
            data['function_evaluation'] += '管道过流受阻很严重，即将或已经导致运行瘫痪。'
        if data['structure_RI'] <= 1:
            data['structure_evaluation'] += '结构条件基本完好，不修复。'
        elif data['structure_RI'] <= 4:
            data['structure_evaluation'] += '结构在短期内不会发生破坏现象，但应做修复计划 。'
        elif data['structure_RI'] <= 7:
            data['structure_evaluation'] += '结构在短期内可能会发生破坏，应尽快修复。'
        else:
            data['structure_evaluation'] += '结构已经发生或即将发生破坏，应立即修复。'
        if data['function_MI'] <= 1:
            data['function_evaluation'] += '没有明显需要处理的缺陷。'
        elif data['function_MI'] <= 4:
            data['function_evaluation'] += '没有立即进行处理的必要，但宜安排处理计划。'
        elif data['function_MI'] <= 7:
            data['function_evaluation'] += '根据基础数据进行全面的考虑，应尽快处理。'
        else:
            data['function_evaluation'] += '输水功能受到严重影响，应立即进行处理。'

        data['structure_RI'] = '%.2f' % data['structure_RI']
        data['function_MI'] = '%.2f' % data['function_MI']
        data['structure_SM'] = '%.2f' % data['structure_SM']
        data['function_YM'] = '%.2f' % data['function_YM']
        data['structure_average_score'] = '%.2f' % data['structure_average_score']
        data['function_average_score'] = '%.2f' % data['function_average_score']

        # 设置颜色
        if data['structure_defect_grade'] in grade:
            structure_color_index = grade.index(data['structure_defect_grade'])
            data['structure_evaluation_color'] = colors[structure_color_index]
        else:
            data['structure_evaluation_color'] = 'FFFFFF'
        if data['function_defect_grade'] in grade:
            function_color_index = grade.index(data['function_defect_grade'])
            data['function_evaluation_color'] = colors[function_color_index]
        else:
            data['function_evaluation_color'] = 'FFFFFF'

        res.append(data.copy())
    return res


# 附件三、 管道检测成果表
def get_videos(project_id):
    global doc
    global images_path
    if os.path.exists(images_path):  # 递归删除原图片
        shutil.rmtree(images_path, True)
    # 等待一会确保删除完成
    time.sleep(1)
    os.mkdir(images_path)
    res = []
    videos = models.Video.objects.filter(project_id=project_id)
    data = {}
    for i in range(len(videos)):
        video = videos[i]
        data['video_file_name'] = video.name
        data['start_manhole_no'] = video.line_id.start_number
        data['end_manhole_no'] = video.line_id.end_number
        data['construction_year'] = video.line_id.burial_year
        data['start_pipe_depth'] = video.line_id.start_depth
        data['end_pipe_depth'] = video.line_id.end_depth
        data['pipe_type'] = video.line_id.type
        data['pipe_material'] = video.line_id.material
        data['pipe_diameter'] = video.line_id.diameter
        data['detection_direction'] = '顺流' if video.line_id.flow_direction == 0 else '逆流'
        data['pipe_length'] = video.line_id.total_length
        data['detection_length'] = video.line_id.detection_length
        data['staff_name'] = video.project_id.staff
        data['road_name'] = video.line_id.road_where
        data['record_date'] = video.record_date
        data['video_remark'] = video.remark
        data['defects'] = []
        defects = models.Defect.objects.filter(video_id=video.video_id)
        number = 0
        cap = cv2.VideoCapture()
        cap.open(video.path)
        for defect in defects:
            number += 1
            temp = {
                'defect_distance': defect.defect_distance,
                'defect_type': defect.defect_type_id.defect_type_name,
                'score': defect.defect_grade_id.score,
                'grade': defect.defect_grade_id.defect_grade_name[:2],
                'defect_attribute': defect.defect_attribute,
                'number': number
            }
            data['defects'].append(temp.copy())
            time_in_video = defect.time_in_video
            # hh:mm:ss转为帧位置
            fps = int(cap.get(cv2.CAP_PROP_FPS))
            hour = int(time_in_video[:2])
            minute = int(time_in_video[3:5])
            second = int(time_in_video[6:])
            seconds = hour * 3600 + minute * 60 + second
            frame = seconds * fps
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame)
            flag, img = cap.read()
            if not flag:
                print('save image {}.jpg failed.'.format(video.name + '-' + seconds))
                continue
            cv2.imwrite(f'{images_path}{video.name}-{seconds}.jpg', img)
        cap.release()
        res.append(data.copy())
    time.sleep(1)
    for i in range(len(videos)):
        video = videos[i]
        res[i]['images'] = []
        temp = {}
        defects = models.Defect.objects.filter(video_id=video.video_id)
        for j in range(0, len(defects), 2):
            time_in_video = defects[j].time_in_video
            hour = int(time_in_video[:2])
            minute = int(time_in_video[3:5])
            second = int(time_in_video[6:])
            seconds = str(hour * 3600 + minute * 60 + second)
            temp['left_number'] = f'照片{j + 1}'
            temp['left_image'] = video.name + '-' + seconds + '.jpg'
            # 向word中添加图像.
            # https://docxtpl.readthedocs.io/en/latest/
            temp['left_image'] = InlineImage(doc, images_path + temp['left_image'], height=Mm(60))
            if j + 1 < len(defects):
                time_in_video = defects[j + 1].time_in_video
                hour = int(time_in_video[:2])
                minute = int(time_in_video[3:5])
                second = int(time_in_video[6:])
                seconds = str(hour * 3600 + minute * 60 + second)
                temp['right_number'] = f'照片{j + 2}'
                temp['right_image'] = video.name + '-' + seconds + '.jpg'
                temp['right_image'] = InlineImage(doc, images_path + temp['right_image'], height=Mm(60))
            else:
                temp['right_image'] = ''
                temp['right_number'] = ''
            res[i]['images'].append(temp.copy())
        # 生成并保存报告，返回报告名
    return res


# 生成缺陷类型统计图
def get_statistic(pipe_defect_summary):
    global doc
    global images_path
    structure_defect_count = [pipe_defect_summary['defects_count']['AJtotal'],
                              pipe_defect_summary['defects_count']['BXtotal'],
                              pipe_defect_summary['defects_count']['CKtotal'],
                              pipe_defect_summary['defects_count']['CRtotal'],
                              pipe_defect_summary['defects_count']['FStotal'],
                              pipe_defect_summary['defects_count']['PLtotal'],
                              pipe_defect_summary['defects_count']['QFtotal'],
                              pipe_defect_summary['defects_count']['SLtotal'],
                              pipe_defect_summary['defects_count']['TJtotal'],
                              pipe_defect_summary['defects_count']['TLtotal']]
    labels = []
    sizes = []
    total = sum(structure_defect_count)
    for i in range(len(structure_defect_names)):
        if structure_defect_count[i] == 0:
            continue
        labels.append(structure_defect_names[i])
        sizes.append(structure_defect_count[i] / total)
    fig, axes = plt.subplots(figsize=(10, 7), ncols=2)  # 1000x500
    ax1, ax2 = axes.ravel()
    colors = cm.rainbow(np.arange(len(sizes)) / len(sizes))  # colormaps: Paired, autumn, rainbow, gray,spring,Darks
    patches, texts, autotexts = ax1.pie(sizes, labels=labels, autopct='%1.0f%%',
                                        shadow=False, startangle=170, colors=colors)
    ax1.axis('equal')
    proptease = fm.FontProperties()
    proptease.set_size('medium')
    # font size include: ‘xx-small’,x-small’,'small’,'medium’,‘large’,‘x-large’,‘xx-large’ or number, e.g. '12'
    plt.setp(autotexts, fontproperties=proptease)
    plt.setp(texts, fontproperties=proptease)

    ax2.axis('off')
    ax2.legend(patches, labels, loc='center')

    plt.tight_layout()
    plt.savefig(images_path + 'structure_defect_summary_statistic.png')

    def get_structure_grade_total(i):
        i = str(i)
        return sum(
            [pipe_defect_summary['defects_count']['AJ' + i],
             pipe_defect_summary['defects_count']['BX' + i],
             pipe_defect_summary['defects_count']['CK' + i],
             pipe_defect_summary['defects_count']['CR' + i],
             pipe_defect_summary['defects_count']['FS' + i],
             pipe_defect_summary['defects_count']['PL' + i],
             pipe_defect_summary['defects_count']['QF' + i],
             pipe_defect_summary['defects_count']['SL' + i],
             pipe_defect_summary['defects_count']['TJ' + i],
             pipe_defect_summary['defects_count']['TL' + i]])

    pipe_defect_summary['defects_count']['structure_grade1_total'] = get_structure_grade_total(1)
    pipe_defect_summary['defects_count']['structure_grade2_total'] = get_structure_grade_total(2)
    pipe_defect_summary['defects_count']['structure_grade3_total'] = get_structure_grade_total(3)
    pipe_defect_summary['defects_count']['structure_grade4_total'] = get_structure_grade_total(4)
    pipe_defect_summary['defects_count']['structure_grade_total'] = sum(
        [pipe_defect_summary['defects_count']['structure_grade{}_total'.format(i)] for i in range(1, 5)])
    function_defect_count = [pipe_defect_summary['defects_count']['CJtotal'],
                             pipe_defect_summary['defects_count']['CQtotal'],
                             pipe_defect_summary['defects_count']['FZtotal'],
                             pipe_defect_summary['defects_count']['JGtotal'],
                             pipe_defect_summary['defects_count']['SGtotal'],
                             pipe_defect_summary['defects_count']['ZWtotal']]
    labels.clear()
    sizes.clear()
    total = sum(function_defect_count)
    for i in range(len(function_defect_names)):
        if function_defect_count[i] == 0:
            continue
        labels.append(function_defect_names[i])
        sizes.append(function_defect_count[i] / total)
    fig, axes = plt.subplots(figsize=(10, 7), ncols=2)  # 1000x500
    ax1, ax2 = axes.ravel()
    colors = cm.rainbow(np.arange(len(sizes)) / len(sizes))  # colormaps: Paired, autumn, rainbow, gray,spring,Darks
    patches, texts, autotexts = ax1.pie(sizes, labels=labels, autopct='%1.0f%%',
                                        shadow=False, startangle=170, colors=colors)
    ax1.axis('equal')
    proptease = fm.FontProperties()
    proptease.set_size('medium')
    # font size include: ‘xx-small’,x-small’,'small’,'medium’,‘large’,‘x-large’,‘xx-large’ or number, e.g. '12'
    plt.setp(autotexts, fontproperties=proptease)
    plt.setp(texts, fontproperties=proptease)

    ax2.axis('off')
    ax2.legend(patches, labels, loc='center')

    plt.tight_layout()
    plt.savefig(images_path + 'function_defect_summary_statistic.png')

    def get_function_grade_total(i):
        i = str(i)
        return sum(
            [pipe_defect_summary['defects_count']['CJ' + i],
             pipe_defect_summary['defects_count']['CQ' + i],
             pipe_defect_summary['defects_count']['FZ' + i],
             pipe_defect_summary['defects_count']['JG' + i],
             pipe_defect_summary['defects_count']['SG' + i],
             pipe_defect_summary['defects_count']['ZW' + i],
             pipe_defect_summary['defects_count']['QF' + i],
             pipe_defect_summary['defects_count']['SL' + i],
             pipe_defect_summary['defects_count']['TJ' + i],
             pipe_defect_summary['defects_count']['TL' + i]])

    pipe_defect_summary['defects_count']['function_grade1_total'] = get_function_grade_total(1)
    pipe_defect_summary['defects_count']['function_grade2_total'] = get_function_grade_total(2)
    pipe_defect_summary['defects_count']['function_grade3_total'] = get_function_grade_total(3)
    pipe_defect_summary['defects_count']['function_grade4_total'] = get_function_grade_total(4)
    pipe_defect_summary['defects_count']['function_grade_total'] = sum(
        [pipe_defect_summary['defects_count']['function_grade{}_total'.format(i)] for i in range(1, 5)])

    structure_defect_summary_statistic = InlineImage(doc, images_path + 'structure_defect_summary_statistic.png',
                                                     height=Mm(120))
    function_defect_summary_statistic = InlineImage(doc, images_path + 'function_defect_summary_statistic.png',
                                                    height=Mm(120))
    return [structure_defect_summary_statistic, function_defect_summary_statistic]


# 管道缺陷汇总表
def get_all_defects(project_id):
    global colors
    all_structure_defects = []
    all_function_defects = []
    lines = models.Line.objects.filter(project_id=project_id)
    for line in lines:
        temp = {'pipe_number': f'{line.start_number}~{line.end_number}',
                'pipe_diameter': line.diameter,
                'pipe_material': line.material,
                'detection_length': line.detection_length
                }
        videos = models.Video.objects.filter(line_id=line.line_id)
        defects = [models.Defect.objects.filter(video_id=video.video_id) for video in videos]
        defects = [i for j in defects for i in j]  # 二维数组转一维
        for defect in defects:
            temp['defect_distance'] = defect.defect_distance
            temp['defect_type'] = defect.defect_type_id.defect_type_name[3:-1]
            temp['defect_grade'] = defect.defect_grade_id.defect_grade_name[:2]
            # 确定单元格颜色
            list1 = [1 if str(i) in temp['defect_grade'] else 0 for i in range(1, 5)]
            color_index = list1.index(1)
            temp['color'] = colors[color_index]
            if temp['defect_type'] in structure_defect_names:
                temp['number'] = len(all_structure_defects) + 1
                all_structure_defects.append(temp.copy())
            elif temp['defect_type'] in function_defect_names:
                temp['number'] = len(all_function_defects) + 1
                all_function_defects.append(temp.copy())
            else:
                print('Error 1')
    return [all_structure_defects, all_function_defects]


# 检测结论一览表 和 缺陷管段情况汇总表
def get_summary(pipes):
    summary = {'structure_0_count': 0, 'structure_1_count': 0,
               'structure_2_count': 0, 'structure_3_count': 0,
               'structure_4_count': 0,
               'function_0_count': 0, 'function_1_count': 0,
               'function_2_count': 0, 'function_3_count': 0,
               'function_4_count': 0,
               'structure_0_percent': '0.00%', 'structure_1_percent': '0.00%',
               'structure_2_percent': '0.00%', 'structure_3_percent': '0.00%',
               'structure_4_percent': '0.00%',
               'function_0_percent': '0.00%', 'function_1_percent': '0.00%',
               'function_2_percent': '0.00%', 'function_3_percent': '0.00%',
               'function_4_percent': '0.00%',
               }
    for pipe in pipes:
        if pipe['structure_defect_grade'] in grade:
            grade_index = grade.index(pipe['structure_defect_grade'])
            summary['structure_{}_count'.format(grade_index + 1)] += 1
        if pipe['function_defect_grade'] in grade:
            grade_index = grade.index(pipe['function_defect_grade'])
            summary['function_{}_count'.format(grade_index + 1)] += 1
    for i in range(5):
        summary['structure_{}_percent'.format(i)] = '{:.2f}%'.format(
            100 * summary['structure_{}_count'.format(i)] / len(pipes))
        summary['function_{}_percent'.format(i)] = '{:.2f}%'.format(
            100 * summary['function_{}_count'.format(i)] / len(pipes))
    # 缺陷管段情况汇总表
    summary['structure_defect_count'] = sum([summary['structure_{}_count'.format(i)] for i in range(1, 5)])
    summary['function_defect_count'] = sum([summary['function_{}_count'.format(i)] for i in range(1, 5)])
    summary['structure_defect_percent'] = '{:.2f}%'.format(100 * summary['structure_defect_count'] / len(pipes))
    summary['function_defect_percent'] = '{:.2f}%'.format(100 * summary['function_defect_count'] / len(pipes))
    for i in range(1, 5):
        summary['structure_defect_{}_percent'.format(i)] = '{:.2f}%'.format(
            100 * summary['structure_{}_count'.format(i)] / summary['structure_defect_count'])
        summary['function_defect_{}_percent'.format(i)] = '{:.2f}%'.format(
            100 * summary['function_{}_count'.format(i)] / summary['function_defect_count'])
    return summary


def generate_report(project_id):
    global doc
    if os.path.exists('final.docx'):
        os.remove('final.docx')
    doc = DocxTemplate('template.docx')

    project = models.Project.objects.filter(project_id=project_id)[0]
    lines = models.Line.objects.filter(project_id=project_id)
    pipe_defect_summary = get_pipe_defect_summary(project_id)
    pipes = get_pipes(project_id)
    videos = get_videos(project_id)
    statistic = get_statistic(pipe_defect_summary)
    all_defects = get_all_defects(project_id)
    summary = get_summary(pipes)

    context = {
        'project_name': project.project_name,
        'project_no': project.project_no,
        'project_address': project.project_address,
        'requester_unit': project.requester_unit,
        'supervisory_unit': project.supervisory_unit,
        'construction_unit': project.construction_unit,
        'design_unit': project.design_unit,
        'build_unit': project.build_unit,
        'report_no': project.report_no,
        'staff_name': project.staff,
        'current_year': datetime.datetime.today().year,
        'current_month': datetime.datetime.today().month,
        'current_day': datetime.datetime.today().day,
        'start_record_date': project.start_date,
        'pipe_amount': len(lines),
        'pipe_total_length': sum([lines[i].total_length for i in range(len(lines))]),
        'pipe_total_detection_length': sum([lines[i].detection_length for i in range(len(lines))]),
        'detection_method': project.detection_method,
        'detection_equipment': project.detection_equipment,
        'move_method': project.move,
        'plugging_method': project.plugging,
        'drainage_method': project.drainage,
        'dredging_method': project.dredging,
        'pipe_defect_summary': pipe_defect_summary,
        'pipes': pipes,
        'videos': videos,
        'structure_defect_summary_statistic': statistic[0],
        'function_defect_summary_statistic': statistic[1],
        'all_structure_defects': all_defects[0],
        'all_function_defects': all_defects[1],
        'summary': summary
    }
    doc.render(context)
    doc.save('final.docx')
    return project.project_name

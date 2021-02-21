import {useHistory, useLocation} from 'react-router-dom'
import request from '../../../request'
import React, {useState, useRef} from "react"
import 'antd/dist/antd.css'
import moment from 'moment'
import './style.css'
import {
    Form,
    Input,
    Button,
    message,
    InputNumber,
    Select,
    Card,
    Affix,
    Row,
    Col,
    Popconfirm,
    Slider,
} from 'antd'

import {CaretLeftFilled, CaretRightFilled} from '@ant-design/icons';

const {Option} = Select;

message.config({
    top: 200
});

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 10,
            offset: 12,
        },
    },
};


const DefectDetection = () => {
        const history = useHistory();
        const location = useLocation();
        const [form] = Form.useForm();
        const [gradeOption, setGradeOption] = useState(undefined);
        //使用useRef，useState会数据更新不及时，其实普通变量也可以，因为render里并没有用到该值...
        const currentDefectIndex = useRef(-1);
        const [deleteDisable, setDeleteDisable] = useState(true);
        const allDefects = useRef([]);//useState会异步更新
        const [myVideo, setMyVideo] = useState(undefined);
        const videoRef = useRef(undefined);//video别名
        let isDragSlider = useRef(true);
        const [marks, setMarks] = useState({});

        const setCurrentDefect = () => {
            let index = currentDefectIndex.current;
            if (index === -1) {
                form.setFieldsValue({
                    time_in_video: '',
                    defect_type_id: '',
                    defect_grade_id: '',
                    defect_distance: '',
                    defect_length: '',
                    clock_start: '',
                    clock_end: '',
                    defect_date: '',
                    defect_attribute: '',
                    defect_remark: '',
                });
                setGradeOption([]);
            } else {
                form.setFieldsValue({
                    time_in_video: allDefects.current[index]['fields']['time_in_video'],
                    defect_type_id: allDefects.current[index]['fields']['defect_type_id'],
                    defect_distance: allDefects.current[index]['fields']['defect_distance'],
                    defect_length: allDefects.current[index]['fields']['defect_length'],
                    clock_start: allDefects.current[index]['fields']['clock_start'],
                    clock_end: allDefects.current[index]['fields']['clock_end'],
                    defect_date: allDefects.current[index]['fields']['defect_date'],
                    defect_attribute: allDefects.current[index]['fields']['defect_attribute'],
                    defect_remark: allDefects.current[index]['fields']['defect_remark'],
                });
                //填入缺陷级别
                onChangeDefectType({'defect_grade_id': allDefects.current[index]['fields']['defect_grade_id']});
            }
        };

        //点击进度条事件，判断附近是否有缺陷，有就在右侧面板展示
        const onSeeking = () => {
            if (!isDragSlider.current) {
                isDragSlider.current = true;
                return;
            }
            let currentSeconds = parseInt(videoRef.current.currentTime);
            let totalSeconds = parseInt(videoRef.current.duration);
            let interval = Math.ceil(totalSeconds / 100);//如果当前时间与缺陷时间间隔小于 总时长/100，则认为点到了该缺陷
            let flag = false;//附近是否存在缺陷
            for (let i = 0; i < allDefects.current.length; i++) {
                let seconds = timeToSeconds(allDefects.current[i]['fields']['time_in_video']);
                if (Math.abs(currentSeconds - seconds) <= interval) {
                    currentDefectIndex.current = i;
                    flag = true;
                    break;
                }
            }
            if (flag) setCurrentDefect();
        };

        const drawMarks = () => {
            //在下方进度条上标记缺陷位置
            let newMarks = {};
            let totalSeconds = parseInt(videoRef.current.duration);
            for (let i = 0; i < allDefects.current.length; i++) {
                let seconds = timeToSeconds(allDefects.current[i]['fields']['time_in_video']);
                let position = Math.floor(seconds / totalSeconds * 100);
                if (newMarks[position] === undefined) newMarks[position] = '';
            }
            setMarks(newMarks);
        };

        const getAllDefects = () => {
            request({
                method: 'post',
                url: 'get_defect/',
                data: {
                    "condition": "all",
                    "video_id": location.state.video_id,
                },
            }).then(function (response) {
                if (response.data.code === 0) {
                    //表单填入第一个缺陷
                    if (response.data.list.length > 0) {
                        if (currentDefectIndex.current === -1) currentDefectIndex.current = 0;
                        setDeleteDisable(false);
                        //按时间先后排序
                        allDefects.current = response.data.list.sort((a, b) => {
                            let t1 = timeToSeconds(a['fields']['time_in_video']);
                            let t2 = timeToSeconds(b['fields']['time_in_video']);
                            return t1 - t2;
                        });
                        setCurrentDefect();
                        drawMarks();
                    }
                } else {
                    message.error('获取缺陷失败1:' + response.data.msg, 3)
                }
            }).catch(function (error) {
                message.error('获取缺陷失败2:', error, 3);
            });
        };

        try {
            if (location.state.initialization) {
                location.state.initialization = false;
                request({
                    method: 'post',
                    url: 'get_video/',
                    data: {
                        "condition": "video_id",
                        "video_id": location.state.video_id,
                    },
                }).then(function (response) {
                    if (response.data.code === 0) {
                        form.setFieldsValue({
                            video_id: response.data.list[0]['fields']['name'],
                        });
                        //如此一来动态更改video的src
                        //先url编码处理路径，防止\等字符造成url错误
                        let path = request.defaults.baseURL + 'get_video_stream/' + encodeURI(response.data.list[0]['fields']['path']);
                        setMyVideo(<video
                            controls
                            ref={videoRef}
                            onSeeking={onSeeking}
                            className='video-style'
                            onCanPlayThrough={drawMarks}//视频加载完毕
                        >
                            <source src={path}/>
                        </video>);
                    }
                }).catch(function (error) {
                    message.error('获取视频失败' + error, 3);
                });
                getAllDefects();
            }
        } catch
            (e) {
            history.push('/ProjectManage/ProjectList')
        }

        const onChangeDefectType = (gradeFlag) => {
            let structure_defect_ids = [1, 2, 4, 6, 7, 10, 11, 13, 14, 15];
            if (structure_defect_ids.includes(form.getFieldValue('defect_type_id'))) {
                form.setFieldsValue({'defect_attribute': '结构性缺陷'});
            } else {
                form.setFieldsValue({'defect_attribute': '功能性缺陷'});
            }
            request({
                method: 'post',
                url: 'get_defect_grade/',
                data: {
                    "defect_type_id": form.getFieldValue('defect_type_id'),
                },
            }).then(function (response) {
                if (response.data.code === 0) {
                    let option = [];
                    for (let i = 0; i < response.data.list.length; i++) {
                        let id = response.data.list[i]['pk'];
                        let name = response.data.list[i]['fields']['defect_grade_name'];
                        option.push(<Option value={id}>{name}</Option>);
                    }
                    setGradeOption(option);
                    if (typeof gradeFlag === typeof {}) form.setFieldsValue({'defect_grade_id': gradeFlag['defect_grade_id']});
                    else form.setFieldsValue({'defect_grade_id': undefined})
                } else {
                    message.error('获取缺陷等级失败1:' + response.data.msg, 3)
                }
            }).catch(function (error) {
                message.error('获取缺陷等级失败2:' + error, 3);
            });
        };

        //限制只能输入整数
        const limitNumber = value => {
            if (typeof value === 'string') {
                return !isNaN(Number(value)) ? value.replace(/^(0+)|[^\d]/g, '') : ''
            } else if (typeof value === 'number') {
                return !isNaN(value) ? String(value).replace(/^(0+)|[^\d]/g, '') : ''
            } else {
                return ''
            }
        };

        const handleDelete = () => {
            request({
                method: 'post',
                url: 'delete_defect/',
                data: {
                    "defect_ids": [allDefects.current[currentDefectIndex.current]['pk']],
                },
            }).then(function (response) {
                if (response.data.code === 0) {
                    message.success('删除成功', 3);
                    allDefects.current = allDefects.current.filter((key, index) => {
                        return currentDefectIndex.current !== index;
                    });
                    //找到下一缺陷
                    if (allDefects.current.length === 0) {//没有缺陷则清空
                        currentDefectIndex.current = -1;
                    } else {
                        if (currentDefectIndex.current === allDefects.current.length) {
                            currentDefectIndex.current = allDefects.current.length - 1;
                        }
                    }
                    getAllDefects();
                } else {
                    message.error('删除失败： ' + response.data.msg, 3)
                }
            }).catch(function (error) {
                message.error('删除失败', error, 3);
            });
        };

        const onFinish = (values) => {
            values.video_id = location.state.video_id;
            let data = {
                "isEdit": true,
                "defect_id": allDefects.current[currentDefectIndex.current]['pk'],
                "values": values
            };
            request({
                method: 'post',
                url: 'add_defect/',
                data: data,
            }).then(function (response) {
                if (response.data.code === 0) {
                    message.success('修改成功', 3);
                    getAllDefects();
                } else {
                    message.error('修改失败： ' + response.data.msg, 3)
                }
            }).catch(function (error) {
                message.error(error);
            });
        };

        const previousDefect = () => {
            if (allDefects.current.length < 2) return;
            if (currentDefectIndex.current - 1 === -1) {
                currentDefectIndex.current = allDefects.current.length - 1;
            } else {
                currentDefectIndex.current = currentDefectIndex.current - 1;
            }
            setCurrentDefect();
            isDragSlider.current = false;//防止设置进度条时触发onSeeking
            videoRef.current.currentTime = timeToSeconds(allDefects.current[currentDefectIndex.current]['fields']['time_in_video']);
        };

        const nextDefect = () => {
            if (allDefects.current.length < 2) return;
            if (currentDefectIndex.current + 1 === allDefects.current.length) {
                currentDefectIndex.current = 0;
            } else {
                currentDefectIndex.current = currentDefectIndex.current + 1;
            }
            setCurrentDefect();
            isDragSlider.current = false;//防止设置进度条时触发onSeeking
            videoRef.current.currentTime = timeToSeconds(allDefects.current[currentDefectIndex.current]['fields']['time_in_video']);
        };

        const handleAdd = () => {
            let seconds = parseInt(videoRef.current.currentTime);
            let timeInVideo = new Date(seconds * 1000).toISOString().substr(11, 8);//seconds to hh:mm:ss
            for (let i = 0; i < allDefects.current.length; i++) {
                if (allDefects.current[i]['fields']['time_in_video'].includes(timeInVideo)) {
                    message.warn('此处已标记', 3);
                    return;
                }
            }
            videoRef.current.pause();
            let values = {
                "video_id": location.state.video_id,
                "defect_type_id": 1,//默认值
                "defect_grade_id": 1,
                "time_in_video": timeInVideo,
                "defect_date": moment().format("YYYY-MM-DD HH:mm:ss"),
                "defect_distance": 0,
                "defect_length": 0,
                "clock_start": 1,
                "clock_end": 1,
                "defect_attribute": "",
                "defect_remark": ""
            };
            let data = {"isEdit": false, "values": values};
            request({
                method: 'post',
                url: 'add_defect/',
                data: data,
            }).then(function (response) {
                if (response.data.code === 0) {
                    let pk = response.data.pk;
                    //找到该缺陷插入位置
                    let last = true;//是否是插到最后
                    let newDefects = [];
                    for (let i = 0; i < allDefects.current.length; i++) {
                        if (last && timeToSeconds(allDefects.current[i]['fields']['time_in_video']) > seconds) {
                            currentDefectIndex.current = i;
                            last = false;
                            newDefects.push({"pk": pk, "fields": values})
                        }
                        newDefects.push(allDefects.current[i])
                    }
                    if (last) {
                        currentDefectIndex.current = allDefects.current.length;
                        newDefects.push({"pk": pk, "fields": values});
                    }
                    allDefects.current = newDefects;
                    getAllDefects();
                    message.success('添加成功', 3);
                } else {
                    message.error('添加失败1' + response.data.msg, 3)
                }
            }).catch(function (error) {
                message.error('添加失败2' + error);
            });
        };

        //hh:mm:ss to seconds
        const timeToSeconds = (value) => {
            let hour = parseInt(value.substr(0, 2));
            let minute = parseInt(value.substr(3, 2));
            let second = parseInt(value.substr(6, 2));
            return hour * 60 * 60 + minute * 60 + second;
        };

        const onChangePlayback = (value) => {
            videoRef.current.playbackRate = value;
        };

        return (
            <Card style={{marginTop: "-5%"}}>
                <Affix offsetTop={120} style={{float: "left", width: "60%", height: "100%"}}>
                    <Row>
                        {myVideo}
                    </Row>
                    <Slider dots={false}
                            tooltipVisible={false}
                            marks={marks}
                            style={{width: "90%", marginTop: "1%", marginLeft: "0"}}
                            trackStyle={{
                                height: '6px',
                                borderRadius: '10px',
                                background: '#64b4ff'
                            }}
                            railStyle={{
                                height: '6px',
                                borderRadius: '6px',
                            }}
                            handleStyle={{
                                borderColor: "#00000000",//隐藏handle
                                width: '0',
                                height: '0',
                                top: '-100vh'
                            }}
                            value={100}
                    />
                    <Row gutter={30} style={{marginTop: "0"}}>
                        <Col>
                            <Select onChange={onChangePlayback} defaultValue={1} style={{width: 100}}
                                    getPopupContainer={triggerNode => triggerNode.parentElement} //展开框相对父元素固定，否则affix下会select不动展开框动
                            >
                                <Option value={0.5}>倍速x0.5</Option>
                                <Option value={1}>倍速x1.0</Option>
                                <Option value={2}>倍速x1.5</Option>
                                <Option value={2.5}>倍速x2.0</Option>
                                <Option value={3}>倍速x3.0</Option>
                            </Select>
                        </Col>
                    </Row>
                </Affix>
                <div style={{float: "right", width: "40%", height: "100%"}}>
                    <Affix offsetTop={100}>
                        <Card>
                            <Row gutter={30} justify="center">
                                <Col span={5}>
                                    <Button
                                        size="large"
                                        onClick={() => {
                                            history.push({
                                                pathname: '/ProjectManage/VideoList',
                                                state: {project_id: location.state.project_id, initialization: true}
                                            })
                                        }}
                                    >
                                        返回
                                    </Button>
                                </Col>
                                <Col span={3}>
                                    <Button size="large" icon={<CaretLeftFilled/>} onClick={previousDefect}/>
                                </Col>
                                <Col span={5}>
                                    <Button size="large" type="primary" onClick={handleAdd}>
                                        标记
                                    </Button>
                                </Col>
                                <Col span={5}>
                                    <Popconfirm title="确定删除?" onConfirm={handleDelete} disabled={deleteDisable}>
                                        <Button size="large" danger type="primary">
                                            删除
                                        </Button>
                                    </Popconfirm>
                                </Col>
                                <Col span={4}>
                                    <Button size="large" icon={<CaretRightFilled/>} onClick={nextDefect}/>
                                </Col>
                            </Row>
                        </Card>
                    </Affix>
                    <Card>
                        <Form
                            {...formItemLayout}
                            form={form}
                            scrollToFirstError
                            size='large'
                            onFinish={onFinish}
                        >
                            <Form.Item label="视频" name="video_id" rules={[{required: true, message: '不能为空'}]}>
                                <Input disabled={true}/>
                            </Form.Item>
                            <Form.Item label="视频内时间" name="time_in_video" rules={[{required: true, message: '不能为空'}]}>
                                <Input disabled={true}/>
                            </Form.Item>
                            <Form.Item label="缺陷类别" name="defect_type_id" rules={[{required: true, message: '不能为空'}]}>
                                <Select onChange={onChangeDefectType}>
                                    <Option value={1}>AJ（支管暗接）</Option>
                                    <Option value={2}>BX（变形）</Option>
                                    <Option value={3}>CJ（沉积）</Option>
                                    <Option value={4}>CK（错口）</Option>
                                    <Option value={5}>CQ（残墙、坝根）</Option>
                                    <Option value={6}>CR（异物穿入）</Option>
                                    <Option value={7}>FS（腐蚀）</Option>
                                    <Option value={8}>FZ（浮渣）</Option>
                                    <Option value={9}>JG（结垢）</Option>
                                    <Option value={10}>PL（破裂）</Option>
                                    <Option value={11}>QF（起伏）</Option>
                                    <Option value={12}>SG（树根）</Option>
                                    <Option value={13}>SL（渗漏）</Option>
                                    <Option value={14}>TJ（脱节）</Option>
                                    <Option value={15}>TL（接口材料脱落）</Option>
                                    <Option value={16}>ZW（障碍物）</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="缺陷级别" name="defect_grade_id" rules={[{required: true, message: '不能为空'}]}>
                                <Select>
                                    {gradeOption}
                                </Select>
                            </Form.Item>
                            <Form.Item label="缺陷距离" name="defect_distance">
                                <InputNumber min={0}/>
                            </Form.Item>
                            <Form.Item label="缺陷长度" name="defect_length">
                                <InputNumber min={0}/>
                            </Form.Item>
                            <Form.Item label="环向起点" name="clock_start">
                                <InputNumber min={1} max={12} parser={limitNumber}/>
                            </Form.Item>
                            <Form.Item label="环向终点" name="clock_end">
                                <InputNumber min={1} max={12} parser={limitNumber}/>
                            </Form.Item>
                            <Form.Item label="判读日期" name="defect_date">
                                <Input disabled={true}/>
                            </Form.Item>
                            <Form.Item label="缺陷性质" name="defect_attribute">
                                <Input disabled={true}/>
                            </Form.Item>
                            <Form.Item label="备注" name="defect_remark">
                                <Input.TextArea autoSize={{minRows: 1}}/>
                            </Form.Item>
                            <Form.Item  {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">
                                    确定
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </Card>
        )
    }
;

export default DefectDetection;

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
        const [currentDefectIndex, setCurrentDefectIndex] = useState(-1);
        const [deleteDisable, setDeleteDisable] = useState(true);
        const [allDefects, setAllDefects] = useState([]);
        const [myVideo, setMyVideo] = useState(undefined);
        const videoRef = useRef();//video别名

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
                        let index = currentDefectIndex;
                        if (currentDefectIndex === -1) {
                            setCurrentDefectIndex(0);
                            index = 0;
                        }
                        form.setFieldsValue({
                            time_in_video: response.data.list[index]['fields']['time_in_video'],
                            defect_type_id: response.data.list[index]['fields']['defect_type_id'],
                            defect_distance: response.data.list[index]['fields']['defect_distance'],
                            defect_length: response.data.list[index]['fields']['defect_length'],
                            clock_start: response.data.list[index]['fields']['clock_start'],
                            clock_end: response.data.list[index]['fields']['clock_end'],
                            defect_date: response.data.list[index]['fields']['defect_date'],
                            defect_attribute: response.data.list[index]['fields']['defect_attribute'],
                            defect_remark: response.data.list[index]['fields']['defect_remark'],
                        });
                        setDeleteDisable(false);
                        setAllDefects(response.data.list);
                        //填入缺陷级别
                        onChangeDefectType({'defect_grade_id': response.data.list[index]['fields']['defect_grade_id']});
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
                        let path = 'http://127.0.0.1:8000/blog/get_video_stream/' + encodeURI(response.data.list[0]['fields']['path']);
                        setMyVideo(<video
                            controls
                            ref={videoRef}
                            className='video-style'
                        >
                            <source
                                src={path}/>
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
                    "defect_ids": [allDefects[currentDefectIndex]['pk']],
                },
            }).then(function (response) {
                if (response.data.code === 0) {
                    message.success('删除成功', 3);
                    let newDefects = allDefects.filter((key, index) => {
                        return currentDefectIndex !== index;
                    });
                    //找到下一缺陷
                    if (newDefects.length === 0) {//没有缺陷则清空
                        setCurrentDefectIndex(-1);
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
                        //因为set是个异步的过程，可能还没改过来
                        let index = currentDefectIndex;
                        if (currentDefectIndex === allDefects.length - 1) {
                            setCurrentDefectIndex(newDefects.length - 1);
                            index = newDefects - 1;
                        }
                        form.setFieldsValue({
                            time_in_video: newDefects[index]['fields']['time_in_video'],
                            defect_type_id: newDefects[index]['fields']['defect_type_id'],
                            defect_distance: newDefects[index]['fields']['defect_distance'],
                            defect_length: newDefects[index]['fields']['defect_length'],
                            clock_start: newDefects[index]['fields']['clock_start'],
                            clock_end: newDefects[index]['fields']['clock_end'],
                            defect_date: newDefects[index]['fields']['defect_date'],
                            defect_attribute: newDefects[index]['fields']['defect_attribute'],
                            defect_remark: newDefects[index]['fields']['defect_remark'],
                        });
                        //填入缺陷级别
                        onChangeDefectType({'defect_grade_id': newDefects[index]['fields']['defect_grade_id']});
                    }
                    setAllDefects(newDefects);
                } else {
                    message.error('删除失败： ' + response.data.msg, 3)
                }
            }).catch(function (error) {
                message.error('删除失败', error, 3);
            });
        };

        const onFinish = (values) => {
            values.video_id = location.state.video_id;
            let data = {"isEdit": true, "defect_id": allDefects[currentDefectIndex]['pk'], "values": values};
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
            if (allDefects.length < 2) return;
            let index = currentDefectIndex - 1;
            if (currentDefectIndex - 1 === -1) {
                setCurrentDefectIndex(allDefects.length - 1);
                index = allDefects.length - 1;
            } else {
                setCurrentDefectIndex(currentDefectIndex - 1);
            }
            form.setFieldsValue({
                time_in_video: allDefects[index]['fields']['time_in_video'],
                defect_type_id: allDefects[index]['fields']['defect_type_id'],
                defect_distance: allDefects[index]['fields']['defect_distance'],
                defect_length: allDefects[index]['fields']['defect_length'],
                clock_start: allDefects[index]['fields']['clock_start'],
                clock_end: allDefects[index]['fields']['clock_end'],
                defect_date: allDefects[index]['fields']['defect_date'],
                defect_attribute: allDefects[index]['fields']['defect_attribute'],
                defect_remark: allDefects[index]['fields']['defect_remark'],
            });
            //填入缺陷级别
            onChangeDefectType({'defect_grade_id': allDefects[index]['fields']['defect_grade_id']});
        };

        const nextDefect = () => {
            if (allDefects.length < 2) return;
            let index = currentDefectIndex + 1;
            if (currentDefectIndex + 1 === allDefects.length) {
                setCurrentDefectIndex(0);
                index = 0;
            } else {
                setCurrentDefectIndex(currentDefectIndex + 1);
            }
            form.setFieldsValue({
                time_in_video: allDefects[index]['fields']['time_in_video'],
                defect_type_id: allDefects[index]['fields']['defect_type_id'],
                defect_distance: allDefects[index]['fields']['defect_distance'],
                defect_length: allDefects[index]['fields']['defect_length'],
                clock_start: allDefects[index]['fields']['clock_start'],
                clock_end: allDefects[index]['fields']['clock_end'],
                defect_date: allDefects[index]['fields']['defect_date'],
                defect_attribute: allDefects[index]['fields']['defect_attribute'],
                defect_remark: allDefects[index]['fields']['defect_remark'],
            });
            //填入缺陷级别
            onChangeDefectType({'defect_grade_id': allDefects[index]['fields']['defect_grade_id']});
        };

        const handleAdd = () => {

        };

        const onChangePlayback = (value) => {
            videoRef.current.playbackRate = value;
        };

        return (
            <Card style={{marginTop: "-5%"}}>
                <Affix offsetTop={150} style={{float: "left", width: "60%", height: "100%"}}>
                    <Row>
                        {myVideo}
                    </Row>
                    <Row gutter={30}>
                        <Col>
                            <Select onChange={onChangePlayback} defaultValue={1} style={{width: 100}}
                                    getPopupContainer={triggerNode => triggerNode.parentElement} //展开框相对父元素固定，否则affix下会select不动展开框动
                            >
                                <Option value={0.5}>0.5</Option>
                                <Option value={1}>1.0</Option>
                                <Option value={2}>1.5</Option>
                                <Option value={2.5}>2.0</Option>
                                <Option value={3}>3.0</Option>
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
                                <Input/>
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

import {useHistory, useLocation} from 'react-router-dom';
import request from '../../../request'
import 'antd/dist/antd.css'
import moment from 'moment'
import React from "react"
import {
    Form,
    Input,
    Button,
    message,
    DatePicker,
    Card,
    InputNumber,
    Select,
    Affix,
    Row,
    Col,
    Breadcrumb,
    Tooltip,
    Space
} from 'antd'
import {QuestionCircleOutlined} from "@ant-design/icons";

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
            span: 5,
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


const AddLine = () => {
    const history = useHistory();
    const location = useLocation();//获取前一页面history传递的参数
    const [form] = Form.useForm();//对表单数据域进行交互
    try {
        if (location.state.initialization) {
            location.state.initialization = false;
            if (location.state.isEdit) {
                request({
                    method: 'post',
                    url: 'get_line/',
                    data: {
                        "condition": "line_id",
                        "line_id": location.state.line_id
                    },
                }).then(function (response) {
                    if (response.data.code === 0) {
                        form.setFieldsValue({
                            start_number: response.data.list[0]['fields']['start_number'],
                            end_number: response.data.list[0]['fields']['end_number'],
                            start_height: response.data.list[0]['fields']['start_height'],
                            end_height: response.data.list[0]['fields']['end_height'],
                            start_depth: response.data.list[0]['fields']['start_depth'],
                            end_depth: response.data.list[0]['fields']['end_depth'],
                            start_x_coordinate: response.data.list[0]['fields']['start_x_coordinate'],
                            start_y_coordinate: response.data.list[0]['fields']['start_y_coordinate'],
                            end_x_coordinate: response.data.list[0]['fields']['end_x_coordinate'],
                            end_y_coordinate: response.data.list[0]['fields']['end_y_coordinate'],
                            total_length: response.data.list[0]['fields']['total_length'],
                            detection_length: response.data.list[0]['fields']['detection_length'],
                            flow_direction: response.data.list[0]['fields']['flow_direction'],
                            sub_level_type: response.data.list[0]['fields']['sub_level_type'],
                            material: response.data.list[0]['fields']['material'],
                            burial_way: response.data.list[0]['fields']['burial_way'],
                            diameter: response.data.list[0]['fields']['diameter'],
                            burial_year: response.data.list[0]['fields']['burial_year'],
                            ownership: response.data.list[0]['fields']['ownership'],
                            road_where: response.data.list[0]['fields']['road_where'],
                            use_state: response.data.list[0]['fields']['use_state'],
                            detection_unit: response.data.list[0]['fields']['detection_unit'],
                            supervisor_unit: response.data.list[0]['fields']['supervisor_unit'],
                            state: response.data.list[0]['fields']['state'],
                            precision_level: response.data.list[0]['fields']['precision_level'],
                            remark: response.data.list[0]['fields']['remark'],
                            regional_importance_id: response.data.list[0]['fields']['regional_importance_id'],
                            soil_id: response.data.list[0]['fields']['soil_id'],
                            type: response.data.list[0]['fields']['type']
                        });
                        if (response.data.list[0]['fields']['detection_date'].length > 0) {
                            form.setFieldsValue({detection_date: moment(response.data.list[0]['fields']['detection_date'], 'YYYY-MM-DD')})
                        }
                    } else {
                        message.error('获取管线失败:' + response.data.msg, 3)
                    }
                }).catch(function (error) {
                    message.error(error);
                });
            }
        }
    } catch (e) {
        history.push('/ProjectManage/ProjectList')
    }

    /*三个点用于取出对象中的内容*/
    const onFinish = (values) => {
        //解决时间少8个小时的问题
        values.detection_date = values.detection_date != null ? moment(values.detection_date).format("YYYY-MM-DD") : "";
        let data = {"isEdit": false, "project_id": location.state.project_id, "values": values};
        if (location.state.isEdit) {
            data = {"isEdit": true, "values": values, "line_id": location.state.line_id}
        }
        request({
            method: 'post',
            url: 'add_line/',
            data: data,
        }).then(function (response) {
            if (response.data.code === 0) {
                if (location.state.isEdit) {
                    message.success('修改成功', 3);
                } else {
                    message.success('添加成功', 3);
                    history.push({
                        pathname: '/ProjectManage/LineList',
                        state: {project_id: location.state.project_id, initialization: true}
                    })
                }
            } else {
                message.error('添加失败:' + response.data.msg, 3)
            }
        }).catch(function (error) {
            message.error(error);
        });
    };

    const autoFill = () => {
        request({
            method: 'post',
            url: 'get_line_auto_fill/',
            data: {
                "line_id": location.state.line_id,
                "project_id": location.state.project_id
            },
        }).then(function (response) {
            if (response.data.code === 0) {
                form.setFieldsValue({
                    burial_way: response.data.list[0]['fields']['burial_way'],
                    burial_year: response.data.list[0]['fields']['burial_year'],
                    ownership: response.data.list[0]['fields']['ownership'],
                    use_state: response.data.list[0]['fields']['use_state'],
                    detection_unit: response.data.list[0]['fields']['detection_unit'],
                    supervisor_unit: response.data.list[0]['fields']['supervisor_unit'],
                    state: response.data.list[0]['fields']['state'],
                    precision_level: response.data.list[0]['fields']['precision_level'],
                    type: response.data.list[0]['fields']['type']
                });
                if (response.data.list[0]['fields']['detection_date'].length > 0) {
                    form.setFieldsValue({detection_date: moment(response.data.list[0]['fields']['detection_date'], 'YYYY-MM-DD')})
                }
                message.success("填入成功", 3);
            } else if (response.data.code === 2) {
                message.info("该工程下未有任何管线信息", 3);
            } else {
                message.error('自动填入失败:' + response.data.msg, 3)
            }
        }).catch(function (error) {
            message.error(error);
        });
    }

    return (
        <>
            <div style={{marginBottom: 10}}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <a href="javascript:" onClick={() => {
                            history.push('/')
                        }}>主页</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="javascript:" onClick={() => {
                            history.push('/ProjectManage/ProjectList')
                        }}>工程列表</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="javascript:" onClick={() => {
                            history.push({
                                pathname: '/ProjectManage/LineList',
                                state: {project_id: location.state.project_id, initialization: true}
                            })
                        }}>管线列表</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{() => {
                        try {
                            return location.state.isEdit ? "修改管线" : "添加管线";
                        } catch (e) {
                            history.push('/ProjectManage/ProjectList')
                        }
                    }}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Card>
                <Form
                    {...formItemLayout}
                    form={form}
                    scrollToFirstError
                    onFinish={onFinish}
                    size='default'
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="起始点编号" name="start_number" rules={[{required: true, message: '不能为空'}]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="终止点编号" name="end_number" rules={[{required: true, message: '不能为空'}]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="地区重要性" name="regional_importance_id"
                                       rules={[{required: true, message: '不能为空'}]}>
                                <Select>
                                    <Option value={1}>中心商业、附近具有甲类民用建筑工程的区域</Option>
                                    <Option value={2}>交通干道、附近具有乙类民用建筑工程的区域</Option>
                                    <Option value={3}>其他行车道路、附近具有丙类民用建筑工程的区域</Option>
                                    <Option value={4}>所有其他区域或F小于4时</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="土质级别" name="soil_id"
                                       rules={[{required: true, message: '不能为空'}]}>
                                <Select>
                                    <Option value={1}>一般土层或 F=0</Option>
                                    <Option value={2}>Ⅰ级湿陷性黄土、Ⅱ级湿陷性黄土、弱膨胀土</Option>
                                    <Option value={3}>Ⅲ级湿陷性黄土、中膨胀土、淤泥质土、红黏土</Option>
                                    <Option value={4}>粉砂层、Ⅳ级湿陷性黄土、强膨胀土、淤泥</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="起始点高程" name="start_height">
                                <InputNumber/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="终止点高程" name="end_height">
                                <InputNumber/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="起始点埋深" name="start_depth">
                                <InputNumber/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="终止点埋深" name="end_depth">
                                <InputNumber/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="起始X坐标" name="start_x_coordinate">
                                <InputNumber/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="起始Y坐标" name="start_y_coordinate">
                                <InputNumber/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="终止X坐标" name="end_x_coordinate">
                                <InputNumber/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="终止Y坐标" name="end_y_coordinate">
                                <InputNumber/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="总长度" name="total_length" rules={[{required: true, message: '不能为空'}]}>
                                <InputNumber min={0}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="检测长度" name="detection_length" rules={[{required: true, message: '不能为空'}]}>
                                <InputNumber min={0}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="流向" name="flow_direction" rules={[{required: true, message: '不能为空'}]}>
                                <Select>
                                    <Option value={0}>顺流</Option>
                                    <Option value={1}>逆流</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="管线亚级类" name="sub_level_type" rules={[{required: true, message: '不能为空'}]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="材质" name="material" rules={[{required: true, message: '不能为空'}]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="管径" name="diameter" rules={[{required: true, message: '不能为空'}]}>
                                <InputNumber/>
                            </Form.Item>

                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="所在道路" name="road_where" rules={[{required: true, message: '不能为空'}]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="埋设方式">
                                <Space>
                                    <Form.Item label="埋设方式" name="burial_way" noStyle>
                                        <Input/>
                                    </Form.Item>
                                    < div style={{display: 'flex'}}>
                                        <Button onClick={autoFill} type='link'>
                                            自动填入
                                        </Button>
                                        <Tooltip title="自动填入上一管线的权属单位、使用状态、埋设方式、埋设年代等信息">
                                            <QuestionCircleOutlined style={{marginTop: 10}}/>
                                        </Tooltip>
                                    </div>
                                </Space>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="埋设年代" name="burial_year">
                                <InputNumber min={1900}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="权属单位" name="ownership">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="使用状态" name="use_state">
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="探测日期" name="detection_date">
                                <DatePicker placeholder="选择日期"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="探测单位" name="detection_unit">
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="监理单位" name="supervisor_unit">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="状态" name="state">
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="精度级别" name="precision_level">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="管线类型" name="type">
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="备注" name="remark">
                                <Input.TextArea autoSize={{minRows: 1}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item {...tailFormItemLayout}>
                        <Affix offsetBottom={10}>
                            <Button type="primary" htmlType="submit">
                                确定
                            </Button>
                            <Button onClick={() => {
                                history.push({
                                    pathname: '/ProjectManage/LineList',
                                    state: {project_id: location.state.project_id, initialization: true}
                                })
                            }}>
                                返回
                            </Button>
                        </Affix>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
};

export default AddLine;

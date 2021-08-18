import React from "react";
import 'antd/dist/antd.css';
import request from '../../../request'
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import {
    Form,
    Input,
    Button,
    message,
    DatePicker,
    Card,
    Affix,
    Row,
    Col
} from 'antd'

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


const AddProject = () => {
    const history = useHistory();
    const location = useLocation();//获取前一页面history传递的参数
    const [form] = Form.useForm();//对表单数据域进行交互
    try {
        if (location.state.initialization) {
            location.state.initialization = false;
            if (location.state.isEdit) {
                request({
                    method: 'post',
                    url: 'get_project/',
                    data: {
                        "condition": "project_id",
                        "project_id": location.state.project_id
                    },
                }).then(function (response) {
                    if (response.data.code === 0) {
                        form.setFieldsValue({
                            project_no: response.data.list[0]['fields']['project_no'],
                            project_name: response.data.list[0]['fields']['project_name'],
                            staff: response.data.list[0]['fields']['staff'],
                            report_no: response.data.list[0]['fields']['report_no'],
                            requester_unit: response.data.list[0]['fields']['requester_unit'],
                            construction_unit: response.data.list[0]['fields']['construction_unit'],
                            design_unit: response.data.list[0]['fields']['design_unit'],
                            build_unit: response.data.list[0]['fields']['build_unit'],
                            supervisory_unit: response.data.list[0]['fields']['supervisory_unit'],
                            move: response.data.list[0]['fields']['move'],
                            plugging: response.data.list[0]['fields']['plugging'],
                            drainage: response.data.list[0]['fields']['drainage'],
                            dredging: response.data.list[0]['fields']['dredging'],
                            detection_equipment: response.data.list[0]['fields']['detection_equipment'],
                            detection_method: response.data.list[0]['fields']['detection_method'],
                        });
                        if (response.data.list[0]['fields']['start_date'].length > 0) {
                            form.setFieldsValue({ start_date: moment(response.data.list[0]['fields']['start_date'], 'YYYY-MM-DD') })
                        }
                    } else {
                        message.error('获取工程失败:' + response.data.msg, 3)
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
        values.start_date = values.start_date != null ? moment(values.start_date).format("YYYY-MM-DD") : "";
        let data = { "isEdit": false, "values": values };
        if (location.state.isEdit) {
            data = { "isEdit": true, "values": values, "project_id": location.state.project_id }
        }
        request({
            method: 'post',
            url: 'add_project/',
            data: data,
        }).then(function (response) {
            if (response.data.code === 0) {
                if (location.state.isEdit) {
                    message.success('修改成功', 3);
                } else {
                    message.success('添加成功', 3);
                    history.push('/ProjectManage/ProjectList')
                }
            } else {
                message.error('添加失败:' + response.data.msg, 3)
            }
        }).catch(function (error) {
            message.error(error);
        });
    };

    return (
        <Card>
            <Form
                {...formItemLayout}
                form={form}
                scrollToFirstError
                onFinish={onFinish}
                size='large'
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="工程编号" name="project_no">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="工程名称" name="project_name" rules={[{ required: true, message: '不能为空' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="负责人" name="staff">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="开工日期" name="start_date">
                            <DatePicker placeholder="选择日期" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="报告编号" name="report_no">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="委托单位" name="requester_unit">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="建设单位" name="construction_unit">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="设计单位" name="design_unit">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="施工单位" name="build_unit">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="监理单位" name="supervisory_unit">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="移动方式" name="move">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="封堵方式" name="plugging">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="排水方式" name="drainage">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="清疏方式" name="dredging">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="检测设备" name="detection_equipment">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="检测方式" name="detection_method">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>


                <Form.Item {...tailFormItemLayout}>
                    <Affix offsetBottom={10}>
                        <Button type="primary" htmlType="submit">
                            确定
                        </Button>
                        <Button onClick={() => {
                            history.push('/ProjectManage/ProjectList')
                        }}>
                            返回
                        </Button>
                    </Affix>
                </Form.Item>
            </Form>
        </Card>
    )
};

export default AddProject;

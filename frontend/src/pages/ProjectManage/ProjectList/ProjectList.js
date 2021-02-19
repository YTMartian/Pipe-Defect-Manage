import {useHistory} from "react-router-dom"
import request from "../../../request"
import React, {useState} from "react"
import 'antd/dist/antd.css'
import './style.css'
import {
    Table,
    Button,
    Popconfirm,
    message,
    Input,
    Tooltip,
    DatePicker,
    Select
} from 'antd';

const {Search} = Input;
const {RangePicker} = DatePicker;
const {Option} = Select;
message.config({
    top: 150
});


const ProjectList = () => {
    const history = useHistory();
    const [searchSelect, setSearchSelect] = useState('project_name');
    const [initialization, setInitialization] = useState(true);
    const [data, setData] = useState({currentData: [], allData: []});
    const [state, setState] = useState({selectedRowKeys: []});//使用state从而更改数据后能够实时更新

    const getProject = () => {
        request({
            method: 'post',
            url: 'get_project/',
            data: {
                "condition": "all",
            },
        }).then(function (response) {
            if (response.data.code === 0) {
                let newData = [];
                for (let i = 0; i < response.data.list.length; i++) {
                    newData.push({
                        key: response.data.list[i]['pk'],
                        project_no: response.data.list[i]['fields']['project_no'],
                        project_name: response.data.list[i]['fields']['project_name'],
                        staff: response.data.list[i]['fields']['staff'],
                        start_date: response.data.list[i]['fields']['start_date'],
                        report_no: response.data.list[i]['fields']['report_no'],
                    });
                }
                setData({currentData: newData, allData: newData});
            } else {
                message.error('获取失败1' + response.data.msg, 3)
            }
        }).catch(function (error) {
            message.error('删除失败2'+ error);
        });
    };
    if (initialization) {
        getProject();
        setInitialization(false);
    }

    const handleDelete = (selectedRowKeys) => {
        if (selectedRowKeys.length === 0) {
            message.warn('未选中');
            return;
        }
        request({
            method: 'post',
            url: 'delete_project/',
            data: {
                "project_ids": selectedRowKeys,
            },
        }).then(function (response) {
            if (response.data.code === 0) {
                message.success('删除成功');
                getProject();
            } else {
                message.error('删除失败1' + response.data.msg, 3)
            }
        }).catch(function (error) {
            message.error('删除失败2'+ error);
        });
    };

    const onSearch = value => {
        if (value.length === 0) {
            setData({currentData: data.allData, allData: data.allData});
            return;
        }
        let newData = [];
        for (let i = 0; i < data.allData.length; i++) {
            if (data.allData[i][searchSelect].includes(value)) newData.push(data.allData[i]);
        }
        setData({currentData: newData, allData: data.allData});
    };

    const onHandleReport = project_id => {
        message.info(project_id)
    };

    const onRangePickerChange = value => {
        if (value === null) {
            setData({currentData: data.allData, allData: data.allData});
            return;
        }
        let startDate = value[0].format("YYYY-MM-DD");
        let endDate = value[1].format("YYYY-MM-DD");
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        let newData = [];
        for (let i = 0; i < data.allData.length; i++) {
            let currentDate = new Date(data.allData[i]['start_date']);
            if (currentDate >= startDate && currentDate <= endDate) newData.push(data.allData[i]);
        }
        setData({currentData: newData, allData: data.allData});
    };

    const onSearchSelect = value => {
        setSearchSelect(value);
    };

    const onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setState({selectedRowKeys: selectedRowKeys});
    };

    const {selectedRowKeys} = state;
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            {
                key: 'all',
                text: '全选',
                onSelect: allRowKeys => {
                    let newSelectedRowKeys;
                    newSelectedRowKeys = allRowKeys.filter((key, index) => {
                        return true;
                    });
                    setState({selectedRowKeys: newSelectedRowKeys});
                },
            },
            {
                key: 'invert',
                text: '反选',
                onSelect: allRowKeys => {
                    let newSelectedRowKeys;
                    newSelectedRowKeys = allRowKeys.filter((key, index) => {
                        return !(state.selectedRowKeys.includes(key));//用includes判断是否含有某元素
                    });
                    setState({selectedRowKeys: newSelectedRowKeys});
                },
            },
            {
                key: 'clear',
                text: '清空',
                onSelect: allRowKeys => {
                    let newSelectedRowKeys = [];
                    setState({selectedRowKeys: newSelectedRowKeys});
                },
            },
        ],
    };

    const columns = [
        {
            title: '工程编号',
            dataIndex: 'project_no',
            editable: true,
            width: "12%",
            ellipsis: {
                showTitle: false,
            },
            render: project_no => (//显示提示
                <Tooltip placement="topLeft" title={project_no}>
                    {project_no}
                </Tooltip>
            ),
            align: "center",
        },
        {
            title: '工程名称',
            dataIndex: 'project_name',
            editable: true,
            width: "19%",
            ellipsis: {
                showTitle: false,
            },
            render: (project_name, record) => (
                <Tooltip placement="topLeft" title={project_name}>
                    {/* eslint-disable-next-line no-script-url,jsx-a11y/anchor-is-valid */}
                    <a href="javascript:" onClick={() => {
                        history.push({
                            pathname: '/ProjectManage/AddProject',
                            state: {isEdit: true, project_id: record.key, initialization: true}
                        })
                    }}>{project_name}</a>
                </Tooltip>
            ),
            align: "center",
        },
        {
            title: '负责人',
            editable: true,
            width: "10%",
            dataIndex: 'staff',
            ellipsis: {
                showTitle: false,
            },
            align: "center",
            render: staff => (
                <Tooltip placement="topLeft" title={staff}>
                    {staff}
                </Tooltip>
            ),
        },
        {
            title: '开工日期',
            editable: true,
            width: "15%",
            dataIndex: 'start_date',
            ellipsis: {
                showTitle: false,
            },
            align: "center",
            render: start_date => (
                <Tooltip placement="topLeft" title={start_date}>
                    {start_date}
                </Tooltip>
            ),
            sorter: {
                compare: (a, b) => {
                    let date1 = new Date(a.start_date);
                    let date2 = new Date(b.start_date);
                    return date1.getTime() - date2.getTime();
                },
                multiple: 1,
            },
        },
        {
            title: '报告编号',
            editable: true,
            width: "14%",
            dataIndex: 'report_no',
            ellipsis: {
                showTitle: false,
            },
            align: "center",
            render: report_no => (
                <Tooltip placement="topLeft" title={report_no}>
                    {report_no}
                </Tooltip>
            ),
        },
        {
            title: "管线",
            dataIndex: "Line",
            width: "10%",
            align: "center",
            render: (_, record) => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid,no-script-url
                <a href="javascript:" onClick={() => history.push({
                    pathname: '/ProjectManage/LineList',
                    state: {project_id: record.key, initialization: true}
                })}>管线</a>
            )
        },
        {
            title: '视频',
            dataIndex: 'video',
            align: "center",
            width: "10%",
            render:
                (_, record) =>
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid,no-script-url
                    <a href="javascript:" onClick={() => history.push({
                        pathname: '/ProjectManage/VideoList',
                        state: {project_id: record.key, initialization: true}
                    })}>视频</a>
        },
        {
            title: '报告',
            dataIndex: 'report',
            align: "center",
            render:
                (_, record) =>
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid,no-script-url
                    <a href="javascript:" onClick={() => onHandleReport(record.key)}>报告</a>
        },
    ];
    return (
        <>
            <div>
                <Button
                    onClick={() => {
                        history.push({
                            pathname: '/ProjectManage/AddProject',
                            state: {isEdit: false, initialization: true}
                        })
                    }}
                    type="primary"
                    style={{
                        marginBottom: 16,
                        float: 'left'
                    }}
                >
                    添加工程
                </Button>
                <Search
                    placeholder="搜索..."
                    onSearch={onSearch}
                    enterButton
                    style={{
                        float: 'left',
                        width: "25%",
                        marginLeft: "1%"
                    }}
                />
                <Select defaultValue="以工程名称" style={{float: 'left', width: 120}} onChange={onSearchSelect}>
                    <Option value="project_name">以工程名称</Option>
                    <Option value="project_no">以工程编号</Option>
                    <Option value="staff">以负责人</Option>
                </Select>
                <RangePicker
                    onChange={onRangePickerChange}
                    style={{
                        float: 'left',
                        marginLeft: "1%"
                    }}
                />
                <Popconfirm title="确定删除?" onConfirm={() => handleDelete(state.selectedRowKeys)}>
                    <Button
                        danger
                        type="primary"
                        style={{
                            float: 'right',
                        }}
                    >
                        删除所选
                    </Button>
                </Popconfirm>
            </div>
            <Table
                // bordered
                rowKey={record => record.key}//record.project_id为每一行设置不同的key，否则点击一行就会全选,或者插入数据时设置key
                rowSelection={rowSelection}
                dataSource={data.currentData}
                columns={columns}
                pagination={{
                    defaultPageSize: 10,
                    showTotal: total => `共 ${total} 条`,
                    showSizeChanger: true,
                }}
                locale={{
                    emptyText: '没有数据',
                    cancelSort: '取消排序',
                    triggerAsc: '点击升序',
                    triggerDesc: '点击降序'
                }}
            />
        </>
    );
};

export default ProjectList

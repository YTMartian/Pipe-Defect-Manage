import {useHistory, useLocation} from "react-router-dom"
import request from "../../../request"
import React, {useState} from "react"
import 'antd/dist/antd.css'
import './style.css'

import {
    Table,
    Button,
    Popconfirm,
    message,
    Tooltip,
    Badge
} from 'antd'


message.config({
    top: 150
});


const VideoList = () => {
    const history = useHistory();
    const location = useLocation();
    const [data, setData] = useState({currentData: [], allData: []});
    const [state, setState] = useState({selectedRowKeys: []});//使用state从而更改数据后能够实时更新

    const getVideo = () => {
        request({
            method: 'post',
            url: 'get_video/',
            data: {
                "condition": "all",
                "project_id": location.state.project_id,
            },
        }).then(function (response) {
            if (response.data.code === 0) {
                let newData = [];
                for (let i = 0; i < response.data.list.length; i++) {
                    newData.push({
                        key: response.data.list[i]['pk'],
                        name: response.data.list[i]['fields']['name'],
                        path: response.data.list[i]['fields']['path'],
                        record_date: response.data.list[i]['fields']['record_date'],
                        import_date: response.data.list[i]['fields']['import_date'],
                        remark: response.data.list[i]['fields']['remark'],
                        defect_count:response.data.list[i]['fields']['defect_count']
                    });
                }
                setData({currentData: newData, allData: newData});
            } else {
                message.error('获取失败1:' + response.data.msg, 3)
            }
        }).catch(function (error) {
            message.error('获取失败2:' + error, 3);
        });
    };

    try {
        if (location.state.initialization) {
            getVideo();
            location.state.initialization = false;
        }
    } catch (e) {
        history.push('/ProjectManage/ProjectList')
    }


    const handleDelete = (selectedRowKeys) => {
        if (selectedRowKeys.length === 0) {
            message.warn('未选中');
            return;
        }
        request({
            method: 'post',
            url: 'delete_video/',
            data: {
                "video_ids": selectedRowKeys,
            },
        }).then(function (response) {
            if (response.data.code === 0) {
                message.success('删除成功', 3);
                getVideo();
            } else {
                message.error('删除失败1:' + response.data.msg, 3)
            }
        }).catch(function (error) {
            message.error('删除失败2:' + error, 3);
        });
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
            title: '文件名',
            dataIndex: 'name',
            editable: true,
            width: "20%",
            ellipsis: {
                showTitle: false,
            },
            align: "center",
            render: (name, record) => (
                // eslint-disable-next-line react/jsx-no-comment-textnodes
                <Tooltip placement="topLeft" title={name}>
                    {/* eslint-disable-next-line no-script-url,jsx-a11y/anchor-is-valid */}
                    <a href="javascript:" onClick={() => history.push({
                        pathname: '/ProjectManage/AddVideo',
                        state: {
                            isEdit: true,
                            video_id: record.key,
                            project_id: location.state.project_id,
                            initialization: true,
                            isAddNewVideo: false,//是否是添加视频，如果是，就可以多选文件，否则不能。
                        }
                    })}>{name}</a>
                </Tooltip>
            ),
        },
        {
            title: '路径',
            dataIndex: 'path',
            editable: true,
            width: "25%",
            ellipsis: {
                showTitle: false,
            },
            align: "center",
            render: path => (
                <Tooltip placement="topLeft" title={path}>
                    {path}
                </Tooltip>
            ),
        },
        {
            title: '检测日期',
            dataIndex: 'record_date',
            editable: true,
            width: "14%",
            ellipsis: {
                showTitle: false,
            },
            align: "center",
            sorter: {
                compare: (a, b) => {
                    let date1 = new Date(a.record_date);
                    let date2 = new Date(b.record_date);
                    return date1.getTime() - date2.getTime();
                },
                multiple: 2,
            },
            render: record_date => (
                <Tooltip placement="topLeft" title={record_date}>
                    {record_date}
                </Tooltip>
            ),
        },
        {
            title: '导入日期',
            editable: true,
            width: "20%",
            dataIndex: 'import_date',
            ellipsis: {
                showTitle: false,
            },
            align: "center",
            sorter: {
                compare: (a, b) => {
                    let date1 = new Date(a.import_date);
                    let date2 = new Date(b.import_date);
                    return date1.getTime() - date2.getTime();
                },
                multiple: 1,
            },
            render: import_date => (
                <Tooltip placement="topLeft" title={import_date}>
                    {import_date}
                </Tooltip>
            ),
        },
        {
            title: "缺陷",
            dataIndex: "defect",
            width: "15%",
            align: "center",
            render: (_, record) => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid,no-script-url
                <Badge count={record.defect_count} offset={[13, -7]} size="small" style={{ backgroundColor: 'red' }}>
                    <a href="javascript:" onClick={() => history.push({
                        pathname: '/ProjectManage/DefectDetection',
                        state: {
                            isEdit: true,
                            video_id: record.key,
                            project_id: location.state.project_id,
                            path: record.path,
                            initialization: true
                        }
                    })}>缺陷</a>
                </Badge>
            )
        },
        // {
        //     title: '数量',
        //     editable: true,
        //     width: "10%",
        //     dataIndex: 'count',
        //     ellipsis: {
        //         showTitle: false,
        //     },
        //     align: "center",
        // }
    ];
    return (
        <>
            <div>
                <Button
                    onClick={() => {
                        history.push('/ProjectManage/ProjectList')
                    }}
                    style={{float: 'left'}}
                >
                    返回
                </Button>
                <Button
                    onClick={() => {
                        history.push({
                            pathname: '/ProjectManage/AddVideo',
                            state: {
                                isEdit: false,
                                project_id: location.state.project_id,
                                initialization: true,
                                isAddNewVideo: true,//是否是添加视频，如果是，就可以多选文件，否则不能。
                            }
                        })
                    }}
                    type="primary"
                    style={{
                        marginBottom: 16,
                        float: 'left',
                        marginLeft: '1%'
                    }}
                >
                    添加视频
                </Button>
                <Popconfirm title="确定删除?" onConfirm={() => handleDelete(state.selectedRowKeys)}>
                    <Button
                        danger
                        type="primary"
                        style={{
                            float: 'right'
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
                expandable={{
                    expandedRowRender: record => {
                        return (
                            <>
                                <p>{record.remark}</p>
                            </>
                        )
                    },
                    rowExpandable: record => record.remark.length > 0,
                }}
                pagination={{
                    defaultPageSize: 10,
                    showTotal: total => `共 ${total} 条`,
                    showSizeChanger: true,
                }}
                locale={{
                    emptyText: '没有数据',
                }}
            />

        </>
    );
};

export default VideoList;

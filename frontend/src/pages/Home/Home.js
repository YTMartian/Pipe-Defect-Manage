import React, {useState} from "react";
import request from "../../request"
import 'antd/dist/antd.css';
import {ChartCard, MiniArea} from 'ant-design-pro/lib/Charts';
import moment from 'moment';
import {useLocation} from "react-router-dom";
import 'ant-design-pro/dist/ant-design-pro.css';
import {
    message,
    Col,
    Row,
    Card
} from "antd";

message.config({
    top: 150
});


const Home = () => {
    const [projectData, setProjectData] = useState([]);
    const [projectCount, setProjectCount] = useState(0);
    const [videoData, setVideoData] = useState([]);
    const [videoCount, setVideoCount] = useState(0);
    const [defectData, setDefectData] = useState([]);
    const [defectCount, setDefectCount] = useState(0);
    const [statisticLoading, setStatisticLoading] = useState(true);
    const location = useLocation();
    if (!location.state) {
        location.state = true;
        request({
            method: "get",
            url: "get_home_statistic/",
        }).then(function (response) {
            if (response.data.code === 0) {
                setProjectCount(response.data.data.project_count);
                setVideoCount(response.data.data.video_count);
                setDefectCount(response.data.data.defect_count);
                const visitData1 = [];
                for (let i = 0; i < response.data.data.project_statistic.length; i += 1) {
                    visitData1.push({
                        x: moment(response.data.data.project_statistic[i].time).format('YYYY-MM-DD'),
                        y: response.data.data.project_statistic[i].count,
                    });
                }
                setProjectData(visitData1);
                const visitData2 = [];
                for (let i = 0; i < response.data.data.video_statistic.length; i += 1) {
                    visitData2.push({
                        x: moment(response.data.data.video_statistic[i].time).format('YYYY-MM-DD'),
                        y: response.data.data.video_statistic[i].count,
                    });
                }
                setVideoData(visitData2);
                const visitData3 = [];
                for (let i = 0; i < response.data.data.defect_statistic.length; i += 1) {
                    visitData3.push({
                        x: moment(response.data.data.defect_statistic[i].time).format('YYYY-MM-DD'),
                        y: response.data.data.defect_statistic[i].count,
                    });
                }
                setDefectData(visitData3);
                setStatisticLoading(false);
            } else {
                message.error("获取统计失败1:" + response.data.msg + '刷新重试', 3);
            }
        }).catch(function (error) {
            message.error("获取统计失败2:" + error + '刷新重试', 3);
        });
    }
    return (
        <Card title="统计信息" bordered={true} loading={statisticLoading}>
            <Row gutter={16}>
                <Col span={8}>
                    <ChartCard title="工程数量" total={projectCount} contentHeight={70}>
                        <MiniArea line height={60} data={projectData}/>
                    </ChartCard>
                </Col>
                <Col span={8}>
                    <ChartCard title="视频数量" total={videoCount} contentHeight={70}>
                        <MiniArea line height={60} data={videoData}/>
                    </ChartCard>
                </Col>
                <Col span={8}>
                    <ChartCard title="缺陷数量" total={defectCount} contentHeight={70}>
                        <MiniArea line height={60} data={defectData}/>
                    </ChartCard>
                </Col>
            </Row>
        </Card>
    )
};

export default Home;

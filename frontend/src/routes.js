import React from 'react';

const Home = React.lazy(() => import('./pages/Home/Home'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectManage/ProjectList/ProjectDetail'));
const AddProject = React.lazy(() => import('./pages/ProjectManage/ProjectList/AddProject'));
const ProjectList = React.lazy(() => import('./pages/ProjectManage/ProjectList/ProjectList'));
const GeneralSettings = React.lazy(() => import('./pages/ProjectManage/GeneralSettings/GeneralSettings'));

const routes = [
    {path: '/', exact: true, name: '主页', component: Home},
    // { path: '/ProjectManage', name: '工程管理', component: ProjectList, exact: true },
    {path: '/ProjectManage/ProjectList', name: '工程列表', component: ProjectList},
    {path: '/ProjectManage/ProjectDetail', name: '详细', component: ProjectDetail},
    {path: '/ProjectManage/AddProject', name: '添加工程', component: AddProject},
    {path: '/ProjectManage/GeneralSettings', name: '通用设置', component: GeneralSettings},
];

export default routes;

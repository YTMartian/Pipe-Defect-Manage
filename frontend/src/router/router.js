import Login from '../pages/login/login'
import Index from '../pages/index/index'
// 菜单相关路由
export const menus = [];
//登录、首页、404路由
export const main = [
    {path: '/login', exact: true, name: '登录', component: Login},
    {path: '/', name: '首页', component: Index, routes: menus},
];

export const routerExport = {
    main, menus
};

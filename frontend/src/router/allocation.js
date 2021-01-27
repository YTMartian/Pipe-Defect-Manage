import React from 'react';
import {Route, Link, Switch, Redirect} from "react-router-dom";

export const SubRoutes = route => (<Route
        path={route.path}
        exact={route.exact}
        render={props => {
            return (
                route && (route.Redirect ? (<Redirect to={route.Redirect}></Redirect>) :
                    (<route.component {...props} routes={route.routes}/>))
            )
        }}
    />
);

export const RenderRoutes = ({routes}) => {
    return <Switch> {(routes.map((route, i) => <SubRoutes key={i} {...route} />))} </Switch>
};

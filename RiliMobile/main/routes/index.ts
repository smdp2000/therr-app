import { RouteConfig, StackNavigationState } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { StackNavigationEventMap } from '@react-navigation/stack/lib/typescript/src/types';
import Home from './Home';
import Login from './Login';
import { IAccess, AccessCheckType } from '../types';

interface ExtendedRouteOptions {
    access?: IAccess;
}

const routes: RouteConfig<
    Record<string, object>,
    any,
    StackNavigationState,
    StackNavigationOptions & ExtendedRouteOptions,
    StackNavigationEventMap
>[] = [
    {
        name: 'Home',
        component: Home,
        options: {
            title: 'Home',
            access: {
                type: AccessCheckType.ALL,
                levels: [],
            },
        },
    },
    {
        name: 'Login',
        component: Login,
        options: { title: 'Login' },
    },
];

export default routes;

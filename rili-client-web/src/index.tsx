import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Layout from './components/layout';
import store from './store';
import './styles/index.scss';
import 'rili-public-library/styles/index.scss'; // tslint:disable-line no-implicit-dependencies

window.onload = () => {
    render(
        <Provider store={store}>
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </Provider>,
        document.getElementById('app')
    );
};
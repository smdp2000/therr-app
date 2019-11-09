import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import * as express from 'express';
import * as fs from 'fs';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { applyMiddleware, createStore, DeepPartial } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import printLogs from 'rili-public-library/utilities/print-logs'; // tslint:disable-line no-implicit-dependencies
import routeConfig from './routeConfig';
import rootReducer from './redux/reducers';
import socketIOMiddleWare from './socket-io-middleware';

console.log('DOMAIN_CERT_LOCATION: ', process.env.DOMAIN_CERT_LOCATION); // tslint:disable-line
console.log('DOMAIN_KEY_LOCATION: ', process.env.DOMAIN_KEY_LOCATION); // tslint:disable-line

// TODO: RFRONT-9: Fix window is undefined hack
declare global {
    namespace NodeJS {
        interface Global { // tslint:disable-line
            window: any;
        }
    }
}

if (!process.env.BROWSER) {
    global.window = {}; // Temporarily define window for server-side
}
import Layout from './components/Layout';
import routes, { IRoute } from './routes';

// Initialize the server and configure support for handlebars templates
const createAppServer = () => {
    let app = express();
    let server;
    if (process.env.NODE_ENV !== 'development') {
        let httpsCredentials = {
            key: fs.readFileSync(process.env.DOMAIN_KEY_LOCATION),
            cert: fs.readFileSync(process.env.DOMAIN_CERT_LOCATION),
        };
        server = https.createServer(httpsCredentials, app);
    } else {
        server = http.createServer(app);
    }

    return {
        app,
        server,
    };
};

const { app, server } = createAppServer();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Define the folder that will be used for static assets
app.use(express.static(path.join(__dirname + '/../build/static/')));

// Universal routing and rendering for SEO
for (let i in routeConfig) {
    let routePath = routeConfig[i].route;
    let routeView = routeConfig[i].view;
    let title = routeConfig[i].head.title;

    app.get(routePath, (req, res) => {
        let promises: any = [];
        const staticContext: any = {};
        const initialState = {
            user: {
                details: {},
            },
        };
        const store = createStore(
            rootReducer,
            initialState,
            applyMiddleware(
                socketIOMiddleWare,
                thunkMiddleware,
            )
        );

        routes.some((route: IRoute) => {
            const match = matchPath(req.url, route);
            if (match && route.fetchData) {
                const Comp = route.component.WrappedComponent;
                const initData = (Comp && route.fetchData) || (() => Promise.resolve());
                // fetchData calls a dispatch on the store updating the current state before render
                promises.push(initData(store));
            }
            return !!match;
        });

        Promise.all(promises).then(() => {
            const markup = ReactDOMServer.renderToString(
                <Provider store={store}>
                    <StaticRouter location={req.url} context={staticContext}>
                        <Layout />
                    </StaticRouter>
                </Provider>
            );

            // This gets the initial state created after all dispatches are called in fetchData
            Object.assign(initialState, store.getState());

            const state = JSON.stringify(initialState).replace(/</g, '\\u003c');

            if (staticContext.url) {
                printLogs({
                    shouldPrintLogs: true,
                    messageOrigin: 'SERVER_CLIENT',
                    messages: 'Somewhere a <Redirect> was rendered',
                });
                res.writeHead(staticContext.statusCode, {
                    'Location': staticContext.url,
                });
                res.end();
            } else {
                return res.render(routeView, {title, markup, state});
            }
        });

    });
}

// Start the server
const port = process.env.CLIENT_PORT;
server.listen(port, (err: any) => {
    if (err) {
        return console.error(err);
    }
    printLogs({
        shouldPrintLogs: true,
        messageOrigin: 'SERVER_CLIENT',
        messages: `Server running on port, ${port}, with process id ${process.pid}`,
    });
});

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { sessionService } from 'redux-react-session';
import 'semantic-ui-css/semantic.min.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import './index.css';
import App from './app/layout/App';
import registerServiceWorker from './registerServiceWorker';
import { configureStore } from './app/store/configureStore';
import ScrollToTop from './app/common/util/ScrollToTop';

const store = configureStore();
const rootEl = document.getElementById('root');

let render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <ScrollToTop>
                    <ReduxToastr 
                        timeOut={2000}
                        position='bottom-right'
                        transitionIn='fadeIn'
                        transitionOut='fadeOut'
                        progressBar
                    />
                    <App />
                </ScrollToTop>
            </BrowserRouter>
        </Provider>,
        rootEl
    );
}

if (module.hot) {
    module.hot.accept('./app/layout/App', ()=> {
        setTimeout(render)
    })
}

const validateSession = (session) => {
    // check if your session is still valid
    return session? true: false;
}

const optionSession = {
    refreshOnCheckAuth: true,
    redirectPath: '/',
    driver: 'COOKIES',
    validateSession
}

sessionService.initSessionService(store, optionSession);

render();
registerServiceWorker();

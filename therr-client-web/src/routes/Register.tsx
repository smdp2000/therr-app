import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigateFunction } from 'react-router-dom';
import translator from '../services/translator';
import RegisterForm from '../components/forms/RegisterForm';
import UsersActions from '../redux/actions/UsersActions';
import withNavigation from '../wrappers/withNavigation';

interface IRegisterRouterProps {
    navigation: {
        navigate: NavigateFunction;
    }
}

interface IRegisterDispatchProps {
    register: Function;
}

type IStoreProps = IRegisterDispatchProps

// Regular component props
interface IRegisterProps extends IRegisterRouterProps, IStoreProps {
}

interface IRegisterState {
    errorMessage: string;
    inputs: any;
}

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    register: UsersActions.register,
}, dispatch);

/**
 * Login
 */
export class RegisterComponent extends React.Component<IRegisterProps, IRegisterState> {
    private translate: Function;

    constructor(props: IRegisterProps) {
        super(props);

        this.state = {
            errorMessage: '',
            inputs: {},
        };

        this.translate = (key: string, params: any) => translator('en-us', key, params);
    }

    componentDidMount() { // eslint-disable-line class-methods-use-this
        document.title = `Therr | ${this.translate('pages.register.pageTitle')}`;
    }

    register = (credentials: any) => {
        this.props.register(credentials).then((response: any) => {
            this.props.navigation.navigate('/login', {
                state: {
                    successMessage: this.translate('pages.register.registerSuccess'),
                },
            });
        }).catch((error: any) => {
            if (error.statusCode === 400) {
                this.setState({
                    errorMessage: error.message,
                });
            } else {
                this.setState({
                    errorMessage: this.translate('pages.register.registerError'),
                });
            }
        });
    };

    public render(): JSX.Element | null {
        const { errorMessage } = this.state;

        return (
            <>
                <div id="page_register" className="flex-box space-evenly center row wrap-reverse">
                    <RegisterForm register={this.register} title={this.translate('pages.register.pageTitle')} />
                </div>
                {
                    errorMessage
                    && <div className="alert-error text-center">{errorMessage}</div>
                }
            </>
        );
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(RegisterComponent));

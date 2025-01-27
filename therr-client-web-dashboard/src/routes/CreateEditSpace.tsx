import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigateFunction } from 'react-router-dom';
import {
    Col,
    Row,
    Button,
    Dropdown,
    ButtonGroup,
    Toast,
    ToastContainer,
} from 'react-bootstrap';
import { MapActions, UserConnectionsActions } from 'therr-react/redux/actions';
import { MapsService } from 'therr-react/services';
import { IMapState as IMapReduxState, IUserState, IUserConnectionsState } from 'therr-react/types';
import { Option } from 'react-bootstrap-typeahead/types/types';
import translator from '../services/translator';
import withNavigation from '../wrappers/withNavigation';
import EditSpaceForm from '../components/forms/EditSpaceForm';
import ManageSpacesMenu from '../components/ManageSpacesMenu';
import { ISpace } from '../types';

interface ICreateEditSpaceRouterProps {
    location: {
        state: {
            space?: ISpace;
        };
    };
    routeParams: any;
    navigation: {
        navigate: NavigateFunction;
    }
}

interface ICreateEditSpaceDispatchProps {
    searchUserConnections: Function;
    updateSpace: Function;
    getPlacesSearchAutoComplete: Function;
    setSearchDropdownVisibility: Function;
}

interface IStoreProps extends ICreateEditSpaceDispatchProps {
    map: IMapReduxState;
    user: IUserState;
    userConnections: IUserConnectionsState;
}

// Regular component props
interface ICreateEditSpaceProps extends ICreateEditSpaceRouterProps, IStoreProps {
    onInitMessaging?: Function;
}

interface ICreateEditSpaceState {
    alertIsVisible: boolean;
    alertVariation: string;
    alertTitle: string;
    alertMessage: string;
    isSubmitting: boolean;
    inputs: {
        [key: string]: any;
    };
    isEditing: boolean;
}

const mapStateToProps = (state: any) => ({
    map: state.map,
    user: state.user,
    userConnections: state.userConnections,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    searchUserConnections: UserConnectionsActions.search,
    updateSpace: MapActions.updateSpace,
    getPlacesSearchAutoComplete: MapActions.getPlacesSearchAutoComplete,
    setSearchDropdownVisibility: MapActions.setSearchDropdownVisibility,
}, dispatch);

/**
 * CreateEditSpace
 */
export class CreateEditSpaceComponent extends React.Component<ICreateEditSpaceProps, ICreateEditSpaceState> {
    private translate: Function;

    private throttleTimeoutId: any;

    constructor(props: ICreateEditSpaceProps) {
        super(props);

        const { space } = props.location?.state || {};

        this.state = {
            alertIsVisible: false,
            alertVariation: 'success',
            alertTitle: '',
            alertMessage: '',
            isSubmitting: false,
            inputs: {
                address: space?.addressReadable ? [
                    {
                        label: space?.addressReadable,
                    },
                ] : undefined,
                category: space?.category || 'uncategorized',
                spaceTitle: space?.notificationMsg || '',
                spaceDescription: space?.message || '',
            },
            isEditing: true,
        };

        this.translate = (key: string, params: any) => translator('en-us', key, params);
    }

    componentDidMount() {
        const {
            user,
            userConnections,
        } = this.props;
        document.title = `Therr for Business | ${this.translate('pages.claimASpace.pageTitle')}`;
    }

    componentWillUnmount = () => {
        clearTimeout(this.throttleTimeoutId);
    };

    navigateHandler = (routeName: string) => () => this.props.navigation.navigate(routeName);

    isSubmitDisabled = () => {
        const { inputs, isSubmitting } = this.state;
        if (isSubmitting) {
            return true;
        }
        if (inputs.address) {
            return false;
        }

        return true;
    };

    onAddressTypeaheadChange = (text: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const { getPlacesSearchAutoComplete, map } = this.props;

        clearTimeout(this.throttleTimeoutId);

        this.throttleTimeoutId = setTimeout(() => {
            getPlacesSearchAutoComplete({
                longitude: map?.longitude || '37.76999',
                latitude: map?.latitude || '-122.44696',
                // radius,
                input: text,
            });
        }, 500);

        this.setState({
            inputs: {
                ...this.state.inputs,
                address: [
                    {
                        label: text,
                    },
                ],
            },
        });
    };

    onAddressTypeaheadSelect = (selected: Option[]) => {
        const result: any = selected[0];

        if (result) {
            MapsService.getPlaceDetails({
                placeId: result.place_id,
            }).then(({ data }) => {
                this.setState({
                    inputs: {
                        ...this.state.inputs,
                        latitude: data?.result?.geometry?.location?.lat,
                        longitude: data?.result?.geometry?.location?.lng,
                    },
                });
            }).catch((err) => {
                console.log(err);
            });

            this.setState({
                inputs: {
                    ...this.state.inputs,
                    address: selected,
                },
            });
        }
    };

    onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { name, value } = event.currentTarget;
        const newInputChanges = {
            [name]: value,
        };

        this.setState({
            inputs: {
                ...this.state.inputs,
                ...newInputChanges,
            },
        });
    };

    onUpdateSpace = (event: React.MouseEvent<HTMLInputElement>) => {
        const { location, navigation, updateSpace } = this.props;
        const { space } = location?.state || {};

        event.preventDefault();
        const {
            address: selectedAddresses,
            category,
            latitude,
            longitude,
            spaceTitle,
            spaceDescription,
        } = this.state.inputs;

        this.setState({
            isSubmitting: true,
        });

        if (space?.id) {
            updateSpace(space.id, {
                ...space,
                notificationMsg: spaceTitle,
                message: spaceDescription,
                category,
            }).then(() => {
                this.setState({
                    alertTitle: 'Successfully Updated!',
                    alertMessage: 'This space was updated without issue.',
                    alertVariation: 'success',
                });
                this.toggleAlert(true);
                setTimeout(() => {
                    this.setState({
                        isSubmitting: false,
                    });
                    navigation.navigate('/manage-spaces');
                }, 2000);
            }).catch((error) => {
                console.log(error);
                this.onSubmitError('Unknown Error', 'Failed to process your request. Please try again later.');
                this.setState({
                    isSubmitting: false,
                });
            });
        }
    };

    onSubmitError = (errTitle: string, errMsg: string) => {
        this.setState({
            alertTitle: errTitle,
            alertMessage: errMsg,
            alertVariation: 'danger',
        });
        this.toggleAlert(true);
    };

    toggleAlert = (show?: boolean) => {
        this.setState({
            alertIsVisible: show !== undefined ? show : !this.state.alertIsVisible,
        });
    };

    public render(): JSX.Element | null {
        const {
            alertIsVisible,
            alertVariation,
            alertTitle,
            alertMessage,
            inputs,
            isEditing,
        } = this.state;
        const { map, user } = this.props;

        return (
            <div id="page_settings" className="flex-box column">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <ManageSpacesMenu
                        navigateHandler={this.navigateHandler}
                    />

                    <ButtonGroup>
                        <Button variant="outline-primary" size="sm">Share</Button>
                    </ButtonGroup>
                </div>

                <Row className="d-flex justify-content-around align-items-center py-4">
                    <Col xs={12} xl={10} xxl={8}>
                        {
                            isEditing
                                ? <h1 className="text-center">Edit Space</h1>
                                : <h1 className="text-center">Create a Space</h1>
                        }
                        <EditSpaceForm
                            addressTypeAheadResults={map?.searchPredictions?.results || []}
                            inputs={{
                                address: inputs.address,
                                category: inputs.category,
                                spaceTitle: inputs.spaceTitle,
                                spaceDescription: inputs.spaceDescription,
                            }}
                            isSubmitDisabled={this.isSubmitDisabled()}
                            onAddressTypeaheadChange={this.onAddressTypeaheadChange}
                            onAddressTypeaheadSelect={this.onAddressTypeaheadSelect}
                            onInputChange={this.onInputChange}
                            onSubmit={this.onUpdateSpace}
                            submitText='Update Space'
                        />
                    </Col>

                    {/* <Col xs={12} xl={4}>
                        <Row>
                            <Col xs={12}>
                                <ProfileCardWidget />
                            </Col>
                            <Col xs={12}>
                                <ChoosePhotoWidget
                                    title="Select profile photo"
                                    photo={Profile3}
                                />
                            </Col>
                        </Row>
                    </Col> */}
                </Row>
                <ToastContainer className="p-3" position={'bottom-end'}>
                    <Toast bg={alertVariation} show={alertIsVisible && !!alertMessage} onClose={() => this.toggleAlert(false)}>
                        <Toast.Header>
                            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                            <strong className="me-auto">{alertTitle}</strong>
                            {/* <small>1 mins ago</small> */}
                        </Toast.Header>
                        <Toast.Body>{alertMessage}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </div>
        );
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(CreateEditSpaceComponent));

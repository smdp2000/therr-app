import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigateFunction } from 'react-router-dom';
import {
    Col,
    Row,
    Button,
    ButtonGroup,
    Toast,
    ToastContainer,
    ToggleButtonGroup,
} from 'react-bootstrap';
import { MapActions, UserConnectionsActions } from 'therr-react/redux/actions';
import { MapsService } from 'therr-react/services';
import { IMapState as IMapReduxState, IUserState, IUserConnectionsState } from 'therr-react/types';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import translator from '../../services/translator';
import withNavigation from '../../wrappers/withNavigation';
import ManageSpacesMenu from '../../components/ManageSpacesMenu';
import SpacesListTable from './SpacesListTable';
import { ISpace } from '../../types';

const ItemsPerPage = 10;

interface IManageSpacesRouterProps {
    navigation: {
        navigate: NavigateFunction;
    }
}

interface IManageSpacesDispatchProps {
    searchUserConnections: Function;
    getPlacesSearchAutoComplete: Function;
    setSearchDropdownVisibility: Function;
}

interface IStoreProps extends IManageSpacesDispatchProps {
    map: IMapReduxState;
    user: IUserState;
    userConnections: IUserConnectionsState;
}

// Regular component props
interface IManageSpacesProps extends IManageSpacesRouterProps, IStoreProps {
    onInitMessaging?: Function;
}

interface IManageSpacesState {
    alertIsVisible: boolean;
    alertVariation: string;
    alertTitle: string;
    alertMessage: string;
    isSubmitting: boolean;
    inputs: {
        [key: string]: any;
    };
    pagination: {
        itemsPerPage: number;
        pageNumber: number;
    };
    spacesInView: ISpace[]; // TODO: Move to Redux
}

const mapStateToProps = (state: any) => ({
    map: state.map,
    user: state.user,
    userConnections: state.userConnections,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    searchUserConnections: UserConnectionsActions.search,
    getPlacesSearchAutoComplete: MapActions.getPlacesSearchAutoComplete,
    setSearchDropdownVisibility: MapActions.setSearchDropdownVisibility,
}, dispatch);

/**
 * ManageSpaces
 */
export class ManageSpacesComponent extends React.Component<IManageSpacesProps, IManageSpacesState> {
    private translate: Function;

    private throttleTimeoutId: any;

    constructor(props: IManageSpacesProps) {
        super(props);

        this.state = {
            alertIsVisible: false,
            alertVariation: 'success',
            alertTitle: '',
            alertMessage: '',
            isSubmitting: false,
            inputs: {
                spaceTitle: '',
                spaceDescription: '',
            },
            pagination: {
                itemsPerPage: ItemsPerPage,
                pageNumber: 1,
            },
            spacesInView: [],
        };

        this.translate = (key: string, params: any) => translator('en-us', key, params);
    }

    componentDidMount() {
        const { pagination } = this.state;
        document.title = `Therr for Business | ${this.translate('pages.manageSpaces.pageTitle')}`;
        this.fetchMySpaces(pagination.pageNumber, pagination.itemsPerPage);
    }

    componentWillUnmount = () => {
        clearTimeout(this.throttleTimeoutId);
    };

    fetchMySpaces = (pageNumber = 1, itemsPerPage = ItemsPerPage) => {
        this.setState({
            pagination: {
                ...this.state.pagination,
                pageNumber,
                itemsPerPage,
            },
        }, () => {
            MapsService.searchMySpaces({
                itemsPerPage,
                pageNumber,
            }).then((response) => new Promise((resolve) => {
                this.setState({
                    spacesInView: response?.data?.results || [],
                }, () => resolve(null));
            }));
        });
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
    };

    onAddressTypeaheadSelect = (selected: Option[]) => {
        const result: any = selected[0];
        console.log(result);

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
                address: result.description,
            },
        });
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

    onSubmitSpaceClaim = (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { map } = this.props;
        const {
            address, latitude, longitude, spaceTitle, spaceDescription,
        } = this.state.inputs;

        this.setState({
            isSubmitting: true,
        });

        MapsService.requestClaim({
            title: spaceTitle,
            description: spaceDescription,
            address,
            latitude,
            longitude,
        }).then(() => {
            this.setState({
                alertTitle: 'Request Sent',
                alertMessage: 'Success! Please allow 24-72 hours as we review your request.',
                alertVariation: 'success',
            });
            this.toggleAlert(true);
        }).catch((error) => {
            this.onSubmitError('Unknown Error', 'Failed to process your request. Please try again.');
        }).finally(() => {
            this.setState({
                isSubmitting: false,
            });
        });
    };

    onPageBack = () => {
        const { pagination } = this.state;
        this.fetchMySpaces(pagination.pageNumber - 1, pagination.itemsPerPage);
    };

    onPageForward = () => {
        const { pagination } = this.state;
        this.fetchMySpaces(pagination.pageNumber + 1, pagination.itemsPerPage);
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
            pagination,
            spacesInView,
        } = this.state;
        const { map, user } = this.props;

        return (
            <div id="page_settings" className="flex-box column">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <ManageSpacesMenu
                        navigateHandler={this.navigateHandler}
                    />

                    <ButtonGroup className="mb-2 mb-md-0">
                        {
                            pagination.pageNumber > 1
                                && <Button onClick={this.onPageBack} variant="outline-primary" size="sm">
                                    <FontAwesomeIcon icon={faChevronLeft} className="me-2" /> Prev. Page
                                </Button>
                        }
                        {
                            spacesInView.length === ItemsPerPage
                                && <Button onClick={this.onPageForward} variant="outline-primary" size="sm">
                                    Next Page <FontAwesomeIcon icon={faChevronRight} className="me-2" />
                                </Button>
                        }
                    </ButtonGroup>
                </div>

                <Row className="d-flex justify-content-around align-items-center py-4">
                    <Col xs={12} xl={12} xxl={10}>
                        <h1 className="text-center">Manage Your Spaces</h1>
                        <SpacesListTable
                            spacesInView={spacesInView}
                        />
                    </Col>
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

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ManageSpacesComponent));

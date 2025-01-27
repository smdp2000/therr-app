import {
    faPencilRuler,
    faPlus, faRocket, faTasks, faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';

interface IManageSpacesMenuProps {
    className?: string;
    navigateHandler: (routeName: string) => any;
}

const ManageSpacesMenu = ({
    className,
    navigateHandler,
}: IManageSpacesMenuProps) => (
    <Dropdown className={`btn-toolbar ${className}`}>
        <Dropdown.Toggle as={Button} variant="primary" size="sm" className="me-2">
            <FontAwesomeIcon icon={faTasks} className="me-2" />Manage Spaces
        </Dropdown.Toggle>
        <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2">
            <Dropdown.Item className="fw-bold" onClick={navigateHandler('/claim-a-space')}>
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Claim a Space
            </Dropdown.Item>
            <Dropdown.Item className="fw-bold" onClick={navigateHandler('/manage-spaces')}>
                <FontAwesomeIcon icon={faPencilRuler} className="me-2" /> Edit Spaces
            </Dropdown.Item>
            {/* <Dropdown.Item className="fw-bold" onClick={navigateHandler('/claim-a-space')}>
                <FontAwesomeIcon icon={faUserShield} className="me-2" /> Manage Access
            </Dropdown.Item> */}

            <Dropdown.Divider />

            <Dropdown.Item className="fw-bold">
                <FontAwesomeIcon icon={faRocket} className="text-danger me-2" /> Upgrade to Pro
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
);

export default ManageSpacesMenu;

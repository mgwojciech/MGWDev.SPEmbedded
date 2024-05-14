import * as React from 'react';
import { IContainerPermission } from '../../model/IContainer';
import { SPContainerService } from '../../services/SPContainerService';
import { GraphPersona } from './../GraphPersona';
import { PeoplePicker } from './../form/PeoplePicker';
import { Button, Radio, RadioGroup } from '@fluentui/react-components';
import { IUser } from 'mgwdev-m365-helpers';

export interface IContainerPermissionsProps {
    containerId: string;
    containerService: SPContainerService;
}

export function ContainerPermissions(props: IContainerPermissionsProps) {
    const [permissions, setPermissions] = React.useState<IContainerPermission[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<IUser>();
    const [selectedUserScope, setSelectedUserScope] = React.useState<string>("reader");

    React.useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const containerPermissions = await props.containerService.getContainerPermissions(props.containerId);
                setPermissions(containerPermissions);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
    }, []);

    return (
        <div>
            <ul>
                {permissions.map((permission, index) => (
                    <li key={index}>
                        <GraphPersona showPresence showSecondaryText id={permission.grantedToV2.user.userPrincipalName} /> {permission.roles.join(', ')}
                    </li>
                ))}
            </ul>
            <PeoplePicker onEntitySelected={(entity) => setSelectedUser(entity[0])} />
            {selectedUser && <div>
                <RadioGroup
                    value={selectedUserScope}
                    onChange={(e, data) => setSelectedUserScope(data.value as string)}
                >
                    <Radio value="reader" label="Reader"></Radio>
                    <Radio value="writer" label="Writer"></Radio>
                    <Radio value="owner" label="Owner"></Radio>
                </RadioGroup>
                <Button onClick={async () => {
                    await props.containerService.addPermissionToContainer(props.containerId, {
                        id: selectedUser.id,
                        displayName: selectedUser.displayName,
                        userPrincipalName: selectedUser.userPrincipalName!,
                        email: selectedUser.userPrincipalName!
                    }, [selectedUserScope]);
                    setSelectedUser(undefined);
                    setSelectedUserScope("reader");
                    const containerPermissions = await props.containerService.getContainerPermissions(props.containerId);
                    setPermissions(containerPermissions);
                 }}>Add permission</Button>
            </div>}
        </div>
    );
};
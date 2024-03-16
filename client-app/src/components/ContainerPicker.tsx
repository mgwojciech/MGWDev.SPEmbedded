import * as React from "react";
import { useSP } from "../context/SPContext";
import { Dropdown, Spinner, Option, Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody, Button } from "@fluentui/react-components";
import { IContainer } from "../model/IContainer";
import { SPContainerService } from "../services/SPContainerService";
import { CreateContainerForm } from "./CreateContainerForm";

export interface IContainerPickerProps {
    onContainerPicked: (containerId?: string) => void;
    containerService?: SPContainerService;
    containerTypeId: string;
}


export function ContainerPicker(props: IContainerPickerProps) {
    const { spClient, siteUrl } = useSP();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [containers, setContainers] = React.useState<IContainer[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);

    const containerService = props.containerService ||  React.useMemo(() => {
        return new SPContainerService(spClient, siteUrl);
    }, [spClient, siteUrl])

    React.useEffect(() => {
        containerService.getContainers(props.containerTypeId).then((containers) => {
            setContainers(containers);
            setIsLoading(false);
        }).catch((error) => {
            console.error(error);
            setIsLoading(false);
        });
    }, [spClient, siteUrl, props.containerTypeId])

    if (isLoading) {
        return <Spinner />
    }
    return <>
        <Drawer open={isDrawerOpen} onOpenChange={(event, { open }) => {
            setIsDrawerOpen(open);
        }}>
            <DrawerHeader>
                <DrawerHeaderTitle>New Container</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
                <CreateContainerForm containerTypeId={props.containerTypeId} containerService={containerService} onContainerCreated={(id, name) => {
                    setContainers([...containers, { id: id, displayName: name }]);
                    setIsDrawerOpen(false);
                }} />
            </DrawerBody>
        </Drawer>
        <Dropdown onOptionSelect={(event, data) => {
            props.onContainerPicked(data.optionValue);
        }} placeholder="Select a container">
            {containers.map((container) => {
                return <Option key={container.id} value={container.id}>{container.displayName}</Option>
            })}
        </Dropdown>
        <Button onClick={() => {
            setIsDrawerOpen(true);
        }}>Create new container</Button>
    </>
}
import * as React from "react";
import { SPContainerService } from "../services/SPContainerService";
import { GraphDriveItemService } from "../services/GraphDriveItemService";
import { Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle, Menu, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger, Toolbar, ToolbarButton, ToolbarDivider, ToolbarGroup } from "@fluentui/react-components";
import { ArrowUpload16Regular, AddSquare16Regular, PersonLock16Regular } from "@fluentui/react-icons";
import { UploadFile } from "./UploadFile";
import { NewFolder } from "./NewFolder";
import { ContainerPermissions } from "./ContainerPermissions";

export interface IContainerToolbarProps {
    containerId: string;
    parentId?: string;
    containerService: SPContainerService;
    driveItemService: GraphDriveItemService;
    selectedDriveItemsId: string[];
    onActionExecuted?: () => void;
}

export const containerActions = [{
    name: "Upload",
    component: (props: IContainerToolbarProps, setIsDialogOpen: (value: boolean) => void) => <UploadFile driveItemService={props.driveItemService} parentId={props.parentId} onUploaded={() => {
        setIsDialogOpen(false);
        props.onActionExecuted && props.onActionExecuted()
    }} />
},
{
    name: "New Folder",
    component: (props: IContainerToolbarProps, setIsDialogOpen: (value: boolean) => void) => <NewFolder parentId={props.parentId} onFolderCreated={() => {
        setIsDialogOpen(false);
        props.onActionExecuted && props.onActionExecuted();
    }} driveItemService={props.driveItemService} />
}, {
    name: "Permissions",
    component: (props: IContainerToolbarProps, setIsDialogOpen: (value: boolean) => void) => <ContainerPermissions containerId={props.containerId} containerService={props.containerService} />
}
]


export function ContainerToolbar(props: IContainerToolbarProps) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [actionName, setActionName] = React.useState("");
    return <>
        <Dialog open={isDialogOpen} onOpenChange={(e, data) => {
            setIsDialogOpen(data.open);
        }}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{actionName}</DialogTitle>
                    <DialogContent>
                        {containerActions.find(a => a.name === actionName)?.component(props, setIsDialogOpen)}
                    </DialogContent>
                </DialogBody>
            </DialogSurface>

        </Dialog>
        <Toolbar>
            <Menu>
                <MenuTrigger>
                    <ToolbarButton aria-label="Add" icon={<AddSquare16Regular />} >Add</ToolbarButton>
                </MenuTrigger>

                <MenuPopover>
                    <MenuList>
                        <MenuItem onClick={() => {
                            setIsDialogOpen(true);
                            setActionName("Upload");
                        }} icon={<ArrowUpload16Regular />}>Upload</MenuItem>
                        <MenuItem onClick={() => {
                            setIsDialogOpen(true);
                            setActionName("New Folder");
                        }} icon={<AddSquare16Regular />} >New folder</MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
            <ToolbarDivider />
            <ToolbarButton onClick={() => {
                setIsDialogOpen(true);
                setActionName("Permissions");
            }} icon={<PersonLock16Regular />}>
                Permissions
            </ToolbarButton>
        </Toolbar>
    </>
}
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle } from "@fluentui/react-components";
import * as React from "react";
import { EditForm } from "./EditForm";
import { Dismiss24Regular, Edit16Regular } from "@fluentui/react-icons"

export interface IEditFormActionProps {
    driveItem: GraphItem;
    onSave?: () => void;
}

export const EditFormAction: React.FunctionComponent<IEditFormActionProps> = (props) => {
    const [isPreviewOpen, setIsPreviewOpen] = React.useState<boolean>(false);
    return <div>
        <Drawer
            size="large"
            title={"Preview"} open={isPreviewOpen} onOpenChange={(_, { open }) => setIsPreviewOpen(open)}>
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            aria-label="Close"
                            title={"Close"}
                            icon={<Dismiss24Regular />}
                            onClick={() => setIsPreviewOpen(false)}
                        />
                    }
                >Edit</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
                <EditForm driveItem={props.driveItem} onSave={()=>{
                    setIsPreviewOpen(false);
                    if(props.onSave){
                        props.onSave();
                    }
                }} />
            </DrawerBody>
        </Drawer>
        <Button title={"Preview"} size="small" icon={<Edit16Regular />} onClick={async () => {
            setIsPreviewOpen(true);
        }} /></div>
}
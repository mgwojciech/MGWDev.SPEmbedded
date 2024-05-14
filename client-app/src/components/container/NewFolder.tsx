import * as React from "react";
import { GraphDriveItemService } from "../services/GraphDriveItemService";
import { Button, Field, Input, Spinner } from "@fluentui/react-components";
import { useContainerFormStyles } from "./CreateContainerForm";

export interface INewFolderProps {
    parentId?: string;
    onFolderCreated?: () => void;
    driveItemService: GraphDriveItemService;
}

export function NewFolder(props: INewFolderProps) {
    const [folderName, setFolderName] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
    const classNames = useContainerFormStyles();

    return <div className={classNames.root}>
        <Field label="Provide name for folder">
            <Input value={folderName} onChange={(event) => {
                setFolderName(event.target.value);
            }} />
        </Field>
        <Button icon={loading ? <Spinner size="tiny" /> : undefined}  appearance="primary" onClick={() => {
            setLoading(true);
            props.driveItemService.createFolder(folderName, props.parentId).then(() => {
                setLoading(false);
                props.onFolderCreated && props.onFolderCreated();
            })
        }}>Create</Button>
    </div>
}
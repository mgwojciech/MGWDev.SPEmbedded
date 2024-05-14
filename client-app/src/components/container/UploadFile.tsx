import { Button, Spinner } from "@fluentui/react-components";
import * as React from "react";
import { GraphDriveItemService } from "../services/GraphDriveItemService";

export interface IUploadFileProps {
    driveItemService: GraphDriveItemService;
    parentId?: string;
    onUploaded?: () => void;
}

export function UploadFile(props: IUploadFileProps) {
    const [fileToUpload, setFileToUpload] = React.useState<File | undefined>(undefined);
    const [loading, setIsLoading] = React.useState<boolean>(false);

    return (
        <div>
            <input id="upload-file-input" type="file" onChange={((event) => {
                if (event.target.files && event.target.files.length > 0) {
                    setFileToUpload(event.target.files[0])
                }
            })} ></input>
            <Button icon={loading ? <Spinner size="tiny" /> : undefined} disabled={loading || !fileToUpload} appearance="primary" onClick={async () => {
                if (fileToUpload) {
                    setIsLoading(true);
                    await props.driveItemService.uploadFile(fileToUpload, props.parentId);
                    setFileToUpload(undefined);
                    document.getElementById("upload-file-input")?.setAttribute("value", "");
                    props.onUploaded && props.onUploaded();
                    setIsLoading(false);
                }
            }}>Upload</Button>
        </div>
    );
}
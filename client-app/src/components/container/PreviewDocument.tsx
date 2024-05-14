import * as React from "react";
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle, Spinner } from "@fluentui/react-components";
import { PreviewLink16Regular, Dismiss24Regular } from '@fluentui/react-icons';
import { useGraph } from "../../context/GraphContext";
import { GraphDriveItemService } from "../../services/GraphDriveItemService";

export interface IPreviewDocumentProps {
    itemId: string;
    driveId: string;
}

export const PreviewDocument: React.FunctionComponent<IPreviewDocumentProps> = (props) => {
    const [previewUrl, setPreviewUrl] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState<boolean>(false);
    const { graphClient } = useGraph();

    const driveService = new GraphDriveItemService(graphClient, props.driveId);
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
                >Preview</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
                <iframe src={previewUrl} style={{ width: "100%", height: "100%", border: "none" }}></iframe>
            </DrawerBody>
        </Drawer>
        <Button title={"Preview"} size="small" icon={loading ? <Spinner size="tiny" /> : <PreviewLink16Regular />} onClick={async () => {
            try {
                setLoading(true);
                const url = await driveService.getPreviewUrl(props.itemId);
                setPreviewUrl(url);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
                setIsPreviewOpen(true);
            }
        }} />
    </div>
}
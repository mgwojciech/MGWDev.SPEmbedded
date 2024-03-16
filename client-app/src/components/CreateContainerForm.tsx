import * as React from "react";
import { SPContainerService } from "../services/SPContainerService";
import { Input, Button, Field, makeStyles, shorthands, tokens, Spinner } from "@fluentui/react-components";

export interface ICreateContainerFormProps {
    onContainerCreated?: (containerId: string, containerName: string) => void;
    containerService: SPContainerService;
    containerTypeId: string;

}


export const useContainerFormStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        ...shorthands.gap(tokens.spacingHorizontalL, tokens.spacingVerticalL),
        maxWidth: "300px",
        ...shorthands.padding(tokens.spacingHorizontalL, tokens.spacingVerticalL)
    }
});

export function CreateContainerForm(props: ICreateContainerFormProps) {
    const [containerName, setContainerName] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
    const classNames = useContainerFormStyles();

    return <div className={classNames.root}>
        <Field label="Provide name for container">
            <Input value={containerName} onChange={(event) => {
                setContainerName(event.target.value);
            }} />
        </Field>
        <Button disabled={!containerName} data-testid="create-container-btn" appearance="primary" icon={loading ? <Spinner size="tiny" /> : undefined}  onClick={() => {
            setLoading(true);
            props.containerService.createContainer(containerName, props.containerTypeId).then((containerId) => {
                setLoading(false);
                props.onContainerCreated && props.onContainerCreated(containerId, containerName);
            })
        }}>Create</Button>
    </div>
}
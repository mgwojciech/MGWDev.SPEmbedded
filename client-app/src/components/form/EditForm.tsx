import { Button, Field, Input } from "@fluentui/react-components";
import * as React from "react";
import { useGraph } from "../../context/GraphContext";
import { GroupPicker } from "../form/GroupPicker";
import { IGraphGroup } from "../../model/IGraphGroup";

export interface IEditFormProps {
    driveItem: GraphItem;
    onSave?: () => void;
}

export const EditForm: React.FunctionComponent<IEditFormProps> = (props) => {
    const [tag, setTag] = React.useState<string>(props.driveItem.listItem.fields?.TestTag || "");
    const [targetAudience, setTargetAudience] = React.useState<string>(props.driveItem.listItem.fields?._ModernAudienceAadObjectIds || "");
    const [selectedGroups, setSelectedGroups] = React.useState<IGraphGroup[]>([]);

    const { graphClient, groupsService } = useGraph();

    const loadGroups = async () => {
        const newSelected: IGraphGroup[] = [];
        await Promise.all(targetAudience.split(";").map(async (id) => {
            const displayName = await groupsService!.getGroupDisplayName(id);
            newSelected.push({ id, displayName });
        }));
        setSelectedGroups(newSelected);
    }

    React.useEffect(() => {
        loadGroups();
    }, [targetAudience])

    return <div>
        <Field label={"Tag"} hint="Assign a tag">
            <Input value={tag} onChange={(e) => setTag(e.target.value)} />
        </Field>
        <Field label={"Audience"} hint="Set an audience">
            <GroupPicker groupsService={groupsService!} onEntitySelected={(groups) => {
                setTargetAudience(groups?.map(g => g.id).join(";"));
            }} value={selectedGroups} />
        </Field>
        <Button appearance="primary" onClick={() => {
            const apiUrl = `https://graph.microsoft.com/beta/drives/${props.driveItem.parentReference.driveId}/items/${props.driveItem.id}/listitem/fields`
            graphClient.patch(apiUrl, {
                body: JSON.stringify({
                    TestTag: tag,
                    _ModernAudienceAadObjectIds: targetAudience
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => {
                console.log("Updated");
                if (props.onSave) {
                    props.onSave();
                }
            })
        }}>Save</Button>
    </div>
}
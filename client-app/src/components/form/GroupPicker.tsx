import * as React from "react";
import { GroupsService } from "../../services/GroupsService";
import { IGraphGroup } from "../../model/IGraphGroup";
import { EntityPicker, IAbstractGraphEntityPickerProps } from "./EntityPicker";

export interface IGroupPickerProps extends Partial<IAbstractGraphEntityPickerProps<IGraphGroup>> {
    groupsService: GroupsService;
}

export const GroupPicker: React.FunctionComponent<IGroupPickerProps> = (props) => {

    return <EntityPicker<IGraphGroup> {...props} onDataRequested={(searchText) => {
        return props.groupsService.getGroups(searchText);
    }} />;
}
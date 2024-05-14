import * as React from "react";
import { IUser, PeopleProvider } from "mgwdev-m365-helpers";
import { EntityPicker, IAbstractGraphEntityPickerProps } from "./EntityPicker";
import { useGraph } from "../../context/GraphContext";

export interface IPeoplePickerProps extends Partial<IAbstractGraphEntityPickerProps<IUser>> {

}


export function PeoplePicker(props: IPeoplePickerProps) {
    const { graphClient } = useGraph();

    const peopleProvider = React.useMemo(() => new PeopleProvider(graphClient, false, true), [graphClient]);

    return <EntityPicker<IUser> {...props} onDataRequested={(searchText)=>{
        peopleProvider.setQuery(searchText);
        return peopleProvider.getData();
    }} />;
}


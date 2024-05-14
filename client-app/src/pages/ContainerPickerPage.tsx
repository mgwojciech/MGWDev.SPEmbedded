import * as React from "react";
import { ContainerPicker } from "../components/ContainerPicker";
import { useNavigate } from "react-router-dom";

export interface IContainerPickerPageProps {

}

const containerTypeId = import.meta.env.VITE_CONTAINER_TYPE_ID;

const ContainerPickerPage: React.FunctionComponent<IContainerPickerPageProps> = (props) => {
    const navigate = useNavigate();
    return <div><ContainerPicker onContainerPicked={(containerId) => {
        navigate("/containers/" + containerId);
    }}
        containerTypeId={containerTypeId}
    />
    </div>
}

export default ContainerPickerPage;
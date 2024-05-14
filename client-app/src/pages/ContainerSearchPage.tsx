import * as React from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useGraph } from "../context/GraphContext";
import { ContainerView } from "../components/container/ContainerView";
import { Button, Input, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useLocalization } from "../context/LocalizationContext";
import { Search24Regular } from "@fluentui/react-icons";

export interface IContainerSearchPageProps {

}

const useSearchPageStyles = makeStyles({
});

function ContainerSearchPage(props: IContainerSearchPageProps) {
    const classNames = useSearchPageStyles();
    const [searchParams] = useSearchParams();
    const { containerId } = useParams();
    const { getLocalization } = useLocalization();
    const [initialQuery, setInitialQuery] = React.useState<string>(searchParams.get("q") || "*");


    return <div>
        
        <ContainerView
            containerId={containerId!}
            searchQuery={initialQuery}
        />
    </div>
}

export default ContainerSearchPage;
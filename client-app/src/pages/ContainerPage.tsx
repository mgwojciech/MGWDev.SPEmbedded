import * as React from "react";
import { ContainerView } from "../components/container/ContainerView";
import { useParams } from "react-router-dom";
import { makeStyles, shorthands, tokens, Text } from "@fluentui/react-components";
import { useGraph } from "../context/GraphContext";
import { IContainer } from "../model/IContainer";
import { AppHeader } from "../components/common/AppHeader";

export interface IContainerPage {

}

const useContainerPageStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        ...shorthands.gap(tokens.spacingHorizontalL, tokens.spacingVerticalL),
        ...shorthands.margin(tokens.spacingHorizontalL, tokens.spacingVerticalL)
    },
    containerTitleWrapper: {

    },
    containerTitle: {
        color: tokens.colorNeutralStrokeOnBrand,
        fontWeight: tokens.fontWeightSemibold,
        fontSize: tokens.fontSizeBase500
    },
    containerViewWrapper: {
        backgroundColor: tokens.colorNeutralBackgroundAlpha,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.padding(tokens.spacingHorizontalL, tokens.spacingVerticalL)
    }
});

function ContainerPage(props: IContainerPage) {
    const { containerId } = useParams();
    const { graphClient } = useGraph();
    const [container, setContainer] = React.useState<{ name: string }>();
    React.useEffect(() => {
        if (containerId) {
            graphClient.get(`/drives/${containerId}`).then((containerResponse) => containerResponse.json()).then((containerData) => {
                setContainer(containerData);
            })
        }
    }, [])

    const classNames = useContainerPageStyles();
    return <div className={classNames.root}>
        <div className={classNames.containerTitleWrapper}>
            <Text as="h2" className={classNames.containerTitle}>{container?.name}</Text>
        </div>
        {containerId && <div className={classNames.containerViewWrapper}><ContainerView key={containerId} containerId={containerId} /></div>}
    </div>
}

export default ContainerPage;
import { Button, Input, Text, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import * as React from "react";
import { useLocalization } from "../../context/LocalizationContext";
import { Settings24Regular, Search24Regular } from "@fluentui/react-icons";
import { GraphPersona } from "../GraphPersona";

export interface IAppHeaderProps {

}

const useHeaderStyles = makeStyles({
    root: {
        backgroundColor: tokens.colorTransparentBackground,
        display: "flex",
        justifyContent: "space-between",
        color: tokens.colorNeutralStrokeOnBrand,
        ...shorthands.padding(tokens.spacingHorizontalL, tokens.spacingVerticalL)
    },
    titleWrapper: {

    },
    title: {
        fontWeight: tokens.fontWeightSemibold,
        fontSize: tokens.fontSizeBase600
    },
    actionButtons: {
        display: "flex",
        ...shorthands.gap(tokens.spacingHorizontalL)
    },
    settingsButton: {
        color: tokens.colorNeutralStrokeOnBrand,
    },
    graphPersona: {
        color: tokens.colorNeutralStrokeOnBrand,
    }
})

export function AppHeader(props: IAppHeaderProps) {
    const classNames = useHeaderStyles();
    const { getLocalization } = useLocalization();
    const [searchText, setSearchText] = React.useState<string>("");
    return <div className={classNames.root}>
        <div className={classNames.titleWrapper}>
            <Text as="h1" className={classNames.title}>{getLocalization("appTitle")}</Text>
        </div>
        
        <div className={classNames.actionButtons}>
            <Button className={classNames.settingsButton} title={getLocalization("commonSettings")} appearance="transparent" icon={<Settings24Regular />} />
            <GraphPersona className={classNames.graphPersona} name=" " />
        </div>
    </div>
}
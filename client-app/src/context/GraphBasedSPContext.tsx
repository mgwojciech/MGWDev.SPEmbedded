import * as React from "react";
import { useGraph } from "./GraphContext";
import { SPContextProvider } from "./SPContext";
import { Spinner } from "@fluentui/react-components";

export function GraphBasedSPContextProvider(props: React.PropsWithChildren<{}>) {
    const { graphClient } = useGraph();
    const [siteUrl, setSiteUrl] = React.useState<string>(localStorage.getItem("siteUrl") || "");
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string>("");

    React.useEffect(() => {
        if (graphClient && !siteUrl) {
            graphClient.get("/sites/root?$select=webUrl").then((response) => {
                response.json().then((json) => {
                    setSiteUrl(json.webUrl);
                    setIsLoading(false);
                    localStorage.setItem("siteUrl", json.webUrl);
                });
            }).catch((error) => {
                setError(error);
                setIsLoading(false);
            });
        }
        else{
            setIsLoading(false);
        }
    }, [graphClient]);

    if (isLoading) {
        return <Spinner />;
    }
    if(error){
        return <div>{error}</div>
    }
    return <SPContextProvider siteUrl={siteUrl}>
        {props.children}
    </SPContextProvider>
}
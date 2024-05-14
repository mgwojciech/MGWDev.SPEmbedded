import * as React from "react";
import { useAuthentication } from "./AuthenticationContext";
import { AuthHttpClient, BatchGraphClient, FetchHttpClient, IHttpClient } from "mgwdev-m365-helpers";
import { GroupsService } from "../services/GroupsService";

export interface IGraphContextProps {
    graphClient: IHttpClient;
    groupsService?: GroupsService;
}

export interface IGraphContextProviderProps extends React.PropsWithChildren<{}> {
    graphClient?: IHttpClient;
    groupsService?: GroupsService;
}
export const GraphContext = React.createContext<IGraphContextProps>({
    graphClient: new FetchHttpClient()
});
export const useGraph = () => React.useContext<IGraphContextProps>(GraphContext);

export const GraphContextProvider = (props: IGraphContextProviderProps) => {
    const { authProvider } = useAuthentication();
    const getGraphClient = () => {
        if (props.graphClient) {
            return props.graphClient;
        }
        else if (authProvider) {
            return new BatchGraphClient(new AuthHttpClient(authProvider, new FetchHttpClient()));
        }
        return undefined;
    }

    const [graphClient, setGraphClient] = React.useState<IHttpClient | undefined>(getGraphClient());
    const groupsService = React.useMemo(() => {
        return props.groupsService || new GroupsService(graphClient!);
    }, [props.groupsService, graphClient]);

    React.useEffect(() => {
        setGraphClient(getGraphClient());
    }, [props.graphClient, authProvider]);

    return (
        graphClient && <GraphContext.Provider value={{
            graphClient: graphClient,
            groupsService: groupsService
        }}>
            {props.children}
        </GraphContext.Provider>
    );
}
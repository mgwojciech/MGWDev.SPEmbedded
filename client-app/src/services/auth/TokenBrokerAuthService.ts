import { FetchHttpClient } from "mgwdev-m365-helpers/lib/dal/http/FetchHttpClient";
import { IHttpClient } from "mgwdev-m365-helpers/lib/dal/http/IHttpClient";
import { IAuthenticationService } from "mgwdev-m365-helpers/lib/services/IAuthenticationService";
import { queueRequest } from "mgwdev-m365-helpers/lib/utils/FunctionUtils";

export class TokenBrokerAuthService implements IAuthenticationService {
    protected resourceTokenMap: Map<string, string> = new Map<string, string>();
    protected backendClient: IHttpClient;
    constructor(backendClient?: IHttpClient) {
            this.backendClient = backendClient || new FetchHttpClient();
    }
    public async getCurrentUser(): Promise<any> {
        let token = await this.getAccessToken();
        let tokenInfo = JSON.parse(atob(token.split(".")[1]));
        return {
            id: tokenInfo.oid,
            displayName: tokenInfo.name
        }
    }

    @queueRequest("getAccessToken-{0}")
    public async getAccessToken(resource?: string): Promise<string> {
        resource = resource || "https://graph.microsoft.com";
        let token = this.resourceTokenMap.get(resource);
        if (!token) {
            let oboTokenResponse = await this.backendClient.get(`/api/TokenBroker?resource=${resource || "https://graph.microsoft.com"}`, {
                redirect: "manual"
            });
            if (oboTokenResponse.status === 500) {
            }
            if (oboTokenResponse.status === 401 || oboTokenResponse.status === 302 || oboTokenResponse.status === 0) {
                if (window.location.href.indexOf("login") === -1)
                    window.location.href = "/login";
            }
            let tokenBody = await oboTokenResponse.json();
            token = tokenBody.accessToken;
            if (token)
                this.resourceTokenMap.set(resource, token);
        }
        if(token){
            return token;
        }
        throw new Error("No token found");
    }
}
import { IHttpClient } from "mgwdev-m365-helpers";
import { IContainer } from "../model/IContainer";

export class SPContainerService {
    constructor(private spClient: IHttpClient, private siteUrl: string) {
    }
    public async getContainers(containerTypeId: string): Promise<IContainer[]> {
        const response = await this.spClient.get(`${this.siteUrl}/_api/v2.1/storageContainers?$filter=containerTypeId eq ${containerTypeId}`);
        const json = await response.json();
        return json.value;
    }

    public async createContainer(containerName: string, containerTypeId: string) {
        const response = await this.spClient.post(`${this.siteUrl}/_api/v2.1/storageContainers`, {
            body: JSON.stringify({
                displayName: containerName,
                containerTypeId: containerTypeId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const json = await response.json();
        return json.id;
    }
}
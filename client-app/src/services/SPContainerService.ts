import { IHttpClient } from "mgwdev-m365-helpers";
import { IContainer, IContainerPermission, IPermissionUser } from "../model/IContainer";

export class SPContainerService {
    constructor(private spClient: IHttpClient, private siteUrl: string) {
    }
    public async getContainers(containerTypeId: string): Promise<IContainer[]> {
        const response = await this.spClient.get(`${this.siteUrl}/_api/v2.1/storageContainers?$filter=containerTypeId eq ${containerTypeId}`);
        if (response.ok) {
            const json = await response.json();
            return json.value;
        }
        throw new Error("Error getting containers: " + response.statusText);
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
    public async getContainerPermissions(containerId: string): Promise<IContainerPermission[]> {
        const response = await this.spClient.get(`${this.siteUrl}/_api/v2.1/storageContainers/${containerId}/permissions`);
        if (response.ok) {
            const json = await response.json();
            return json.value;
        }
        throw new Error("Error getting container permissions: " + response.statusText);
    }
    public async addPermissionToContainer(containerId: string, userId: IPermissionUser, roles: string[]) {
        const response = await this.spClient.post(`${this.siteUrl}/_api/v2.1/storageContainers/${containerId}/permissions`, {
            body: JSON.stringify({
                grantedToV2: {
                    user: userId
                },
                roles: roles
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.ok;
    }
}
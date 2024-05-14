import { IHttpClient } from "mgwdev-m365-helpers";
import { FileHelper } from "../utils/FileHelper";

export class GraphDriveItemService {
    constructor(protected graphClient: IHttpClient, protected driveId: string) {
    }

    public async getDriveItems(parentId?: string): Promise<GraphItem[]> {
        let apiUrl = parentId ? `https://graph.microsoft.com/v1.0/drives/${this.driveId}/items/${parentId}/children` : `https://graph.microsoft.com/v1.0/drives/${this.driveId}/root/children`;
        apiUrl += `?$expand=listitem($expand=fields($select=TestTag,_ModernAudienceAadObjectIds))`;
        const response = await this.graphClient.get(apiUrl);
        const json = await response.json();
        if (!response.ok) {
            throw new Error(json.error.message);
        }
        return json.value;

    }

    public async searchDriveItems(searchQuery: string, parentId?:string): Promise<GraphItem[]> {
        let apiUrl = parentId ? `https://graph.microsoft.com/v1.0/drives/${this.driveId}/items/${parentId}/search(q='${searchQuery}')` 
        : `https://graph.microsoft.com/v1.0/drives/${this.driveId}/root/search(q='${searchQuery}')`;
        const response = await this.graphClient.get(apiUrl);
        const json = await response.json();
        if (!response.ok) {
            throw new Error(json.error.message);
        }
        return json.value;
    }

    public async deleteDriveItem(itemId: string) {
        await this.graphClient.delete(`https://graph.microsoft.com/v1.0/drives/${this.driveId}/items/${itemId}`);
    }

    public async uploadFile(file: File, parentId?: string) {
        var formData = new FormData();
        formData.append("file", file);
        const apiUrl = parentId ? `https://graph.microsoft.com/v1.0/drives/${this.driveId}/items/${parentId}:/${file.name}:/content` : `https://graph.microsoft.com/v1.0/drives/${this.driveId}/root:/${file.name}:/content`;
        await this.graphClient.put(apiUrl, {
            body: await FileHelper.getBinary(file) as any
        });
    }
    public async createFolder(folderName: string, parentId?: string) {
        let apiUrl = parentId ? `https://graph.microsoft.com/v1.0/drives/${this.driveId}/items/${parentId}/children` : `https://graph.microsoft.com/v1.0/drives/${this.driveId}/root/children`;
        apiUrl += `?$expand=listitem($expand=fields($select=TestTag))`;
        await this.graphClient.post(apiUrl, {
            body: JSON.stringify({
                name: folderName,
                folder: {}
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    public async getPreviewUrl(itemId: string): Promise<string> {
        const resp = await this.graphClient.post(`https://graph.microsoft.com/v1.0/drives/${this.driveId}/items/${itemId}/preview`, {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({})
        });
        if (!resp.ok) {
            try {
                const errorMessage = await resp.json();
                const message = errorMessage.error.message;
                throw new Error(message);
            }
            catch (error) {
                throw new Error("An error occurred while getting the preview URL." + error);
            }
        }
        const data = await resp.json();
        return data.getUrl;
    }
}
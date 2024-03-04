import { IHttpClient } from "mgwdev-m365-helpers";
import { FileHelper } from "../utils/FileHelper";

export class GraphDriveItemService{
    constructor(protected graphClient: IHttpClient, protected driveId: string){
    }

    public async getDriveItems(parentId?: string): Promise<GraphItem[]>{
        const apiUrl = parentId ? `https://graph.microsoft.com/v1.0/drives/${this.driveId}/items/${parentId}/children` : `https://graph.microsoft.com/v1.0/drives/${this.driveId}/root/children`;
        const response = await this.graphClient.get(apiUrl);
        const json = await response.json();
        return json.value;
    }

    public async deleteDriveItem(itemId: string){
        await this.graphClient.delete(`https://graph.microsoft.com/v1.0/drives/${this.driveId}/items/${itemId}`);
    }

    public async uploadFile(file: File, parentId?: string){
        var formData = new FormData();
        formData.append("file", file);
        const apiUrl = parentId ? `https://graph.microsoft.com/v1.0/drives/${this.driveId}/items/${parentId}:/${file.name}:/content` : `https://graph.microsoft.com/v1.0/drives/${this.driveId}/root:/${file.name}:/content`;
        await this.graphClient.put(apiUrl, {
            body: await FileHelper.getBinary(file) as any
        });
    }
    public async createFolder(folderName: string, parentId?: string){
        const apiUrl = parentId ? `https://graph.microsoft.com/v1.0/drives/${this.driveId}/items/${parentId}/children` : `https://graph.microsoft.com/v1.0/drives/${this.driveId}/root/children`;
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
}
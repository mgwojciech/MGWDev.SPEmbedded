import { ICacheService, IHttpClient, LocalStorageCacheService } from "mgwdev-m365-helpers";
import { ICacheEntry } from "../dal/CacheDataProvider";
import { IGraphGroup } from "../model/IGraphGroup";

export class GroupsService {
    public storageService: ICacheService;
    protected key: string = "groups-cache-";
    public cacheExpiration: number = 1000 * 60 * 60 * 4;
    constructor(protected graphClient: IHttpClient) {
        this.storageService = new LocalStorageCacheService();
    }

    public async getGroupDisplayName(groupId: string): Promise<string> {
        let groupCache = this.storageService.get<ICacheEntry<IGraphGroup>>(this.key + groupId);
        let group = groupCache?.data;

        if (!group || groupCache.expiration < new Date().getTime()) {
            const groupQuery = `/groups/${groupId}?$select=id,displayName`;
            const groupRequest = await this.graphClient.get(groupQuery);
            const groupResult = await groupRequest.json();
            group = {
                ...groupResult
            }
            this.storageService.set(this.key + groupId, {
                data: group,
                expiration: new Date().getTime() + this.cacheExpiration
            });
        }
        return group.displayName;
    }

    public async getGroups(displayNameQuery?: string): Promise<IGraphGroup[]> {
        let groupQuery = `/groups?$select=id,displayName`;
        if (displayNameQuery) {
            groupQuery += `&$filter=startswith('${displayNameQuery}',displayName)`;
        }
        const groupRequest = await this.graphClient.get(groupQuery);
        const groupResult = await groupRequest.json();
        return groupResult.value;
    }
}
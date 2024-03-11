import { IPagedDataProvider } from "mgwdev-m365-helpers/lib/dal/dataProviders/IPagedDataProvider";
import { ICacheService, LocalStorageCacheService } from "mgwdev-m365-helpers/lib/services/cache";


export interface ICacheEntry<T> {
    data: T;
    expiration: number;
}

export class CacheDataProvider<T> implements IPagedDataProvider<T>{
    public cacheService: ICacheService;
    public pageSize: number;
    constructor(protected dataProvider: IPagedDataProvider<T>, protected cacheKey: string, protected cacheDuration: number) {
        this.cacheService = new LocalStorageCacheService();
        this.pageSize = dataProvider.pageSize;
    }
    public async getData(): Promise<T[]> {
        let cacheData = this.cacheService.get<ICacheEntry<T[]>>(this.cacheKey + this.dataProvider.getQuery());
        if (!cacheData || cacheData.expiration < new Date().getTime()) {
            const data = await this.dataProvider.getData();
            this.cacheService.set(this.cacheKey + this.dataProvider.getQuery(), {
                data: data,
                expiration: new Date(new Date().getTime() + this.cacheDuration)
            });
            this.allItemsCount = this.dataProvider.allItemsCount;
            cacheData = {
                data: data,
                expiration: new Date().getTime() + this.cacheDuration
            }
        }
        return cacheData.data;
    }
    public setQuery(value: string) {
        this.dataProvider.setQuery(value);
    }
    public getQuery(): string {
        return this.dataProvider.getQuery();
    }
    public setOrder(orderBy: string, orderDir: "ASC" | "DESC") {
        this.dataProvider.setOrder(orderBy, orderDir);
    }
    public getNextPage(): Promise<T[]> {
        return this.dataProvider.getNextPage();
    }
    public isNextPageAvailable(): boolean {
        return this.dataProvider.isNextPageAvailable();
    }
    public getPreviousPage(): Promise<T[]> {
        return this.dataProvider.getPreviousPage();
    }
    public isPreviousPageAvailable(): boolean {
        return this.dataProvider.isPreviousPageAvailable();
    }
    public allItemsCount: number = -1;
    public getCurrentPage(): number {
        return this.dataProvider.getCurrentPage();
    }

}
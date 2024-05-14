import { ILocalizationProvider } from "./ILocalizationProvider";

export class LocalizationService implements ILocalizationProvider {
    protected localizationProviders: ILocalizationProvider[];
    constructor(localizationProvider: ILocalizationProvider[] = []) {
        this.localizationProviders = localizationProvider;
    }

    public getLocalization(localizationKey: string): string {
        let localizedString = localizationKey;
        this.localizationProviders.forEach((provider: ILocalizationProvider) => {
            localizedString = provider.getLocalization(localizationKey) || localizedString;
        });
        return localizedString;
    }

    public addLocalizationProvider(localizationProvider: ILocalizationProvider): void {
        this.localizationProviders.push(localizationProvider);
    }
}
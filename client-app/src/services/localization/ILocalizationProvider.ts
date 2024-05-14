export interface ILocalizationProvider{
    /**
     * Returns localized string for given localization key
     * @param localizationKey localization key
     */
    getLocalization(localizationKey: string): string;
}
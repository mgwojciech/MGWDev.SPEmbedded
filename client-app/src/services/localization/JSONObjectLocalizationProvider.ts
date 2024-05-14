import { ILocalizationProvider } from "./ILocalizationProvider";

/**
 * Localization provider that uses JSON object as localization source.
 */
export class JSONObjectLocalizationProvider implements ILocalizationProvider {
    /**
     * Initialized new instance of JSONObjectLocalizationProvider.
     * @param localization JSON object that contains localization strings.
     */
    constructor(public localization: {
        [key: string]: string
    }) {

    }
    
    public getLocalization(localizationKey: string): string {
        return this.localization[localizationKey] || "";
    }

}
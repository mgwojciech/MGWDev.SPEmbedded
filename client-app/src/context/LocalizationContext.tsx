import * as React from "react";
import { ILocalizationProvider, JSONObjectLocalizationProvider, LocalizationService } from "../services/localization";


export const getLocalizationService = async (language: string) => {
    const localization = await import(`../localization/${language}.json`)
    let provider = new JSONObjectLocalizationProvider(localization);

    let localizationProviders: ILocalizationProvider[] = [provider];
    let localizationService = new LocalizationService(localizationProviders);
    return localizationService;
}
export const supportedLanguages = [
    { key: "en-us", text: "English", lcid: 1033 },
    { key: "de-de", text: "German", lcid: 1031 },
    { key: "fr-fr", text: "French", lcid: 1036 },
    { key: "pl-pl", text: "Polski", lcid: 1045 },
];

export interface ILocalizationContextProps {
    getLocalization: (localizationKey: string) => string;
    language: string;
    setLanguage: (language: string) => void;
}

export const LocalizationContext = React.createContext<ILocalizationContextProps>({
    getLocalization: (localizationKey: string) => localizationKey,
    language: "en-us",
    setLanguage: () => { }
});

export const useLocalization = () => React.useContext<ILocalizationContextProps>(LocalizationContext);

export interface ILocalizationProviderProps extends React.PropsWithChildren<{}> {
}

export const LocalizationProvider: React.FunctionComponent<ILocalizationProviderProps> = (props) => {
    const [language, setLanguage] = React.useState<string>("en-us");
    const [localizationService, setLocalizationService] = React.useState<LocalizationService | undefined>(undefined);

    React.useEffect(() => {
        getLocalizationService(language).then((service) => {
            setLocalizationService(service);
        });
    }, [language]);

    const getLocalization = (localizationKey: string) => {
        if (localizationService) {
            return localizationService.getLocalization(localizationKey);
        }
        return localizationKey;
    }

    return <LocalizationContext.Provider value={{ getLocalization, language, setLanguage }}>
        {localizationService && props.children}
    </LocalizationContext.Provider>
}
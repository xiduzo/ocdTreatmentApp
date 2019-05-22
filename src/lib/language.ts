export interface ILanguageCode {
  code: string;
  name: string;
}

export interface ISysOptions {
  systemLanguage: string;
}

export const availableLanguages: Array<ILanguageCode> = [
  {
    code: 'nl',
    name: 'Nederlands (nl)'
  },
  {
    code: 'en',
    name: 'English (en)'
  },
  {
    code: 'de',
    name: 'Deutsch (de)'
  }
];

export const defaultLanguage: string = 'en';

export const sysOptions: ISysOptions = {
  systemLanguage: defaultLanguage
};

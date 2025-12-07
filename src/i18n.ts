import {getRequestConfig} from 'next-intl/server';
 
const locales = ['ka', 'en', 'ru'];
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as any)) {
    locale = 'ka';
  }
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
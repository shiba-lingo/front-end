import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'
import Backend from 'i18next-fs-backend'
import { getOptions } from './settings'

const initI18next = async (lng: string, ns: string) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...getOptions(lng, ns),
      backend: {
        loadPath: `public/locales/{{lng}}/{{ns}}.json`,
      }
    })
  return i18nInstance
}

export async function useTranslation(lng: string, ns: string = 'common') {
  const i18n = await initI18next(lng, ns)
  return {
    t: i18n.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n
  }
}
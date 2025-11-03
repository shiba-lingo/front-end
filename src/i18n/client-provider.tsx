"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance, Resource } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import { useState } from "react";
import { getOptions } from "./settings";

function initI18next(lng: string, ns: string, resources: Resource) {
  const i18nInstance = createInstance();
  i18nInstance.use(initReactI18next).init({
    ...getOptions(lng, ns),
    resources,
    lng,
    ns,
  });
  return i18nInstance;
}

export default function TranslationsProvider({
  children,
  lng,
  ns,
  resources,
}: {
  children: React.ReactNode;
  lng: string;
  ns: string;
  resources: Resource;
}) {
  const [i18n] = useState(() => initI18next(lng, ns, resources));

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

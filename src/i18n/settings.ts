export const fallbackLng = "en";
export const locales = [fallbackLng, "de", "zh"];
export const defaultNS = "common";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true, // in develop mode debug
    supportedLngs: locales,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}

/**
 * Liste statique des indicatifs téléphoniques internationaux.
 * Triée par usage courant (zones Hora) puis alphabétique.
 * Emoji du drapeau via code ISO-2 (fonctionne natif sur la plupart des OS).
 */
export type CountryCode = {
  iso: string; // code ISO-2 (ex: "CI", "FR", "US")
  name: string;
  dial: string; // indicatif sans le +, ex "225"
  flag: string; // emoji
};

function flag(iso: string): string {
  return iso
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

/** Principaux indicatifs — étendre au besoin. */
export const COUNTRY_CODES: CountryCode[] = [
  { iso: "CI", name: "Côte d'Ivoire", dial: "225", flag: flag("CI") },
  { iso: "FR", name: "France", dial: "33", flag: flag("FR") },
  { iso: "BE", name: "Belgique", dial: "32", flag: flag("BE") },
  { iso: "CH", name: "Suisse", dial: "41", flag: flag("CH") },
  { iso: "CA", name: "Canada", dial: "1", flag: flag("CA") },
  { iso: "US", name: "États-Unis", dial: "1", flag: flag("US") },
  { iso: "GB", name: "Royaume-Uni", dial: "44", flag: flag("GB") },
  { iso: "DE", name: "Allemagne", dial: "49", flag: flag("DE") },
  { iso: "ES", name: "Espagne", dial: "34", flag: flag("ES") },
  { iso: "IT", name: "Italie", dial: "39", flag: flag("IT") },
  { iso: "PT", name: "Portugal", dial: "351", flag: flag("PT") },
  { iso: "NL", name: "Pays-Bas", dial: "31", flag: flag("NL") },
  { iso: "SN", name: "Sénégal", dial: "221", flag: flag("SN") },
  { iso: "ML", name: "Mali", dial: "223", flag: flag("ML") },
  { iso: "BF", name: "Burkina Faso", dial: "226", flag: flag("BF") },
  { iso: "NE", name: "Niger", dial: "227", flag: flag("NE") },
  { iso: "TG", name: "Togo", dial: "228", flag: flag("TG") },
  { iso: "BJ", name: "Bénin", dial: "229", flag: flag("BJ") },
  { iso: "GH", name: "Ghana", dial: "233", flag: flag("GH") },
  { iso: "NG", name: "Nigeria", dial: "234", flag: flag("NG") },
  { iso: "CM", name: "Cameroun", dial: "237", flag: flag("CM") },
  { iso: "GA", name: "Gabon", dial: "241", flag: flag("GA") },
  { iso: "CG", name: "Congo", dial: "242", flag: flag("CG") },
  { iso: "CD", name: "RD Congo", dial: "243", flag: flag("CD") },
  { iso: "AO", name: "Angola", dial: "244", flag: flag("AO") },
  { iso: "MA", name: "Maroc", dial: "212", flag: flag("MA") },
  { iso: "DZ", name: "Algérie", dial: "213", flag: flag("DZ") },
  { iso: "TN", name: "Tunisie", dial: "216", flag: flag("TN") },
  { iso: "EG", name: "Égypte", dial: "20", flag: flag("EG") },
  { iso: "ZA", name: "Afrique du Sud", dial: "27", flag: flag("ZA") },
  { iso: "KE", name: "Kenya", dial: "254", flag: flag("KE") },
  { iso: "RW", name: "Rwanda", dial: "250", flag: flag("RW") },
  { iso: "BR", name: "Brésil", dial: "55", flag: flag("BR") },
  { iso: "MX", name: "Mexique", dial: "52", flag: flag("MX") },
  { iso: "AR", name: "Argentine", dial: "54", flag: flag("AR") },
  { iso: "IN", name: "Inde", dial: "91", flag: flag("IN") },
  { iso: "CN", name: "Chine", dial: "86", flag: flag("CN") },
  { iso: "JP", name: "Japon", dial: "81", flag: flag("JP") },
  { iso: "KR", name: "Corée du Sud", dial: "82", flag: flag("KR") },
  { iso: "AU", name: "Australie", dial: "61", flag: flag("AU") },
  { iso: "TR", name: "Turquie", dial: "90", flag: flag("TR") },
  { iso: "SA", name: "Arabie Saoudite", dial: "966", flag: flag("SA") },
  { iso: "AE", name: "Émirats arabes unis", dial: "971", flag: flag("AE") },
];

/** Par défaut : Côte d'Ivoire (usage principal Hora). */
export const DEFAULT_COUNTRY = COUNTRY_CODES[0];

export function findCountryByIso(iso: string): CountryCode | undefined {
  return COUNTRY_CODES.find((c) => c.iso === iso);
}

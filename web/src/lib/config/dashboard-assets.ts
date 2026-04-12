/**
 * Chemins publics alignés sur Flutter `app_assets.dart` / dossier `assets/image accueil/`.
 * Copier les PNG depuis le projet mobile vers `public/assets/image accueil/` sans renommer.
 */
const BASE = "/assets/image accueil";

export function dashboardAssetUrl(fileName: string): string {
  return encodeURI(`${BASE}/${fileName}`);
}

export const dashboardAssets = {
  profileAvatar: dashboardAssetUrl("finance-guy-avatar_vhop.png"),
  shortcutSecurity: dashboardAssetUrl("security-on_3ykb.png"),
  shortcutDevices: dashboardAssetUrl("notifications_uvwd.png"),
  shortcutHelp: dashboardAssetUrl("questions_52ic.png"),
  shortcutProfile: dashboardAssetUrl("Avatars_xsfb.png"),
} as const;

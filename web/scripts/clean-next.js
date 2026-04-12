/**
 * Supprime le dossier `.next` (cache Next.js).
 * À lancer en cas d'ENOENT sur server-reference-manifest, _buildManifest.js.tmp, etc.
 */
import fs from "node:fs";
import path from "node:path";

const nextDir = path.join(process.cwd(), ".next");
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("[clean-next] Dossier .next supprimé.");
} else {
  console.log("[clean-next] Aucun dossier .next à supprimer.");
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidentialité",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">Politique de confidentialité</h1>
      <p className="mt-4 text-sm leading-relaxed text-secondary">
        Texte à compléter selon la conformité applicable (RGPD, etc.). Placeholder statique
        pour la V1 web.
      </p>
    </div>
  );
}

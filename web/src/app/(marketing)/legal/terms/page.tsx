import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d’utilisation",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">Conditions d’utilisation</h1>
      <p className="mt-4 text-sm leading-relaxed text-secondary">
        Texte juridique à fournir par l’équipe produit ou à connecter à un CMS. Cette page
        est un emplacement statique conforme à la spec (§5.1).
      </p>
    </div>
  );
}

import { PinRecoveryView } from "@/components/features/recovery/pin-recovery-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Récupération PIN",
  description: "Demandez un lien de réinitialisation de PIN et confirmez le nouveau code.",
};

export default function PinRecoveryPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
        Récupération PIN
      </h1>
      <p className="mt-1 text-[11px] text-secondary">
        Demandez un code de réinitialisation puis confirmez votre nouveau PIN.
      </p>
      <div className="mt-3">
        <PinRecoveryView />
      </div>
    </>
  );
}

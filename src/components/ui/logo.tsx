import Image from "next/image";
import Link from "next/link";

export function Logo({
  className = "",
  href = "/",
  disableLink = false,
  showLabel = true,
}: {
  className?: string;
  /** Sur l'accueil connecté, pointer vers `/dashboard` pour rester dans l'app. */
  href?: string;
  /** Désactiver le Link wrapper (utilisé quand Logo est déjà à l'intérieur d'un Link) */
  disableLink?: boolean;
  /** Masquer le libellé « OTP Hora » (pour usages icon-only) */
  showLabel?: boolean;
}) {
  const content = (
    <>
      <Image
        src="/assets/image%20app/Hora-Logo.png"
        alt="OTP Hora"
        width={194}
        height={154}
        priority
        className="h-9 w-auto"
      />
      {showLabel && <span className="text-lg tracking-tight">OTP Hora</span>}
    </>
  );

  const contentClasses = `inline-flex items-center gap-2 font-semibold text-foreground ${className}`;

  if (disableLink) {
    return <div className={contentClasses}>{content}</div>;
  }

  return (
    <Link href={href} className={contentClasses}>
      {content}
    </Link>
  );
}

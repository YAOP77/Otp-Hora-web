import { Button } from "@/components/ui/button";
import {
  IconBriefcase,
  IconBuilding,
  IconChevronDown,
  IconEye,
  IconLink,
  IconRefresh,
  IconShieldCheck,
  IconSmartphone,
  IconUsers,
} from "@/components/features/marketing/marketing-icons";
import {
  AnimateOnScroll,
  FaqItem,
  ImageSwap,
  StepsMobileCarousel,
} from "@/components/features/marketing/landing-animate";
import Link from "next/link";

const features = [
  {
    icon: IconShieldCheck,
    title: "Validation utilisateur",
    text: "Des demandes d'authentification claires : vous décidez quand approuver ou refuser une action sensible.",
  },
  {
    icon: IconSmartphone,
    title: "Même sécurité que le mobile",
    text: "Une expérience web alignée sur l'app Flutter : session, compte et règles métier identiques.",
  },
  {
    icon: IconUsers,
    title: "Contacts et appareils",
    text: "Centralisez vos moyens de contact et le suivi de vos appareils depuis un espace sobre.",
  },
  {
    icon: IconBuilding,
    title: "Liaisons entreprise",
    text: "Connectez-vous aux organisations partenaires lorsque votre activité le nécessite.",
  },
] as const;

const enterpriseBullets = [
  { icon: IconLink, label: "Demandes de liaison contrôlées" },
  { icon: IconEye, label: "Visibilité sur vos autorisations" },
  { icon: IconBriefcase, label: "Interface adaptée au contexte professionnel" },
  { icon: IconRefresh, label: "Évolutif selon les mises à jour de l'API" },
] as const;

const faqItems = [
  {
    q: "Qu'est-ce qu'OTP Hora ?",
    a: "OTP Hora est une plateforme d'authentification et de gestion de compte : vous validez les actions importantes et gérez vos contacts, appareils et liens avec des entreprises partenaires.",
  },
  {
    q: "Le web utilise-t-il le même backend que l'application mobile ?",
    a: "Oui. Les endpoints et les règles métier sont alignés sur le client Flutter pour éviter les écarts fonctionnels.",
  },
  {
    q: "Comment me connecter ?",
    a: "Utilisez votre numéro de téléphone et votre code PIN, comme sur l'application, depuis la page Connexion.",
  },
  {
    q: "Où trouver les mentions légales ?",
    a: "Les conditions d'utilisation et la politique de confidentialité sont disponibles en pied de page.",
  },
] as const;

const staggerDelays = ["0", "120", "240", "360"] as const;

const AVATAR_COLORS = ["#0B3A6E", "#1869cc", "#2e7d32", "#c62828", "#e67e22"] as const;
const AVATAR_INITIALS = ["PA", "KM", "SB", "DL", "JT"] as const;

export function LandingHome() {
  return (
    <main className="flex-1">
      <div className="relative" style={{ overflow: "clip" }}>

        {/* ── SECTION 1 : Hero — fond sombre neutre + vidéo ────── */}
        <section
          className="sticky top-0 z-[1] h-screen overflow-hidden bg-[#0a0a0a]"
          aria-labelledby="landing-hero-title"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 83%, 82% 89%, 66% 95%, 50% 100%, 34% 95%, 18% 89%, 0 83%)",
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            aria-hidden
          >
            <source
              src="/assets/image%20accueil/Hora-demo-hero.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/85" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
            <p className="landing-hero-label text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Plateforme OTP Hora
            </p>

            <h1
              id="landing-hero-title"
              className="landing-hero-title mx-auto mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.09]"
            >
              Validez, connectez et pilotez votre compte avec la même exigence que sur mobile
            </h1>

            <p className="landing-hero-sub mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              Une interface web sobre et accessible pour votre authentification,
              vos appareils, vos contacts et vos liaisons entreprise.
            </p>

            <div className="landing-hero-cta mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex min-h-11 min-w-[180px] items-center justify-center rounded-lg border border-white/25 bg-white/[0.07] px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/[0.15] hover:shadow-[0_0_28px_rgba(255,255,255,0.1)]"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-11 min-w-[180px] items-center justify-center rounded-lg border border-white/25 bg-white/[0.07] px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/[0.15] hover:shadow-[0_0_28px_rgba(255,255,255,0.1)]"
              >
                Créer un compte
              </Link>
            </div>
          </div>

          <div
            className="landing-scroll-hint absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-white/30"
            style={{ bottom: "18%" }}
          >
            <span className="text-[9px] font-medium uppercase tracking-[0.22em]">Défiler</span>
            <IconChevronDown className="size-3.5 animate-bounce" />
          </div>
        </section>

        {/* ── Wrapper sections 2+ — couvrent le hero ───────────── */}
        <div className="relative z-[2] -mt-[16vh] bg-background">

          {/* ── SECTION 2 : Avantages — clip-path top + carrés vectors ─ */}
          <section
            id="features"
            className="relative border-b border-border/30 bg-gradient-to-b from-primary/[0.04] via-background to-background pb-14 pt-24 shadow-[0_-10px_52px_rgba(0,0,0,0.13)] sm:pb-18 sm:pt-28"
            aria-labelledby="landing-features-title"
            style={{
              clipPath: "polygon(0 6%, 50% 0, 100% 6%, 100% 100%, 0 100%)",
            }}
          >
            {/* Vectors décoratifs : 3 carrés dispersés */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <span
                className="absolute left-[6%] top-[18%] block size-16 rounded-md border-2 border-primary/20"
                style={{ transform: "rotate(14deg)" }}
              />
              <span
                className="absolute right-[8%] top-[32%] block size-10 rounded-md border-2 border-primary/25"
                style={{ transform: "rotate(-22deg)" }}
              />
              <span
                className="absolute bottom-[14%] left-[42%] block size-12 rounded-md border-2 border-primary/15"
                style={{ transform: "rotate(8deg)" }}
              />
            </div>

            <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
              <AnimateOnScroll animation="title">
                <h2
                  id="landing-features-title"
                  className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl lg:leading-[1.12]"
                >
                  Tout ce dont vous avez
                  <br />
                  besoin pour vous connecter
                  <br />
                  <span className="text-primary">en toute confiance</span>
                </h2>
              </AnimateOnScroll>

              <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {features.map(({ icon: Icon, title, text }, i) => (
                  <AnimateOnScroll
                    key={title}
                    animation="fade-up"
                    delay={staggerDelays[i]}
                  >
                    <div className="flex flex-col gap-2.5">
                      <Icon className="size-6 text-primary" />
                      <h3 className="text-sm font-bold text-foreground">{title}</h3>
                      <p className="text-sm leading-relaxed text-secondary">{text}</p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </section>

          {/* ── SECTION 3 : Commencer maintenant — bleu foncé + dots + card mère ── */}
          <section
            id="start"
            className="landing-vector-dots-blue relative bg-[#061C38] py-20 sm:py-24"
            aria-labelledby="landing-start-title"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              {/* Card mère blanche (coins droits) qui contient images + texte */}
              <div className="relative mx-auto bg-white px-6 py-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] dark:bg-zinc-100 sm:px-10 sm:py-7 lg:px-12 lg:py-8">
                <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-10">

                  <div className="w-full lg:flex-[1.2]">
                    <ImageSwap />
                  </div>

                  <div className="flex flex-col items-start gap-4 lg:max-w-sm">
                    <AnimateOnScroll animation="title">
                      <h2
                        id="landing-start-title"
                        className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl"
                      >
                        Commencer <span className="text-primary">maintenant</span>
                      </h2>
                    </AnimateOnScroll>

                    <AnimateOnScroll animation="fade-up" delay="200">
                      <p className="text-sm leading-relaxed text-zinc-600">
                        Accédez à votre espace personnel, gérez vos appareils et
                        vos liaisons entreprise en quelques secondes depuis votre
                        navigateur.
                      </p>
                    </AnimateOnScroll>

                    <AnimateOnScroll animation="fade-up" delay="360">
                      <Button
                        asChild
                        className="mt-1 min-h-10 bg-primary px-6 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-px hover:bg-primary/90"
                      >
                        <Link href="/login">Découvrir</Link>
                      </Button>
                    </AnimateOnScroll>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 4 : Télécharger l'application — blanc + iPhone ── */}
          <section
            id="download"
            className="landing-vector-subtle border-y border-border/30 bg-white py-14 dark:bg-zinc-950 sm:py-18"
            aria-labelledby="landing-download-title"
          >
            <div className="mx-auto max-w-5xl px-4 sm:px-6">

              <div className="mb-10 text-center">
                <AnimateOnScroll animation="title">
                  <h2
                    id="landing-download-title"
                    className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
                  >
                    Téléchargez l&apos;application
                    <br />
                    <span className="text-primary">et inscrivez-vous</span>
                  </h2>
                </AnimateOnScroll>
                <AnimateOnScroll animation="fade-up" delay="200">
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-secondary">
                    Quatre étapes simples pour rejoindre la plateforme OTP Hora.
                  </p>
                </AnimateOnScroll>
              </div>

              <StepsMobileCarousel />
            </div>
          </section>

          {/* ── SECTION 5 : Usage professionnel — sombre + grille vector ── */}
          <section
            id="about"
            className="landing-vector-bg relative overflow-hidden py-14 sm:py-18"
            aria-labelledby="landing-pro-title"
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="landing-orb-a absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-primary/20 blur-[90px]" />
              <div className="landing-orb-b absolute -right-16 top-1/2 h-72 w-72 rounded-full bg-[#1869cc]/25 blur-[75px]" />
              <div className="landing-orb-c absolute bottom-4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-[80px]" />
            </div>

            <div className="relative mx-auto max-w-5xl px-4">
              <AnimateOnScroll animation="title">
                <h2
                  id="landing-pro-title"
                  className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl"
                >
                  Pensé pour un usage professionnel
                </h2>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-up" delay="200">
                <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white/55">
                  Sobriété visuelle, lisibilité et parcours clairs — en accord avec la vision produit OTP Hora.
                </p>
              </AnimateOnScroll>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {enterpriseBullets.map(({ icon: Icon, label }, i) => (
                  <li key={label}>
                    <AnimateOnScroll animation="fade-up" delay={staggerDelays[i]}>
                      <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/60 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur-sm">
                        <Icon className="size-5 shrink-0 text-[#7dafe6]" aria-hidden />
                        {label}
                      </div>
                    </AnimateOnScroll>
                  </li>
                ))}
              </ul>

              {/* Avatars utilisateurs + compteur */}
              <AnimateOnScroll animation="fade-up" delay="480" className="mt-10 flex items-center justify-center gap-4">
                <div className="flex -space-x-2.5">
                  {AVATAR_COLORS.map((bg, i) => (
                    <span
                      key={i}
                      className="flex size-10 items-center justify-center rounded-full border-[2.5px] border-[#030c18] text-[10px] font-bold text-white"
                      style={{ backgroundColor: bg, zIndex: AVATAR_COLORS.length - i }}
                      aria-hidden
                    >
                      {AVATAR_INITIALS[i]}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-lg font-extrabold tracking-tight text-white">+2 500</p>
                  <p className="text-xs text-white/55">utilisateurs compte lié sur Hora</p>
                </div>
              </AnimateOnScroll>
            </div>
          </section>

          {/* ── FAQ — fond blanc + vector minimaliste ──────────── */}
          <section
            id="faq"
            className="landing-vector-faq bg-white py-12 dark:bg-zinc-950 sm:py-16"
            aria-labelledby="landing-faq-title"
          >
            <div className="mx-auto max-w-2xl px-4">
              <AnimateOnScroll animation="title">
                <h2
                  id="landing-faq-title"
                  className="text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl"
                >
                  Questions fréquentes
                </h2>
              </AnimateOnScroll>
              <div className="mt-8 space-y-2.5">
                {faqItems.map((item, i) => (
                  <AnimateOnScroll key={item.q} animation="fade-up" delay={staggerDelays[i]}>
                    <FaqItem q={item.q} a={item.a} />
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA final — bleu foncé + ballons vector ─────────── */}
          <section
            className="landing-cta-blue relative overflow-hidden bg-[#061C38] py-14 text-white sm:py-18"
            aria-labelledby="landing-final-cta"
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="landing-orb-a absolute -left-32 top-1/4 h-[26rem] w-[26rem] rounded-full bg-[#020b18]/80 blur-[110px]" />
              <div className="landing-orb-b absolute -right-24 top-1/3 h-[22rem] w-[22rem] rounded-full bg-[#020b18]/70 blur-[100px]" />
              <div className="landing-orb-c absolute -bottom-16 left-1/3 h-[20rem] w-[20rem] rounded-full bg-[#031426]/80 blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-2xl px-4 text-center">
              <AnimateOnScroll animation="title">
                <h2
                  id="landing-final-cta"
                  className="text-xl font-bold tracking-tight sm:text-2xl"
                >
                  Prêt à utiliser OTP Hora sur le web ?
                </h2>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-up" delay="200">
                <p className="mt-2.5 text-sm leading-relaxed text-white/85">
                  Connectez-vous ou créez un compte pour accéder au tableau de bord et à vos paramètres.
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-up" delay="360" className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  variant="secondary"
                  className="min-h-10 min-w-[170px] border-0 bg-white text-sm font-bold text-primary hover:bg-white/95"
                >
                  <Link href="/register">Créer un compte</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="min-h-10 min-w-[170px] border border-white/40 bg-transparent text-sm font-bold text-white hover:bg-white/10"
                >
                  <Link href="/login">J&apos;ai déjà un compte</Link>
                </Button>
              </AnimateOnScroll>
            </div>
          </section>

        </div>{/* end z-[2] wrapper */}
      </div>{/* end outer relative */}
    </main>
  );
}

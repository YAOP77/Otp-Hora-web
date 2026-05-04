"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IconChevronDown } from "./marketing-icons";

/* ─── AnimateOnScroll ─────────────────────────────────────────── */

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "title" | "icon-pop";
  delay?: string;
  threshold?: number;
}

export function AnimateOnScroll({
  children,
  className,
  animation = "fade-up",
  delay,
  threshold = 0.18,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          observer.unobserve(el);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      data-animate={animation}
      data-visible="false"
      {...(delay !== undefined ? { "data-delay": delay } : {})}
    >
      {children}
    </div>
  );
}

/* ─── ImageSwap — 2 visuels nus, empilés en quinconce ──────────
   Pas de carte qui les enveloppe : juste les images avec ombre douce.
   Position de repos différente pour chacune (haut-gauche / bas-droite),
   donc l'animation ne les fait jamais se croiser : seul le z-index,
   le scale et un léger lift changent — l'une « passe derrière » l'autre. */

export function ImageSwap() {
  const [front, setFront] = useState<1 | 2>(1);

  useEffect(() => {
    const id = setInterval(() => {
      setFront((p) => (p === 1 ? 2 : 1));
    }, 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative mx-auto w-full max-w-[560px] select-none"
      style={{ aspectRatio: "5/4" }}
      aria-hidden
    >
      <DeckImage
        src="/assets/image%20accueil/Sct3-img1.png"
        position="top-left"
        active={front === 1}
      />
      <DeckImage
        src="/assets/image%20accueil/Sct3-img2.png"
        position="bottom-right"
        active={front === 2}
      />
    </div>
  );
}

function DeckImage({
  src,
  position,
  active,
}: {
  src: string;
  position: "top-left" | "bottom-right";
  active: boolean;
}) {
  const dur = "1s cubic-bezier(0.65, 0, 0.35, 1)";
  const isTopLeft = position === "top-left";

  // Coordonnées de repos distinctes : aucune carte ne croise l'autre.
  const baseStyle: React.CSSProperties = isTopLeft
    ? { top: "0%", left: "0%", width: "85%", transform: "rotate(-2.5deg)" }
    : { top: "26%", left: "15%", width: "85%", transform: "rotate(2deg)" };

  const activeTransform = isTopLeft
    ? "translate(-1.5%, -3%) rotate(-2.5deg) scale(1.04)"
    : "translate(1.5%, 3%) rotate(2deg) scale(1.04)";
  const restTransform = isTopLeft
    ? "translate(0%, 0%) rotate(-2.5deg) scale(1)"
    : "translate(0%, 0%) rotate(2deg) scale(1)";

  return (
    <Image
      src={src}
      alt=""
      width={1341}
      height={542}
      sizes="(min-width: 1024px) 540px, 90vw"
      className="absolute h-auto"
      style={{
        ...baseStyle,
        transform: active ? activeTransform : restTransform,
        zIndex: active ? 30 : 10,
        filter: active
          ? "drop-shadow(0 28px 50px rgba(0,0,0,0.32)) drop-shadow(0 8px 16px rgba(0,0,0,0.18))"
          : "drop-shadow(0 14px 28px rgba(0,0,0,0.22)) brightness(0.92)",
        opacity: active ? 1 : 0.92,
        transition: `transform ${dur}, filter ${dur}, opacity ${dur}, z-index 0s linear ${active ? "0s" : "0.5s"}`,
        willChange: "transform, opacity",
      }}
    />
  );
}

/* ─── FaqItem — accordéon fluide ─────────────────────────────── */

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-background transition-shadow duration-300 ${open ? "shadow-md" : "shadow-sm"}`}
    >
      <button
        className="flex w-full items-center justify-between gap-2 px-4 py-4 text-left font-semibold text-foreground"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {q}
        <IconChevronDown
          className="size-5 shrink-0 text-secondary"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </button>
      <div
        ref={bodyRef}
        style={{
          maxHeight: open
            ? `${(bodyRef.current?.scrollHeight ?? 300) + 8}px`
            : "0px",
          overflow: "hidden",
          transition: "max-height 0.48s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <p className="border-t border-border/80 px-4 pb-4 pt-3 text-sm leading-relaxed text-secondary">
          {a}
        </p>
      </div>
    </div>
  );
}

/* ─── StepsMobileCarousel — étapes + iPhone défilant ─────────── */

const STEPS = [
  {
    num: 1,
    title: "Choisissez votre profil",
    desc: "Indiquez si vous êtes utilisateur ou entreprise, puis saisissez votre numéro de téléphone.",
  },
  {
    num: 2,
    title: "Vos informations personnelles",
    desc: "Entrez votre prénom et votre nom pour compléter votre profil.",
  },
  {
    num: 3,
    title: "Créez votre code PIN",
    desc: "Choisissez un code PIN sécurisé — il vous servira à vous connecter à chaque visite.",
  },
  {
    num: 4,
    title: "Vous êtes prêt·e !",
    desc: "Vous êtes automatiquement connecté·e et accédez directement à votre espace personnel.",
  },
] as const;

const PHONE_IMAGES = [
  "/assets/Image%20mobile/Demo-0.jpeg",
  "/assets/Image%20mobile/Demo-1.jpeg",
  "/assets/Image%20mobile/Demo-2.jpeg",
  "/assets/Image%20mobile/Demo-3.jpeg",
  "/assets/Image%20mobile/Demo-4.jpeg",
  "/assets/Image%20mobile/Demo-5.jpeg",
] as const;

const STEP_DELAYS = ["0", "120", "240", "360"] as const;
const PHONE_INTERVAL_MS = 3000;

export function StepsMobileCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((p) => (p + 1) % PHONE_IMAGES.length);
    }, PHONE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">

      {/* Étapes — gauche */}
      <div className="flex w-full flex-col gap-5 lg:max-w-[420px]">
        {STEPS.map((step, i) => (
          <AnimateOnScroll
            key={i}
            animation="fade-up"
            delay={STEP_DELAYS[i]}
            className="flex items-start gap-4"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md shadow-primary/30">
              {step.num}
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">{step.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-secondary">{step.desc}</p>
            </div>
          </AnimateOnScroll>
        ))}

        {/* Boutons stores — sous l'étape 4, à gauche */}
        <AnimateOnScroll
          animation="fade-up"
          delay="440"
          className="mt-2 flex flex-wrap items-center gap-3 pl-[52px]"
        >
          <a
            href="#"
            aria-label="Télécharger sur l'App Store"
            className="transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
          >
            <Image
              src="/assets/image%20accueil/Button-download-ios.jpg"
              alt="Télécharger sur l'App Store"
              width={148}
              height={48}
              className="rounded-xl shadow-md"
            />
          </a>
          <a
            href="#"
            aria-label="Télécharger sur Google Play"
            className="transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
          >
            <Image
              src="/assets/image%20accueil/Button-download-android.jpg"
              alt="Télécharger sur Google Play"
              width={148}
              height={48}
              className="rounded-xl shadow-md"
            />
          </a>
        </AnimateOnScroll>
      </div>

      {/* iPhone — droite, défilement automatique droite → gauche */}
      <div className="relative mx-auto shrink-0">
        <IphoneFrame>
          <div className="relative h-full w-full overflow-hidden">
            <div
              className="flex h-full"
              style={{
                width: `${PHONE_IMAGES.length * 100}%`,
                transform: `translateX(-${index * (100 / PHONE_IMAGES.length)}%)`,
                transition: "transform 0.95s cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            >
              {PHONE_IMAGES.map((src, i) => (
                <div
                  key={src}
                  className="relative h-full"
                  style={{ width: `${100 / PHONE_IMAGES.length}%` }}
                >
                  <Image
                    src={src}
                    alt={`Aperçu ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="260px"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {/* Indicateurs de pagination */}
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5">
              {PHONE_IMAGES.map((_, i) => (
                <span
                  key={i}
                  className="h-1 rounded-full bg-white/70 transition-all duration-500"
                  style={{
                    width: i === index ? 18 : 6,
                    opacity: i === index ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
          </div>
        </IphoneFrame>
      </div>
    </div>
  );
}

/* ─── Cadre iPhone réaliste (notch + bouton) ─────────────────── */

function IphoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        width: 270,
        height: 555,
        filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.35))",
      }}
    >
      {/* Coque */}
      <div
        className="absolute inset-0 rounded-[44px] bg-zinc-900"
        style={{
          padding: 12,
          boxShadow:
            "inset 0 0 0 2px rgba(255,255,255,0.07), 0 4px 18px rgba(0,0,0,0.3)",
        }}
      >
        {/* Bordure intérieure */}
        <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-black">
          {children}

          {/* Notch (Dynamic Island simplifié) */}
          <div
            className="pointer-events-none absolute left-1/2 top-2 z-30 h-[22px] w-[88px] -translate-x-1/2 rounded-full bg-black"
            aria-hidden
          />
          {/* Reflet écran */}
          <div
            className="pointer-events-none absolute inset-0 z-20 rounded-[34px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.06) 100%)",
            }}
            aria-hidden
          />
        </div>
      </div>

      {/* Boutons latéraux */}
      <span className="absolute left-[-3px] top-[110px] h-8 w-[3px] rounded-l-md bg-zinc-800" aria-hidden />
      <span className="absolute left-[-3px] top-[160px] h-12 w-[3px] rounded-l-md bg-zinc-800" aria-hidden />
      <span className="absolute left-[-3px] top-[220px] h-12 w-[3px] rounded-l-md bg-zinc-800" aria-hidden />
      <span className="absolute right-[-3px] top-[140px] h-16 w-[3px] rounded-r-md bg-zinc-800" aria-hidden />
    </div>
  );
}

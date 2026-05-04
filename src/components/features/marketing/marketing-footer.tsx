"use client";

import { IconArrowLeft } from "@/components/features/marketing/marketing-icons";
import { SUB_NAV_LINKS } from "@/components/features/marketing/marketing-header";
import { useI18n } from "@/components/providers/i18n-provider";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

const legalLinks = [
  { href: "/legal/terms", label: "Conditions d’utilisation" },
  { href: "/legal/privacy", label: "Confidentialité" },
];

type Step = "email" | "message" | "done";

export function MarketingFooter() {
  const { t } = useI18n();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmitEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStep("message");
  };

  const onSubmitMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStep("done");
  };

  return (
    <footer id="contact" className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">

          {/* Colonne gauche — Contact form */}
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
              Nous contacter
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Une question ? Écrivez-nous.
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
              Laissez votre adresse e-mail puis détaillez votre demande — nous revenons vers vous rapidement.
            </p>

            <div className="relative mt-8 h-[140px] max-w-xl overflow-hidden">
              {/* Étape 1 : email */}
              <form
                onSubmit={onSubmitEmail}
                className="absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: step === "email" ? "translateX(0)" : "translateX(110%)",
                  opacity: step === "email" ? 1 : 0,
                  pointerEvents: step === "email" ? "auto" : "none",
                }}
                aria-hidden={step !== "email"}
              >
                <label htmlFor="footer-email" className="sr-only">
                  Adresse e-mail
                </label>
                <div className="flex items-stretch gap-2 rounded-xl border border-white/15 bg-white/[0.06] p-1.5 backdrop-blur-sm focus-within:border-white/40">
                  <input
                    id="footer-email"
                    type="email"
                    required
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-white px-5 py-2 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-px hover:bg-white/90"
                  >
                    Continuer
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-white/40">
                  Étape 1 sur 2 · votre adresse pour la réponse
                </p>
              </form>

              {/* Étape 2 : message */}
              <form
                onSubmit={onSubmitMessage}
                className="absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: step === "message" ? "translateX(0)" : "translateX(-110%)",
                  opacity: step === "message" ? 1 : 0,
                  pointerEvents: step === "message" ? "auto" : "none",
                }}
                aria-hidden={step !== "message"}
              >
                <label htmlFor="footer-message" className="sr-only">
                  Votre message
                </label>
                <div className="flex items-stretch gap-2 rounded-xl border border-white/15 bg-white/[0.06] p-1.5 backdrop-blur-sm focus-within:border-white/40">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    aria-label="Revenir à l'adresse e-mail"
                    title="Modifier l'e-mail"
                    className="inline-flex size-9 shrink-0 items-center justify-center self-stretch rounded-lg border border-white/15 text-white/70 transition-all duration-300 hover:-translate-x-px hover:border-white/40 hover:text-white"
                  >
                    <IconArrowLeft className="size-[16px]" />
                  </button>
                  <textarea
                    id="footer-message"
                    required
                    rows={2}
                    placeholder="Dites-nous ce que vous avez en tête…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-w-0 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 self-stretch rounded-lg bg-white px-5 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-px hover:bg-white/90"
                  >
                    Envoyer
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-white/40">
                  Étape 2 sur 2 · pour <span className="text-white/60">{email}</span> · cliquez sur la flèche pour modifier
                </p>
              </form>

              {/* Confirmation */}
              <div
                className="absolute inset-0 flex items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: step === "done" ? "translateY(0)" : "translateY(20%)",
                  opacity: step === "done" ? 1 : 0,
                  pointerEvents: step === "done" ? "auto" : "none",
                }}
                aria-hidden={step !== "done"}
              >
                <div className="rounded-xl border border-white/15 bg-white/[0.06] px-5 py-4 text-sm text-white/85">
                  Merci, votre message est bien envoyé. Nous vous répondrons à l’adresse <span className="font-semibold">{email}</span>.
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite — Navigation */}
          <div className="lg:col-span-5 lg:flex lg:flex-col lg:items-end lg:text-right">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/image%20app/Hora-Logo.png"
                alt="OTP Hora"
                width={194}
                height={154}
                className="h-8 w-auto"
              />
              <p className="text-lg font-semibold">OTP Hora</p>
            </div>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">
              Interface web professionnelle : authentification, compte, appareils, contacts et liaisons entreprise.
            </p>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
              Navigation
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {SUB_NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {t(item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Barre du bas */}
      <div className="bg-[#061C38]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-white/75 sm:flex-row">
          <p>© {new Date().getFullYear()} OTP Hora. Tous droits réservés.</p>
          <div className="flex items-center gap-5">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

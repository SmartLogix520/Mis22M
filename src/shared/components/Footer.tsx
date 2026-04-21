import { useState } from "react";

import {
  BiChevronDown,
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoTiktok,
  BiLogoPinterest,
  BiLogoYoutube,
} from "react-icons/bi";

const FooterSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 font-semibold text-sm"
      >
        {title}
        <BiChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="pb-4 text-sm text-gray-600 space-y-1">{children}</div>
      )}
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="bg-white mt-10">
      {/* 🔴 SECTION RÉSEAUX */}
      <div className="bg-[var(--primary)] text-black text-center py-8">
        <p className="text-sm tracking-widest mb-4">SUIVEZ-NOUS</p>

        <div className="flex justify-center gap-6 text-2xl text-primary">
          <BiLogoFacebook className="hover:scale-110 transition cursor-pointer" />
          <BiLogoInstagram className="hover:scale-110 transition cursor-pointer" />
          <BiLogoTiktok className="hover:scale-110 transition cursor-pointer" />
          <BiLogoPinterest className="hover:scale-110 transition cursor-pointer" />
          <BiLogoYoutube className="hover:scale-110 transition cursor-pointer" />
        </div>
      </div>

      {/* 📂 SECTIONS */}
      <div className="px-4">
        <FooterSection title="PRODUITS">
          <p>Maquillage</p>
          <p>Soins du visage</p>
          <p>Nouveautés</p>
        </FooterSection>

        <FooterSection title="TENDANCES & LOOKS">
          <p>Dernières tendances</p>
          <p>Inspiration beauté</p>
        </FooterSection>

        <FooterSection title="À PROPOS">
          <p>Notre histoire</p>
          <p>Nos engagements</p>
          <p>Contact</p>
        </FooterSection>

        <FooterSection title="CONDITIONS GÉNÉRALES">
          <p>Politique de confidentialité</p>
          <p>Conditions d'utilisation</p>
        </FooterSection>
      </div>

      {/* 🌍 LOCALISATION */}
      <div className="bg-gray-100 text-center text-xs py-3 mt-4">
        Algérie (Vous naviguez sur le site destiné à l'Algérie)
      </div>

      {/* ⚖️ COPYRIGHT */}
      <div className="text-center text-xs py-4 text-gray-500">
        © 2026 Votre Marque Algérie. Tous droits réservés.
      </div>
      <div className="text-center text-xs text-gray-400 pb-4">
        <span className="opacity-70">Powered by</span>{" "}
        <a
          href="https://dockintech.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold tracking-wide hover:text-black transition"
        >
          DockinTech
        </a>
      </div>
    </footer>
  );
}

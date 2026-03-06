"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useCMS } from "@/components/cms/CMSProvider";
import EditableText from "@/components/cms/EditableText";
import EditableImage from "@/components/cms/EditableImage";
import EditableButton from "@/components/cms/EditableButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, Pen, Star, Truck, UtensilsCrossed } from "lucide-react";

/* ─── Fade ─── */
function Fade({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   HERO — Split : texte gauche, image droite
   Style bold, énergie bistrot
   ═══════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLInputElement>(null);
  const { isAdmin } = useCMS();

  return (
    <section className="min-h-[90vh] grid md:grid-cols-2">
      {/* Texte */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-20 bg-[var(--color-bg-dark)] order-2 md:order-1">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <EditableText contentKey="home.hero.label" defaultValue="Bistrot italien — Pizzeria" tag="p"
            className="text-[var(--color-orange)] text-xs tracking-[0.4em] uppercase mb-4" />
          <EditableText contentKey="home.hero.title" defaultValue="TOTTO" tag="h1"
            className="font-display text-7xl md:text-8xl lg:text-9xl text-white leading-[0.85] mb-4" />
          <EditableText contentKey="home.hero.subtitle" defaultValue="Produits frais & de qualité. Du mardi au samedi, midi & soir." tag="p"
            className="text-white/50 text-base md:text-lg mb-8 max-w-md" />
          <div className="flex flex-wrap gap-3">
            <EditableButton contentKeyText="home.hero.cta1.text" contentKeyUrl="home.hero.cta1.url"
              defaultText="La carte" defaultUrl="#carte"
              className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-500" />
            <EditableButton contentKeyText="home.hero.cta2.text" contentKeyUrl="home.hero.cta2.url"
              defaultText="Réserver" defaultUrl="tel:0422915477"
              className="border border-white/20 text-white hover:bg-white hover:text-[var(--color-bg-dark)] px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-500" />
          </div>
        </motion.div>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden min-h-[40vh] md:min-h-0 order-1 md:order-2">
        <EditableImage contentKey="home.hero.bg"
          defaultSrc="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80"
          alt="Pizza TOTTO" fill sizes="50vw" priority
          className="object-cover" hideButton inputRef={ref} />
        {isAdmin && (
          <button onClick={() => ref.current?.click()}
            className="absolute top-6 right-6 z-[50] bg-white/80 text-[var(--color-text)] p-2 rounded-full">
            <Pen className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MARQUEE — Défilement horizontal
   ═══════════════════════════════════════════════ */
function Marquee() {
  const items = ["Pizza", "Pasta", "Antipasti", "Tiramisu", "Cocktails", "Bruschetta", "Risotto", "Panini"];
  return (
    <section className="py-4 bg-[var(--color-orange)] overflow-hidden">
      <motion.div className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="font-display text-lg text-white/90 flex items-center gap-8">
            {item} <span className="text-white/40">•</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CARTE — Onglets par catégorie + photos nommées
   ═══════════════════════════════════════════════ */
function Carte() {
  const [active, setActive] = useState(0);

  const categories = [
    {
      title: "Antipasti",
      img: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&q=80",
      items: [
        { name: "Bruschetta", desc: "Tomates fraîches, basilic, ail, huile d'olive" },
        { name: "Carpaccio di Manzo", desc: "Boeuf cru, roquette, parmesan, câpres" },
        { name: "Burrata", desc: "Burrata crémeuse, tomates cerises, pesto" },
        { name: "Planche italienne", desc: "Charcuterie, fromages, olives, grissini" },
      ],
    },
    {
      title: "Pizzas",
      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
      items: [
        { name: "Margherita", desc: "Tomate, mozzarella fior di latte, basilic frais" },
        { name: "Regina", desc: "Tomate, mozzarella, jambon, champignons" },
        { name: "Quattro Formaggi", desc: "Mozzarella, gorgonzola, parmesan, chèvre" },
        { name: "Calzone", desc: "Tomate, mozzarella, jambon, oeuf, champignons" },
        { name: "Diavola", desc: "Tomate, mozzarella, salami piquant, piments" },
        { name: "Parmigiana", desc: "Tomate, mozzarella, aubergines grillées, parmesan" },
      ],
    },
    {
      title: "Pâtes",
      img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
      items: [
        { name: "Carbonara", desc: "Guanciale, oeuf, pecorino, poivre noir" },
        { name: "Bolognese", desc: "Ragù de boeuf mijoté, tomates, herbes" },
        { name: "Pesto Genovese", desc: "Basilic frais, pignons, parmesan, ail" },
        { name: "All'Amatriciana", desc: "Guanciale, tomate, pecorino, piment" },
        { name: "Risotto du jour", desc: "Selon l'inspiration et les produits du marché" },
      ],
    },
    {
      title: "Desserts",
      img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
      items: [
        { name: "Tiramisu maison", desc: "Mascarpone, café, cacao, biscuits" },
        { name: "Panna Cotta", desc: "Crème vanille, coulis fruits rouges" },
        { name: "Fondant chocolat", desc: "Chocolat noir, coeur coulant" },
      ],
    },
  ];

  const cat = categories[active];

  return (
    <section id="carte" className="py-16 md:py-20 bg-[var(--color-bg-dark)]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Fade className="text-center mb-10">
          <EditableText contentKey="home.carte.label" defaultValue="La carte" tag="p"
            className="text-[var(--color-orange)] text-xs tracking-[0.4em] uppercase mb-2" />
          <EditableText contentKey="home.carte.title" defaultValue="Nos spécialités" tag="h2"
            className="font-display text-3xl md:text-5xl text-white" />
        </Fade>

        {/* Onglets */}
        <div className="flex justify-start md:justify-center gap-2 md:gap-4 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c, i) => (
            <button key={c.title} onClick={() => setActive(i)}
              className={`px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                active === i
                  ? "bg-[var(--color-orange)] text-white"
                  : "text-white/40 hover:text-white border border-white/10"
              }`}>
              {c.title}
            </button>
          ))}
        </div>

        {/* Contenu catégorie active */}
        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">

          {/* Image avec nom */}
          <div className="md:col-span-5 relative group overflow-hidden rounded-sm">
            <EditableImage contentKey={`home.carte.${cat.title.toLowerCase()}.img`}
              defaultSrc={cat.img} alt={cat.title} width={800} height={600}
              className="w-full aspect-[4/3] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="font-display text-3xl text-white">{cat.title}</h3>
            </div>
          </div>

          {/* Liste plats */}
          <div className="md:col-span-7">
            <ul className="space-y-5">
              {cat.items.map((item: any, i: number) => (
                <motion.li key={item.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="border-b border-white/5 pb-4">
                  <span className="text-white text-base font-medium">{item.name}</span>
                  <p className="text-white/35 text-sm mt-1">{item.desc}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   IMAGE BREAK — Ambiance
   ═══════════════════════════════════════════════ */
function ImageBreak() {
  const ref = useRef<HTMLInputElement>(null);
  const { isAdmin } = useCMS();

  return (
    <section className="relative h-[35vh] overflow-hidden">
      <EditableImage contentKey="home.break.image"
        defaultSrc="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
        alt="Ambiance TOTTO" fill sizes="100vw" className="object-cover" hideButton inputRef={ref} />
      <div className="absolute inset-0 bg-[var(--color-bg-dark)]/50" />
      {isAdmin && (
        <button onClick={() => ref.current?.click()}
          className="absolute top-6 right-6 z-[50] bg-white/80 p-2 rounded-full">
          <Pen className="w-4 h-4" />
        </button>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <EditableText contentKey="home.break.quote"
          defaultValue="Produits frais, recettes authentiques, ambiance conviviale."
          tag="p" className="font-display text-2xl md:text-4xl text-white text-center max-w-xl px-8" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   BAR — Cocktails & vins
   ═══════════════════════════════════════════════ */
function Bar() {
  return (
    <section className="py-16 md:py-20 bg-[var(--color-bg-warm)]">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-10 items-center">
        <Fade className="md:col-span-5">
          <EditableImage contentKey="home.bar.image"
            defaultSrc="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80"
            alt="Cocktails" width={500} height={600}
            className="w-full aspect-[4/5] object-cover" />
        </Fade>
        <Fade delay={0.1} className="md:col-span-7">
          <EditableText contentKey="home.bar.label" defaultValue="Le Bar" tag="p"
            className="text-[var(--color-orange)] text-xs tracking-[0.4em] uppercase mb-3" />
          <EditableText contentKey="home.bar.title" defaultValue="Cocktails & vins italiens" tag="h2"
            className="font-display text-3xl md:text-4xl text-[var(--color-text)] leading-[1.1] mb-6" />
          <EditableText contentKey="home.bar.text"
            defaultValue="Aperol Spritz, Negroni, Martini rouge, cocktails du moment... Accompagnez votre repas d'une sélection de vins italiens ou laissez-vous tenter par nos créations du bar BALDI. Un apéritif en terrasse ou un digestif pour conclure en beauté."
            tag="p" className="text-[var(--color-text-muted)] leading-relaxed mb-6" />
          <div className="flex flex-wrap gap-3">
            {["Aperol Spritz", "Negroni", "Vins italiens", "Bières artisanales", "Cocktails maison"].map(drink => (
              <span key={drink} className="px-3 py-1.5 bg-[var(--color-orange)]/10 text-[var(--color-orange)] text-xs font-medium">{drink}</span>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   AVIS — Google 4.9/5
   ═══════════════════════════════════════════════ */
function Avis() {
  const reviews = [
    { name: "Avis Google", text: "Les pâtes étaient fraîches et savoureuses, et la sauce tomate avait un goût authentique. L'ambiance était chaleureuse et le personnel très accueillant. Je recommande vivement leur pizza margherita !", rating: 5 },
    { name: "Avis Google", text: "L'équipe est dynamique, sympa et toujours souriante. Les plats sont très bons et préparés avec des produits frais. L'ambiance est agréable, idéale pour passer un bon moment.", rating: 5 },
    { name: "Avis Google", text: "Un vrai bistrot italien comme on les aime. Carpaccio excellent, pizzas généreuses, tiramisu maison incroyable. On y revient sans hésiter !", rating: 5 },
  ];

  return (
    <section className="py-16 md:py-20 bg-[var(--color-bg-warm)]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Fade className="text-center mb-10">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-[var(--color-orange)] fill-[var(--color-orange)]" />)}
          </div>
          <EditableText contentKey="home.avis.title" defaultValue="4.9/5 sur Google — 77 avis" tag="h2"
            className="font-display text-2xl md:text-4xl text-[var(--color-text)]" />
        </Fade>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Fade key={r.name} delay={i * 0.08}>
              <div className="bg-[var(--color-bg)] p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-[var(--color-orange)] fill-[var(--color-orange)]" />)}
                </div>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-3">{r.text}</p>
                <p className="text-[var(--color-text)] text-xs font-medium">{r.name}</p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   HORAIRES + CONTACT
   ═══════════════════════════════════════════════ */
function Contact() {
  const horaires = [
    { jour: "Lundi", h: "Fermé" },
    { jour: "Mardi — Jeudi", h: "11h30–14h • 18h30–22h30" },
    { jour: "Vendredi — Samedi", h: "11h30–14h • 18h30–23h30" },
    { jour: "Dimanche", h: "Fermé" },
  ];

  return (
    <section id="contact" className="py-16 md:py-20 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12">
        {/* Horaires */}
        <Fade>
          <EditableText contentKey="home.contact.label" defaultValue="Horaires" tag="p"
            className="text-[var(--color-orange)] text-xs tracking-[0.4em] uppercase mb-3" />
          <EditableText contentKey="home.contact.title" defaultValue="Quand venir" tag="h2"
            className="font-display text-3xl md:text-4xl text-[var(--color-text)] mb-6" />

          <div className="space-y-3">
            {horaires.map(h => (
              <div key={h.jour} className="flex justify-between items-center py-2 border-b border-[var(--color-text)]/5">
                <span className="text-[var(--color-text)] text-sm font-medium">{h.jour}</span>
                <span className={`text-sm ${h.h === "Fermé" ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-muted)]"}`}>{h.h}</span>
              </div>
            ))}
          </div>
        </Fade>

        {/* Contact */}
        <Fade delay={0.1}>
          <EditableText contentKey="home.contact.label2" defaultValue="Contact" tag="p"
            className="text-[var(--color-orange)] text-xs tracking-[0.4em] uppercase mb-3" />
          <EditableText contentKey="home.contact.title2" defaultValue="Nous trouver" tag="h2"
            className="font-display text-3xl md:text-4xl text-[var(--color-text)] mb-6" />

          <div className="space-y-4 mb-6">
            {[
              { Icon: MapPin, key: "home.contact.address", def: "56 Rue Président Wilson, 26240 Saint-Vallier" },
              { Icon: Phone, key: "home.contact.phone", def: "04 22 91 54 77" },
              { Icon: Mail, key: "home.contact.email", def: "totto.saintvallier@gmail.com" },
            ].map(({ Icon, key, def }) => (
              <div key={key} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-[var(--color-orange)]/60 mt-0.5 flex-shrink-0" />
                <EditableText contentKey={key} defaultValue={def} tag="p" className="text-[var(--color-text-muted)] text-sm" />
              </div>
            ))}
          </div>

          <EditableButton contentKeyText="home.contact.cta.text" contentKeyUrl="home.contact.cta.url"
            defaultText="Réserver" defaultUrl="tel:0422915477"
            className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-500" />

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2831!2d4.8115!3d45.1756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f5410bc6c63817%3A0x487bf5fada86869f!2sTOTTO%20Saint%20Vallier%20-%20Bistrot%20italien%20%E2%80%A2%20Pizzeria!5e0!3m2!1sfr!2sfr"
            className="w-full h-[200px] border-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700 mt-6"
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </Fade>
      </div>
    </section>
  );
}

/* ─── MAIN ─── */
export default function Home() {
  const { loaded } = useCMS();

  if (!loaded) {
    return (
      <div className="fixed inset-0 bg-[var(--color-bg-dark)] z-[99999] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <h1 className="font-display text-6xl text-white mb-4">TOTTO</h1>
          <div className="w-8 h-8 border border-[var(--color-orange)] border-t-transparent rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Marquee />
      <Carte />
      <ImageBreak />
      <Bar />
      <Avis />
      <Contact />
      <Footer />
    </main>
  );
}
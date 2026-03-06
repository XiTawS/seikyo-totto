import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/cms/SessionProvider";
import CMSProvider from "@/components/cms/CMSProvider";
import AdminBar from "@/components/cms/AdminBar";

export const metadata: Metadata = {
  title: "TOTTO — Bistrot Italien & Pizzeria à Saint-Vallier",
  description: "Bistrot italien et pizzeria à Saint-Vallier. Produits frais, pizzas artisanales, pâtes maison. Sur place, à emporter ou en livraison.",
  keywords: "TOTTO, restaurant italien, pizzeria, Saint-Vallier, bistrot, pizza, pâtes, Drôme",
  openGraph: {
    title: "TOTTO — Bistrot Italien & Pizzeria",
    description: "Produits frais et de qualité. Du mardi au samedi, midi & soir. Saint-Vallier.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItalianRestaurant",
          name: "TOTTO - Bistrot Italien & Pizzeria",
          address: { "@type": "PostalAddress", streetAddress: "56 Rue Président Wilson", addressLocality: "Saint-Vallier", postalCode: "26240", addressCountry: "FR" },
          telephone: "+33422915477",
          email: "totto.saintvallier@gmail.com",
          url: "https://totto-restaurant.vercel.app",
          servesCuisine: "Italian",
          priceRange: "$$",
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "77" },
          sameAs: [
            "https://www.facebook.com/p/TOTTO-Restaurant-Saint-Vallier-61563246474871/",
            "https://www.instagram.com/tottorestaurant/",
          ],
        })}} />
      </head>
      <body className="antialiased">
        <SessionProvider>
          <CMSProvider>
            {children}
            <AdminBar />
          </CMSProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
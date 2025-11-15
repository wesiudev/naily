import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Panel administracyjny",
};

export default function Admin() {
  return (
    <div className="w-full px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Panel administracyjny
        </h1>
        <p className="text-gray-300 mb-8">
          Wybierz sekcję, aby rozpocząć pracę.
        </p>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AdminCard
            href="/admin/blog"
            title="Blog"
            description="Zarządzaj wpisami na blogu"
          />
          <AdminCard
            href="/admin/blog/new"
            title="Nowy wpis"
            description="Utwórz nowy wpis na blogu"
          />
          <AdminCard
            href="/admin/invites"
            title="Zaproszenia"
            description="Generuj i zarządzaj zaproszeniami"
          />
          <AdminCard
            href="/admin/products"
            title="Produkty"
            description="Przeglądaj produkty"
          />
          <AdminCard
            href="/admin/products/new"
            title="Nowy produkt"
            description="Dodaj nowy produkt"
          />
          <AdminCard
            href="/admin/logout"
            title="Wyloguj"
            description="Zakończ sesję administracyjną"
          />
        </div>
      </div>
    </div>
  );
}

function AdminCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-gray-700 bg-gray-800/60 hover:bg-gray-800 transition-colors p-5 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
            {title}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
        <span className="text-gray-500 group-hover:text-purple-300 transition-colors">
          →
        </span>
      </div>
    </Link>
  );
}

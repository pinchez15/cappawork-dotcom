import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICES, getServiceBySlug } from "../data";
import { ServiceContent } from "./service-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: `${service.title} — CappaWork`,
    description: service.subtitle,
    openGraph: {
      title: `${service.title} — CappaWork`,
      description: service.subtitle,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK ||
    "https://calendly.com/cappawork/discovery_call";

  return (
    <div className="min-h-screen bg-warm-white text-navy">
      {/* Minimal nav */}
      <nav className="border-b border-card-border">
        <div className="max-w-[680px] mx-auto px-6 flex h-14 items-center justify-between">
          <Link
            href="/"
            className="font-bold text-sm tracking-wider uppercase"
          >
            CappaWork
          </Link>
          <Link
            href="/#services"
            className="text-sm text-stone-500 hover:text-navy transition-colors"
          >
            All Services
          </Link>
        </div>
      </nav>

      <ServiceContent service={service} calendlyLink={calendlyLink} />

      {/* Footer */}
      <div className="max-w-[680px] mx-auto px-6 pb-20">
        <div className="pt-6 border-t border-card-border flex justify-between items-center">
          <span className="font-bold text-sm tracking-wider">CAPPAWORK</span>
          <Link
            href={calendlyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-500 hover:text-navy transition-colors"
          >
            calendly.com/cappawork
          </Link>
        </div>
      </div>
    </div>
  );
}

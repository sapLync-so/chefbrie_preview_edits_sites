"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { DemoBanner } from "@/components/DemoBanner";
import { HomeGallery } from "@/components/HomeGallery";
import { HomeContactSection } from "@/components/HomeContactSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { MobileBookBar } from "@/components/MobileBookBar";
import { Reveal } from "@/components/motion/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mealPrepMenu } from "@/data/menus";
import { formatMealPrepPrice } from "@/lib/menu-utils";

const services = [
  {
    href: "/services/meal-prep",
    ctaLabel: "Explore Meal Prep",
    title: "Meal Prep",
    subtitle: "Weekly Personalized Nutrition",
    description:
      "Chef-crafted meals prepared fresh each week — designed around your nutritional goals, preferences, and lifestyle. No more compromising between eating well and eating right.",
    details: ["Rotating weekly menu", "Customized meal prep menu available", "Family pack bundle"],
    image: "/images/chef-brie-gallery/IMG_4450.jpg",
  },
  {
    href: "/services/micro-catering",
    ctaLabel: "Explore Micro-Catering",
    title: "Micro-Catering",
    subtitle: "Intimate Events & Gatherings",
    description:
      "Elevated catering for small, curated events — birthdays, brunches, celebrations, corporate dinners, retreats, and university programming. Chef Brie brings full-service culinary execution directly to your venue, with custom menus tailored to your guests and vision.",
    details: [
      "Customizable menus",
      "Delivery or setup and serving available",
      "Servicing the NJ/PA area",
      "Dietary restrictions, gluten/celiac and plant-based accommodations are available",
    ],
    image: "/images/chef-brie-gallery/IMG_4446.jpg",
  },
  {
    href: "/services/supper-club",
    ctaLabel: "Explore the Supper Club Experience",
    title: "Brie's Supper Club",
    subtitle: "The Full Chef Experience",
    description:
      "Brie's supper club is an immersive restaurant quality experience including multiple courses. She picks a breathtaking venue to host her guests for an unforgettable meal. Some chefs pair wine with their dishes — Chef Brie pairs people, plates, and atmosphere into one unforgettable evening.",
    details: [] as string[],
    image: "/videos/supper-club-poster.jpg",
  },
];

const featuredWeek = mealPrepMenu.weeks[0];

export default function ChefBrieHome() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <DemoBanner />
      <SiteNav />

      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-end pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/videos/supper-club-poster.jpg"
            preload="metadata"
            aria-label="Supper club atmosphere reel"
          >
            <source src="/videos/supper-club-reel.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/30" aria-hidden />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 md:pb-28">
          <Reveal className="max-w-2xl">
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-gold">New Jersey & Pennsylvania</p>
            <h1 className="text-hero font-light leading-[0.95]">
              Chef
              <br />
              <span className="italic text-gold">Brie</span>
            </h1>
            <p className="mt-6 max-w-lg font-sans text-lg font-light leading-relaxed text-ink/80 md:text-xl">
              Private chef. Culinary storyteller. Crafting unforgettable dining experiences — one plate at a time.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="#services">
                  Explore services
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/demo/book">Book an experience</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quote */}
      <section className="border-y border-gold/25 bg-gold px-5 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xl font-light italic leading-relaxed text-bg md:text-2xl">
            &ldquo;The exchange between great food and people is an unforgettable feeling.&rdquo;
          </p>
          <p className="mt-3 font-sans text-xs uppercase tracking-[0.3em] text-bg/70">— Chef Brie</p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-28 px-5 py-section">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2 md:gap-20">
          <Reveal>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-gold">Her Story</p>
            <h2 className="text-4xl font-light leading-tight md:text-5xl">
              A Passion Born
              <br />
              <span className="italic text-gold">in the Kitchen</span>
            </h2>
            <div className="mt-8 space-y-5 font-sans text-base font-light leading-relaxed text-ink/75">
              <p>
                Chef Brie&apos;s culinary journey began at just 16 years old, sparked by the warm influence of her
                mother&apos;s tea business and a deep curiosity about the relationship between food and people.
              </p>
              <p>
                Her first foodservice job ignited a passion that never faded — leading her through restaurants,
                conference centers, and exclusive private chef events where she honed a craft both technical and deeply
                personal.
              </p>
              <p>
                Today, Chef Brie is building her own brand — offering intimate micro-catering experiences, customized
                meal prep services, and curated 6-course tasting pop-ups that have earned her a devoted following across
                New Jersey and Pennsylvania.
              </p>
              <p>
                Her inspiration is simple and profound: the people she cooks for, works alongside, and shares meals with.
                Every plate tells a story. Every meal creates a memory.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-soft">
              <Image
                src="/images/chef-brie-portrait.jpeg"
                alt="Chef Brie in her element"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover object-top"
                priority={false}
              />
            </div>
            <div className="absolute -bottom-5 -left-4 rounded-md border border-gold/30 bg-bg-elevated p-6 shadow-glow md:-left-6">
              <p className="text-3xl font-light text-gold">8+</p>
              <p className="mt-1 font-sans text-xs uppercase tracking-[0.2em] text-ink/55">Years of Experience</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-28 bg-bg-muted px-5 py-section">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-gold">What I Offer</p>
            <h2 className="text-4xl font-light md:text-5xl">
              Culinary <span className="italic text-gold">Experiences</span>
            </h2>
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-ink/55">
              Each service is designed to bring the restaurant experience directly to you — whether for an intimate
              dinner, a week of nourishing meals, or an unforgettable tasting event.
            </p>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={i * 0.08}>
                <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-glow transition-colors hover:border-gold/45">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" aria-hidden />
                  </div>
                  <div className="flex flex-grow flex-col p-7">
                    <Sparkles className="mb-4 h-5 w-5 text-gold" aria-hidden />
                    <h3 className="text-xl font-light">{service.title}</h3>
                    <p className="mb-4 font-sans text-xs uppercase tracking-[0.18em] text-gold">{service.subtitle}</p>
                    <p className="mb-6 flex-grow font-sans text-sm font-light leading-relaxed text-ink/60">
                      {service.description}
                    </p>
                    {service.details.length > 0 && (
                      <ul className="mb-6 space-y-2">
                        {service.details.map((d) => (
                          <li key={d} className="flex items-start gap-2 font-sans text-xs text-ink/50">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button asChild variant="outline" className="mt-auto w-full">
                      <Link href={service.href}>{service.ctaLabel}</Link>
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured menu */}
      <section className="border-y border-border bg-bg-elevated px-5 py-section">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="mb-3 font-sans text-xs uppercase tracking-[0.35em] text-gold">This week</p>
            <h2 className="text-3xl font-light md:text-4xl">
              Featured <span className="italic text-gold">meal prep</span>
            </h2>
            <p className="mt-4 font-sans text-sm text-ink/60">{featuredWeek.dateLabel}</p>
            <div className="mt-8 space-y-6 font-sans text-sm">
              <div className="rounded-md border border-border p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">Breakfast</p>
                <p className="mt-2 text-ink/85">{featuredWeek.breakfast.name}</p>
                <Badge variant="price" className="mt-3">
                  {formatMealPrepPrice(featuredWeek.breakfast.price)} per meal
                </Badge>
              </div>
              <div className="rounded-md border border-border p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">Dinner</p>
                <p className="mt-2 text-ink/85">{featuredWeek.dinner.name}</p>
                <Badge variant="price" className="mt-3">
                  {formatMealPrepPrice(featuredWeek.dinner.price)} per meal
                </Badge>
              </div>
            </div>
            <Button asChild className="mt-8">
              <Link href="/menu#meal-prep">View full menu</Link>
            </Button>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-soft md:aspect-[4/5]">
              <Image
                src="/images/chef-brie-gallery/IMG_4449.jpg"
                alt="Plated dish from Chef Brie meal prep and catering"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <HomeGallery />

      <TestimonialsSection />

      {/* Stats */}
      <section className="bg-gold px-5 py-14">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 text-center">
          {[
            { number: "5", label: "Course Supper Club" },
            { number: "NJ & PA", label: "Service Area" },
            { number: "100%", label: "Custom Menus" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-light text-bg md:text-4xl">{stat.number}</p>
              <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-bg/65 md:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA */}
      <section className="px-5 py-section">
        <Reveal className="mx-auto max-w-3xl rounded-xl border border-gold/35 bg-gradient-to-br from-gold/15 to-transparent p-10 text-center shadow-glow">
          <h2 className="text-3xl font-light md:text-4xl">Ready when you are</h2>
          <p className="mx-auto mt-4 max-w-lg font-sans text-sm leading-relaxed text-ink/65">
            Preview the demo booking flow, or reach out directly — meal prep, micro-catering, and supper club inquiries
            welcome.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/demo/book">Start demo booking</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#contact">Contact Chef Brie</Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-28 bg-bg-elevated px-5 py-section">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
          <Reveal>
            <a
              href="mailto:chefbrie01@gmail.com"
              className="mb-4 inline-block font-sans text-xs uppercase tracking-[0.35em] text-gold transition-colors hover:text-gold-bright"
            >
              Get in Touch
            </a>
            <h2 className="text-4xl font-light leading-tight md:text-5xl">
              Let&apos;s Create
              <br />
              <span className="italic text-gold">Something Memorable</span>
            </h2>
            <p className="mb-10 mt-6 font-sans text-sm font-light leading-relaxed text-ink/60">
              Whether you&apos;re planning an intimate dinner, weekly meal prep, or a full tasting event — Chef Brie would
              love to hear about your vision. Reach out and let&apos;s bring it to life.
            </p>
            <div className="space-y-5 font-sans text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ink/40">Email</p>
                <a href="mailto:chefbrie01@gmail.com" className="text-ink/80 hover:text-gold">
                  chefbrie01@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ink/40">Phone</p>
                <a href="tel:6092134778" className="text-ink/80 hover:text-gold">
                  609-213-4778
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ink/40">Service Area</p>
                <p className="text-ink/80">New Jersey & Pennsylvania</p>
              </div>
            </div>
            <div className="mt-10 flex gap-4">
              <Button asChild variant="outline" size="sm">
                <a href="https://instagram.com/bellavita_015" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="https://tiktok.com/@chef.brie8" target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <HomeContactSection />
          </Reveal>
        </div>
      </section>

      <SiteFooter />
      <MobileBookBar />
    </div>
  );
}

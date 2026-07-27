"use client"

import Link from "next/link";
import { useState, useEffect } from "react";

const slides = [
  {
    title: "Summer Collection 2026",
    subtitle: "Discover the latest trends with up to 40% off on selected items.",
    cta: "Shop Now",
    href: "/categories/summer",
    bg: "from-slate-900 via-slate-800 to-slate-900",
  },
  {
    title: "New Arrivals Weekly",
    subtitle: "Be the first to grab fresh styles added every Monday.",
    cta: "Explore",
    href: "/new-arrivals",
    bg: "from-indigo-900 via-indigo-800 to-slate-900",
  },
  {
    title: "Free Shipping Over $50",
    subtitle: "Stock up on your favourites and enjoy free delivery on orders above $50.",
    cta: "Start Shopping",
    href: "/categories",
    bg: "from-slate-900 via-emerald-900/40 to-slate-900",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className={`relative bg-gradient-to-r ${slide.bg} transition-colors duration-700`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-[10%] w-80 h-80 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-white/90 mb-6">
            Featured
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            {slide.title}
          </h1>

          <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-lg">
            {slide.subtitle}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href={slide.href}
              className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              {slide.cta}
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={prev}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

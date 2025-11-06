import React from "react";

import Image from "next/image";
import Link from "next/link";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth-layout">
      <section className="auth-left-section scrollbar-hide-default">
        <Link href="/" className="auth-logo">
          <Image
            src="/assets/icons/logo.svg"
            alt="Logo"
            width={140}
            height={32}
            className="h-8 w-auto"
          />
        </Link>

        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
      </section>

      <section className="auth-right-section">
        <div className="z-10 relative lg:mt-4 lg:mb-16">
          <blockquote className="auth-blockquote">
            Signalist turned my watchlist into a winning list. The alerts are
            spot-on, and I feel more confident making moves in the market
          </blockquote>
          <div className="flex items-center justify-between">
            <cite className="auth-testimonial-author">- Jamie L.</cite>{" "}
            <p className="max-md:text-xs text-gray-500">Retail Investor</p>{" "}
            <div className="flex items-center gap-0.5 lg:gap-1 absolute bottom-6 lg:bottom-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  key={star}
                  src="/assets/icons/star.svg"
                  alt="Star"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <Image
            src="/assets/images/dashboard.png"
            alt="dashboard image"
            className="auth-dashboard-preview absolute top-0"
            width={1140}
            height={1150}
          />
        </div>
      </section>
    </main>
  );
};

export default layout;

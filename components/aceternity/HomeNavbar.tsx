"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/aceternity/ResizableNavbar";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeNavbar() {
  const { user } = useUser();

  const router = useRouter();

  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          {user ? (
            <div className="flex items-center gap-2">
              <UserButton />
              <div className="flex flex-col items-start">
                <p className="text-sm line-clamp-1">
                  {user.fullName || `${user.firstName} ${user.lastName}`}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {user.emailAddresses[0].emailAddress}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NavbarButton
                variant="secondary"
                onClick={() => router.push("/sign-in")}
              >
                Sign in
              </NavbarButton>
              <NavbarButton
                variant="primary"
                onClick={() => router.push("/sign-up")}
              >
                Sign up
              </NavbarButton>
            </div>
          )}
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            {user ? (
              <div className="flex items-center gap-2">
                <UserButton />
                <div className="flex flex-col items-start">
                  <p className="text-sm line-clamp-1">
                    {user.fullName || `${user.firstName} ${user.lastName}`}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {user.emailAddresses[0].emailAddress}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-4">
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Sign in
                </NavbarButton>
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Sign up
                </NavbarButton>
              </div>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

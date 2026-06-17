"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/rede", label: "Rede" },
  { href: "/perfil", label: "Perfil" }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg shadow py-4">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-4" href="/">
          <Image
            className="brand-logo ms-3"
            src="/img/logo.png"
            alt="Logo KIMERA"
            width={80}
            height={80}
            priority
          />
          <h1 className="text-center title display-3 brand-title mb-0">
            KIMERA
            <span className="brand-subtitle">Audiovisual</span>
          </h1>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Alternar navegação"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav me-auto" />
          <ul className="navbar-nav me-3">
            {links.map((link) => (
              <li className="nav-item mx-2" key={link.href}>
                <h2 className="mb-0">
                  <Link
                    className={`nav-link ${pathname === link.href ? "active" : ""}`}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </h2>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

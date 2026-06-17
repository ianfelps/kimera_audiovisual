import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";

const previewImages = [
  { href: "/video/por-favor-goste-de-mim", src: "/img/mv.jpg", alt: "Cartaz do curta Por Favor, Goste de Mim" },
  { href: "/catalogo", src: "/img/mv1.jpg", alt: "Cartaz de obra audiovisual" },
  { href: "/catalogo", src: "/img/mv2.jpg", alt: "Cartaz de obra audiovisual" },
  { href: "/catalogo", src: "/img/mv3.jpg", alt: "Cartaz de obra audiovisual" }
];

export default function HomePage() {
  return (
    <PageShell>
      <div className="container-fluid p-5">
        <div className="row g-4">
          <div className="col-12 col-xl-9 position-relative home-hero">
            <Image
              src="/img/kimera.jpg"
              alt="Kimera"
              fill
              sizes="(max-width: 1200px) 100vw, 75vw"
              className="img-fluid kimera border border-3 border-dark shadow-lg object-fit-cover"
              priority
            />
            <Link
              className="position-absolute top-0 start-50 translate-middle-x text-center title btn mt-3"
              href="/catalogo"
            >
              <span className="display-2 home-action">Play</span>
            </Link>
            <Link className="position-absolute bottom-0 start-0 text-center title btn mb-4 ms-5" href="/perfil">
              <span className="display-2 home-action">Perfil</span>
            </Link>
            <Link className="position-absolute bottom-0 end-0 text-center title btn mb-4 me-5" href="/rede">
              <span className="display-2 home-action">Rede</span>
            </Link>
          </div>

          <aside className="col-12 col-xl-3">
            <div className="row g-3">
              {previewImages.map((image) => (
                <div className="col-6" key={image.src}>
                  <Link href={image.href}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={260}
                      height={270}
                      className="img-fluid rounded shadow border border-3 border-dark home-poster"
                    />
                  </Link>
                </div>
              ))}
            </div>
            <Link href="/catalogo" className="btn mt-3 w-100 shadow play-button" aria-label="Abrir catálogo">
              <i className="bi bi-play-fill h1" />
            </Link>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

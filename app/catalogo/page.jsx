import PageShell from "@/components/PageShell";
import WorksSection from "@/components/WorksSection";
import { categories, mostViewedWorks, recentWorks } from "@/lib/catalog";

export const metadata = {
  title: "Catálogo"
};

export default function CatalogPage() {
  return (
    <PageShell>
      <section className="container-fluid my-3 px-5">
        <div className="row justify-content-between align-items-center">
          <div className="col-auto mt-3">
            <h2 className="display-3 mb-0">Catálogo</h2>
          </div>
          <div className="col-auto mt-3">
            <button className="btn btn-lg btn-secondary shadow" type="button">
              <span className="h4">
                <i className="bi bi-search" />
                &nbsp;&nbsp;Pesquisar
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="container-fluid my-5 px-5">
        <h3>Categorias</h3>
        <div className="horizontal-scroll-wrapper">
          <div className="row mt-3 flex-nowrap">
            {categories.map((category) => (
              <div className="col-auto" key={category}>
                <button className="btn btn-lg border border-secondary shadow-sm" type="button">
                  <span className="h4">{category}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WorksSection title="Mais Recentes" works={recentWorks} />
      <WorksSection title="Mais Vistos" works={mostViewedWorks} />
    </PageShell>
  );
}

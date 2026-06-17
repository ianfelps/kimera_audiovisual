import WorkCard from "@/components/WorkCard";

export default function WorksSection({ title, works }) {
  return (
    <section className="container-fluid my-5 px-5">
      <h3>{title}</h3>
      <div className="horizontal-scroll-wrapper">
        <div className="row mt-3 flex-nowrap">
          {works.map((work, index) => (
            <WorkCard work={work} key={`${title}-${index}-${work.title}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

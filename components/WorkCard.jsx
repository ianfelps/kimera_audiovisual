import Image from "next/image";
import Link from "next/link";

export default function WorkCard({ work }) {
  const content = (
    <>
      <Image
        src={work.image}
        alt={`Imagem da obra ${work.title}`}
        width={250}
        height={370}
        className="rounded shadow poster-image"
      />
      <h5 className="mt-2">{work.title}</h5>
      <h6>
        <i>{work.author}</i>
      </h6>
      {work.tags.map((tag) => (
        <span className="badge text-bg-secondary me-1" key={tag}>
          {tag}
        </span>
      ))}
    </>
  );

  if (work.href) {
    return (
      <Link className="col-auto btn text-start poster-card" href={work.href}>
        {content}
      </Link>
    );
  }

  return <div className="col-auto btn text-start poster-card">{content}</div>;
}

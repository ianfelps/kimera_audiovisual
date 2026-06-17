import { Fragment } from "react";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { getVideo, getVideoSlugs } from "@/lib/videos";

export function generateStaticParams() {
  return getVideoSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const video = getVideo(params.slug);
  return { title: video ? video.title : "Curta" };
}

export default function VideoPage({ params }) {
  const video = getVideo(params.slug);

  if (!video) {
    notFound();
  }

  return (
    <PageShell>
      <section className="container mt-5">
        <div className="row text-center">
          <h1>{video.title}</h1>
          <h4>
            <i>{video.author}</i>
          </h4>
        </div>
      </section>

      <section className="container-fluid text-center mt-3 bg-black py-3">
        <iframe
          className="video-frame"
          src={video.videoSrc}
          title={video.videoTitle}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </section>

      <section className="container">
        <hr />
        <div className="row">
          {video.credits.map((credit) => (
            <Fragment key={credit.label}>
              <h4>{credit.label}</h4>
              <p>
                {credit.lines.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < credit.lines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </Fragment>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

import Image from "next/image";
import PageShell from "@/components/PageShell";
import PostCard from "@/components/PostCard";
import { feedPosts } from "@/lib/posts";

export const metadata = {
  title: "Rede"
};

export default function NetworkPage() {
  return (
    <PageShell>
      <div className="container my-5">
        <section className="shadow-lg rounded post-card">
          <div className="row">
            <div className="col-12 col-lg-1 px-auto">
              <Image
                src="/img/profile.jpg"
                alt="Foto de perfil"
                width={85}
                height={85}
                className="rounded-circle m-4 border shadow-sm"
              />
            </div>
            <div className="col-12 col-lg-11 px-5 py-4">
              <textarea className="form-control" placeholder="Comece uma publicação" rows="3" />
              <hr />
              <div className="row justify-content-between align-items-center">
                <div className="col-auto">
                  <button className="btn text-secondary-emphasis mx-1" type="button" aria-label="Adicionar imagens">
                    <i className="bi bi-images h4" />
                  </button>
                  <button className="btn text-secondary-emphasis mx-1" type="button" aria-label="Adicionar citação">
                    <i className="bi bi-blockquote-left h4" />
                  </button>
                  <button className="btn text-secondary-emphasis mx-1" type="button" aria-label="Adicionar emoji">
                    <i className="bi bi-emoji-smile-fill h4" />
                  </button>
                </div>
                <div className="col-auto">
                  <button className="btn btn-secondary m-3 shadow-sm" type="button">
                    <span className="h5">Publicar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {feedPosts.map((post, index) => (
          <PostCard {...post} key={`feed-${index}`} />
        ))}
      </div>
    </PageShell>
  );
}

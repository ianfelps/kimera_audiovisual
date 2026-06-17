import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PostCard from "@/components/PostCard";
import { profilePosts } from "@/lib/posts";

export const metadata = {
  title: "Perfil"
};

export default function ProfilePage() {
  return (
    <PageShell>
      <div className="container my-5">
        <section className="shadow-lg rounded profile-card">
          <div className="row">
            <div className="col-12 col-lg-2 px-auto">
              <Image
                src="/img/profile.jpg"
                alt="Foto de perfil"
                width={150}
                height={150}
                className="rounded-circle mx-5 my-4 border shadow"
              />
            </div>
            <div className="col-12 col-lg-10 px-5 py-4">
              <div className="row justify-content-between">
                <div className="col-auto">
                  <h4>Nome de Usuário</h4>
                  <h5 className="text-secondary-emphasis">@nomedeusuario</h5>
                </div>
                <div className="col-auto">
                  <button className="btn" type="button" aria-label="Mais opções">
                    <i className="bi bi-three-dots-vertical h4" />
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-auto border-end border-light">
                  <Link href="#" className="text-decoration-none text-light">
                    2 publicações
                  </Link>
                </div>
                <div className="col-auto border-end border-light">
                  <Link href="#" className="text-decoration-none text-light">
                    110 seguidores
                  </Link>
                </div>
                <div className="col-auto">
                  <Link href="#" className="text-decoration-none text-light">
                    72 seguidos
                  </Link>
                </div>
              </div>
              <p className="lead mt-3">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia, dignissimos deserunt ad corrupti
                dolore excepturi quod quisquam, odit incidunt dolorum, enim aut esse. Suscipit reiciendis accusamus
                harum nihil non cupiditate.
              </p>
            </div>
          </div>
        </section>

        <section className="shadow-lg rounded-pill my-5 mx-auto tabs-shell">
          <div className="row py-3 mx-0 text-center mx-auto w-85">
            <div className="col border-end border-light">
              <Link href="#" className="text-decoration-none text-light mb-2">
                <h4>Publicações</h4>
              </Link>
            </div>
            <div className="col border-start border-light">
              <Link href="#" className="text-decoration-none text-light mb-2">
                <h4>Vídeos</h4>
              </Link>
            </div>
          </div>
        </section>

        {profilePosts.map((post, index) => (
          <PostCard {...post} key={`profile-${index}`} />
        ))}
      </div>
    </PageShell>
  );
}

import Image from "next/image";
import ActionButton from "@/components/ActionButton";

export default function PostCard({ author = "Nome do Autor", text, image, stats }) {
  return (
    <article className="shadow-lg rounded my-5 post-card">
      <div className="row">
        <div className="col-12 col-lg-1 mx-auto">
          <Image
            src="/img/profile.jpg"
            alt="Foto de perfil"
            width={85}
            height={85}
            className="rounded-circle m-4 border shadow-sm"
          />
        </div>
        <div className="col-12 col-lg-11 px-5 py-4">
          <span className="h5">
            <i>{author}</i>
          </span>
          <button
            className="btn btn-sm border border-secondary shadow-sm mx-2 my-1 p-1 follow-button"
            type="button"
          >
            <i className="bi bi-plus-lg" /> Seguir
          </button>
          <p className="mt-1 lead">{text}</p>
          {image ? (
            <Image
              src={image}
              alt="Imagem do post"
              width={300}
              height={444}
              className="rounded post-image"
            />
          ) : null}
          <hr />
          <div className="row justify-content-between align-items-center">
            <div className="col-auto">
              <ActionButton icon="bi-star" value={stats.stars} className="color1" />
              <ActionButton icon="bi-bookmark" value={stats.bookmarks} className="color2" />
              <ActionButton icon="bi-send" value={stats.shares} className="color3" />
            </div>
            <div className="col-auto">
              <button className="btn m-2" type="button" aria-label="Mais opções">
                <i className="bi bi-three-dots-vertical h5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

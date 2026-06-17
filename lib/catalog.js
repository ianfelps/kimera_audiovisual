export const categories = [
  "Ação e Aventura",
  "Documentário",
  "Animação",
  "Ficção",
  "Comédia",
  "Thriller",
  "Suspense",
  "Terror e Horror",
  "Drama",
  "Fantasia",
  "Videoclipe",
  "Musical"
];

export const works = [
  {
    title: "Por Favor, Goste de Mim",
    author: "Marina Martins",
    image: "/img/mv.jpg",
    tags: ["Terror Psicológico"],
    href: "/video/por-favor-goste-de-mim"
  },
  {
    title: "Olho por Olho",
    author: "Lia Miranda e Marina Martins",
    image: "/img/mv1.jpg",
    tags: ["Ficção", "Sci-fi", "Terror"],
    href: "/video/olho-por-olho"
  },
  {
    title: "Presente",
    author: "Marina Martins",
    image: "/img/mv2.jpg",
    tags: ["Drama", "Romance"],
    href: "/video/presente"
  },
  {
    title: "Mors Desiderat",
    author: "Lilian Pereira",
    image: "/img/mv3.jpg",
    tags: ["Horror"],
    href: "/video/mors-desiderat"
  }
];

export const recentWorks = [...works, ...works];

export const mostViewedWorks = [...works].reverse().concat([...works].reverse());

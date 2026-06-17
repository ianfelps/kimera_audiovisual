export const videos = {
  "por-favor-goste-de-mim": {
    title: "Por Favor, Goste de Mim",
    author: "Marina Martins",
    videoSrc: "https://www.youtube.com/embed/a1NUPM3QXig?si=oPHq8qEm6Onx3LXU",
    videoTitle: "Por Favor, Goste de Mim, curta de terror psicológico",
    credits: [
      { label: "Roteiro e direção de:", lines: ["Marina Martins"] },
      { label: "Direção de atores:", lines: ["Marina Martins"] },
      { label: "Direção de arte:", lines: ["Marina Martins"] },
      { label: "Direção de fotografia:", lines: ["Marina Martins"] },
      { label: "Assistente de direção de fotografia:", lines: ["Gabriel Alves"] },
      { label: "Montagem e edição:", lines: ["Marina Martins"] },
      { label: "Elenco:", lines: ["Vinicius Aragão", "Pedro Guido"] },
      { label: "Coreografia:", lines: ["Pedro Guido"] },
      {
        label: "Assistente de produção:",
        lines: ["Wanessa Noleto", "Gabriel Alves", "Arthur Lyra", "Kauã Dias", "Lia Miranda"]
      },
      { label: "Equipamentos:", lines: ["Filmado com uma Canon EOS Rebel SL2. Lente 18-55 mm."] }
    ]
  },
  "olho-por-olho": {
    title: "Olho por Olho",
    author: "Lia Miranda e Marina Martins",
    videoSrc: "https://www.youtube.com/embed/HhcatpOdKa4?si=RzT3KdZzsqCo0N_i",
    videoTitle: "Olho por Olho, curta de ficção, sci-fi e terror",
    credits: [
      { label: "Roteiro:", lines: ["Lia Miranda"] },
      { label: "Direção:", lines: ["Lia Miranda e Marina Martins"] },
      { label: "Direção de fotografia:", lines: ["Marina Martins e Lia Miranda"] },
      { label: "Operação de câmera:", lines: ["Marina Martins e Lia Miranda"] },
      { label: "Direção de arte:", lines: ["Lia Miranda e Marina Martins"] },
      { label: "Design de produção:", lines: ["Lia Miranda"] },
      {
        label: "Produção:",
        lines: ["Wanessa Noleto", "Marina Martins", "Lia Miranda", "Letícia Nunes", "Lilian"]
      },
      { label: "Direção de elenco:", lines: ["Lia Miranda"] },
      { label: "Maquiagem e figurino:", lines: ["Lia Miranda"] },
      { label: "Montagem, VFX e sonorização:", lines: ["Marina Martins"] },
      { label: "Elenco:", lines: ["Isabela Rosa - Sarah", "Lia Miranda - Pixal"] },
      {
        label: "Equipe:",
        lines: [
          "Isabela Rosa - @belarosaw",
          "Lia Miranda - @liamirandaz",
          "Marina Martins - @marina._.martins",
          "Letícia Nunes - @le__lyly",
          "Wanessa Noleto - @noletowanessa25",
          "Lilian Jesus - @nekrolily"
        ]
      },
      { label: "Equipamentos:", lines: ["Filmado com uma Canon EOS Rebel SL2. Lente 18-55 mm."] }
    ]
  },
  "presente": {
    title: "Presente",
    author: "Marina Martins",
    videoSrc: "https://www.youtube.com/embed/ze4ktaRSXdM?si=cdv9WieRPqg3zowX",
    videoTitle: "Presente, curta de drama e romance",
    credits: [
      { label: "Roteiro:", lines: ["Marina Martins"] },
      { label: "Direção:", lines: ["Marina Martins"] },
      { label: "Direção de fotografia:", lines: ["Marina Martins e Lia Miranda"] },
      { label: "Operação de câmera:", lines: ["Marina Martins e Lia Miranda"] },
      { label: "Direção de arte:", lines: ["Letícia Nunes"] },
      { label: "Design de produção:", lines: ["Lia Miranda"] },
      { label: "Produção:", lines: ["Wanessa Noleto"] },
      { label: "Direção de elenco:", lines: ["Lia Miranda"] },
      { label: "Maquiagem e figurino:", lines: ["Lia Miranda"] },
      { label: "Montagem, VFX e sonorização:", lines: ["Marina Martins"] },
      { label: "Elenco:", lines: ["Gabriel - Rapaz", "Lia Miranda - Moça"] }
    ]
  },
  "mors-desiderat": {
    title: "Mors Desiderat",
    author: "Lilian Pereira",
    videoSrc: "https://www.youtube.com/embed/aHvM_L3A6oE?si=NtYZzjrPbnGrhJ8p",
    videoTitle: "Mors Desiderat, curta de horror",
    credits: [
      { label: "Produção:", lines: ["Lilian Pereira"] },
      { label: "Direção:", lines: ["Lilian Pereira"] },
      { label: "Direção de arte:", lines: ["Sol Souza"] },
      { label: "Assistente de arte:", lines: ["Nabi Costa"] },
      { label: "Direção de fotografia:", lines: ["Lilian Pereira"] },
      { label: "Assistente de fotografia:", lines: ["Pedro Britto", "Mars"] },
      { label: "Roteiro e argumento:", lines: ["Lilian Pereira"] },
      { label: "Pós-produção:", lines: ["Lilian Pereira"] },
      { label: "Montagem:", lines: ["Lilian Pereira"] },
      {
        label: "Elenco:",
        lines: ["Evangeline - Sol Souza", "Lúcia (Vítima) - Wanessa Noleto", "Morte - Leticia Nunes"]
      }
    ]
  }
};

export function getVideo(slug) {
  return videos[slug];
}

export function getVideoSlugs() {
  return Object.keys(videos);
}

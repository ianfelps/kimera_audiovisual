import "./globals.css";

export const metadata = {
  title: {
    default: "KIMERA Audiovisual",
    template: "%s - KIMERA Audiovisual"
  },
  description: "Interface de catálogo, vídeo e rede social da KIMERA Audiovisual.",
  icons: {
    icon: "/img/logo.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Yuji+Boku&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        />
      </head>
      <body className="text-light" data-bs-theme="dark">
        {children}
      </body>
    </html>
  );
}

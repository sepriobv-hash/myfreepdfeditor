import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyFreePDFEditor",
    short_name: "MyFreePDFEditor",
    description: "Free PDF editor for editing PDFs online in your browser.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#e11d48",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

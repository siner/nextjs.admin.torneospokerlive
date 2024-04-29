import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base_url = process.env.BASE_URL || "https://www.torneospokerlive.com";
  return [
    {
      url: base_url,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: base_url + "/circuitos",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: base_url + "/casinos",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: base_url + "/eventos",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: base_url + "/eventos/pasados",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: base_url + "/torneos",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

const IMG = "https://framerusercontent.com/images";

export type ProjectAssetsSeed = {
  slug: string;
  year: string;
  liveUrl: string;
  cardImage: string;
  gallery: {
    hero: string;
    mosaicOne: { tall: string; top: string; bottom: string };
    mosaicTwo: { top: string; bottom: string; tall: string };
    wide: string;
  };
};

export const PROJECT_ASSETS: ProjectAssetsSeed[] = [
  {
    slug: "urban-glow",
    year: "2025",
    liveUrl: "https://brog.framer.website/projects/urban-glow",
    cardImage: `${IMG}/FtLqkZe3KwZWnfRLOTtcw7gbCMg.png?width=3072&height=3072`,
    gallery: {
      hero: `${IMG}/FtLqkZe3KwZWnfRLOTtcw7gbCMg.png?width=3072&height=3072`,
      mosaicOne: {
        tall: `${IMG}/KUdlOqPfRuMvubVwm89OTeIFRMo.png?width=800&height=1200`,
        top: `${IMG}/hKdPP16RynTulCqNt3kAg7aXs.png?width=678&height=1200`,
        bottom: `${IMG}/SEP0hIxRfRG59kQOd8lL40G3yWs.png?width=902&height=1200`,
      },
      mosaicTwo: {
        top: `${IMG}/SYiBMPPwkIRKdoV0l1qax0A.png?width=1500&height=2250`,
        bottom: `${IMG}/HIK9onQ4k8KGjwq99EDmJvandE.png?width=1024&height=1024`,
        tall: `${IMG}/6oXWQcW0g1kfW9rXnwDhfOoy10.png?width=1760&height=2336`,
      },
      wide: `${IMG}/lW9rHK6L1uzhYxdouF4wDvSiM.png?width=1500&height=1477`,
    },
  },
  {
    slug: "lunaris-health",
    year: "2025",
    liveUrl: "https://brog.framer.website/projects/lunaris-health",
    cardImage: `${IMG}/cAZRVl7cb12y0JvqyBTcP8X8Y.png?width=1024&height=853`,
    gallery: {
      hero: `${IMG}/cAZRVl7cb12y0JvqyBTcP8X8Y.png?width=1024&height=853`,
      mosaicOne: {
        tall: `${IMG}/MENF44jv3vvP9ouqWlv2AG3OzmI.png?width=800&height=1200`,
        top: `${IMG}/yIiUMXJoon44xe3SOzMh1ekTV6w.png?width=800&height=1200`,
        bottom: `${IMG}/0zkhQwEFfmIvItABo0rnH6XwDrA.png?width=800&height=1200`,
      },
      mosaicTwo: {
        top: `${IMG}/xTfsvmnar3EARwLdaZlYZGV4CSU.png?width=800&height=1200`,
        bottom: `${IMG}/d20InX0N58mvnO82X9ikXnMM.png?width=800&height=1200`,
        tall: `${IMG}/lQLsTJiqsB9ACEPrW1gQ30adDk.png?width=800&height=1200`,
      },
      wide: `${IMG}/7NKb1XnaG9Sdo8PyC0uT74Vk25w.png?width=1280&height=512`,
    },
  },
  {
    slug: "voltara",
    year: "2025",
    liveUrl: "https://brog.framer.website/projects/voltara",
    cardImage: `${IMG}/ENQulVrcO6bJqZGZdxbv3zX18.png?width=1024&height=853`,
    gallery: {
      hero: `${IMG}/ENQulVrcO6bJqZGZdxbv3zX18.png?width=1024&height=853`,
      mosaicOne: {
        tall: `${IMG}/I9zD3HhAEBHp7kFu73FETZTj5A8.png?width=800&height=1200`,
        top: `${IMG}/er1aOMKJCJuCxihFmaOaonRR58.png?width=800&height=1200`,
        bottom: `${IMG}/muneBgCd8tQMZUkqv7D7M6MoMc.png?width=800&height=1200`,
      },
      mosaicTwo: {
        top: `${IMG}/xzbPNePbVo1XEJ4a3O4V473BM.png?width=800&height=1200`,
        bottom: `${IMG}/PxSsJrthME1XjSwGQXwUMx7rI.png?width=800&height=1200`,
        tall: `${IMG}/JR6gofaz38J5kX4BQiMcn7nob4.png?width=800&height=1200`,
      },
      wide: `${IMG}/6r6tLlKin4YdRCER0gZK7UJpWI.png?width=1280&height=512`,
    },
  },
  {
    slug: "lumeo",
    year: "2024",
    liveUrl: "https://brog.framer.website/projects/raven-claw",
    cardImage: `${IMG}/kwiEPVb1yAyGWAYc0oUsCtvMdg.png?width=2912&height=1632`,
    gallery: {
      hero: `${IMG}/kwiEPVb1yAyGWAYc0oUsCtvMdg.png?width=2912&height=1632`,
      mosaicOne: {
        tall: `${IMG}/gykz5t3Atm9UtfI5YcnYcpGmng.png?width=800&height=1200`,
        top: `${IMG}/N5zcGiIfGyPsuZPiCmCURaba0.png?width=800&height=1200`,
        bottom: `${IMG}/bKD6QQYP4X5OziCLBiLi0aUFEUk.png?width=800&height=1200`,
      },
      mosaicTwo: {
        top: `${IMG}/mG3D4W3YgHIt19SJ1bMfBZPHhGU.png?width=800&height=1200`,
        bottom: `${IMG}/uBAfSHVa5Eb3SW2z97v14rBRQ.png?width=800&height=1200`,
        tall: `${IMG}/YETkcyql4JQULueeZE26WkYSSU.png?width=800&height=1200`,
      },
      wide: `${IMG}/15oW8s4Hy0PHlfLj7lmmjg9edqA.png?width=1280&height=512`,
    },
  },
];

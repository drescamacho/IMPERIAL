/* ==========================================================================
   CD IMPERIAL — Contenido editable de la web
   --------------------------------------------------------------------------
   Este archivo actúa como "panel de administración" mientras no exista un
   CMS. Cualquier dato de aquí (cifras de redes, enlaces, noticias,
   patrocinadores) se pinta automáticamente en la página.
   Para conectar un CMS (WordPress headless, Strapi, Sanity...) basta con
   sustituir este objeto por la respuesta JSON de su API.
   ========================================================================== */

window.IMPERIAL_CONFIG = {
  club: {
    name: "Club Deportivo Imperial",
    legalName: "Club Deportivo Elemental Imperial 2023",
    city: "Madrid, España",
    founded: 2023,
    federation: "Real Federación de Fútbol de Madrid (RFFM)",
    category: "Segunda Aficionados",
    season: "2026/27",
    stadium: "Polideportivo Ernesto Cotorruelo",
  },

  // Enlaces oficiales
  links: {
    instagram: "https://www.instagram.com/cd_imperial/",
    tiktok: "https://www.tiktok.com/@cd_imperial",
    youtube: "https://www.youtube.com/@cd_imperial",
    // PENDIENTE: pegar aquí el enlace oficial de la comunidad de WhatsApp
    // (p. ej. "https://chat.whatsapp.com/XXXXXXXX"). Mientras esté vacío,
    // el botón "Unirme a la comunidad" lleva a Instagram.
    whatsapp: "",
    // PENDIENTE: email de patrocinios. Vacío = mensaje directo de Instagram.
    sponsorEmail: "",
  },

  // Cifras de "Nuestra historia en cifras".
  // Las de redes sociales son aproximadas: actualizar periódicamente.
  stats: [
    { value: 2023, label: "Año de constitución", note: "Fundación del club" },
    { value: 2026, suffix: "/27", label: "Primera temporada federada", note: "Segunda Aficionados · RFFM" },
    { value: 72, prefix: "+", suffix: "K", label: "Comunidad en TikTok", note: "Cifra aproximada · pendiente de actualización" },
    { value: 10, prefix: "+", suffix: "K", label: "Comunidad en Instagram", note: "Cifra aproximada · pendiente de actualización" },
  ],

  // Noticias destacadas (se muestran las 3 primeras).
  // example: true => se marca como contenido de ejemplo hasta publicar noticias reales.
  news: [
    {
      category: "Primer equipo",
      date: "2026-10-04",
      title: "Arranca la primera temporada federada del Imperial en Segunda Aficionados",
      excerpt: "El primer equipo inicia su camino en la RFFM con el Polideportivo Ernesto Cotorruelo como casa.",
      image: "assets/img/player-strike.jpg",
      url: "#",
      example: true,
    },
    {
      category: "Club",
      date: "2026-09-20",
      title: "Así es la equipación oficial: Machu Picchu en el pecho, Madrid en el corazón",
      excerpt: "Una camiseta que cuenta de dónde venimos y hacia dónde vamos.",
      image: "assets/img/kit-home.jpg",
      url: "#",
      example: true,
    },
    {
      category: "Comunidad",
      date: "2026-09-12",
      title: "Imperial también eres tú: abrimos la comunidad oficial de aficionados",
      excerpt: "Únete para seguir partidos, convocatorias y la vida del club desde dentro.",
      image: "assets/img/player-back.jpg",
      url: "#",
      example: true,
    },
  ],

  // Patrocinadores y colaboradores activos.
  // Añadir SOLO marcas con autorización expresa. Formato:
  // { name: "Marca", logo: "assets/img/sponsors/marca.svg", url: "https://...", tier: "Patrocinador principal" }
  // Mientras la lista esté vacía se muestran espacios reservados.
  sponsors: [],
};

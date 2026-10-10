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
    // Comunidad oficial de WhatsApp (botón "Unirme a la comunidad").
    whatsapp: "https://chat.whatsapp.com/JszywmLwosSGKvacQMbRnj",
    // WhatsApp del club para patrocinios y colaboraciones.
    sponsorWhatsapp: "https://wa.me/34692254922",
  },

  // Cifras de "Nuestra historia en cifras".
  // Las de redes sociales son aproximadas: actualizar periódicamente.
  stats: [
    { value: 2023, label: "Año de constitución", note: "Fundación del club" },
    { value: 2026, suffix: "/27", label: "Primera temporada federada", note: "Segunda Aficionados · RFFM" },
    { value: 72, prefix: "+", suffix: "K", label: "Comunidad en TikTok", note: "Cifra aproximada · pendiente de actualización" },
    { value: 10, prefix: "+", suffix: "K", label: "Comunidad en Instagram", note: "Cifra aproximada · pendiente de actualización" },
  ],

  // Noticias destacadas: el club en los medios (enlaces externos).
  // date es opcional (AAAA-MM-DD); si falta, se muestra solo el medio.
  // image: portada cuadrada (900x900). Vacía => portada negra con el escudo.
  news: [
    {
      source: "El Comercio",
      category: "Perú",
      date: "",
      title: "CD Imperial: lo fundaron dos peruanos en España, tienen a Machu Picchu en el escudo y quieren ascender a LaLiga",
      image: "assets/img/prensa/elcomercio.webp",
      url: "https://elcomercio.pe/deporte-total/peruanos-en-el-mundo/cd-imperial-lo-fundaron-dos-peruanos-en-espana-tienen-a-machu-picchu-en-el-escudo-y-quieren-ascender-a-laliga-de-vinicius-y-kylian-mbappe-noticia/",
    },
    {
      source: "La República",
      category: "Perú",
      date: "2024-07-12",
      title: "El equipo de fútbol peruano en España que se coronó campeón de su categoría",
      image: "assets/img/prensa/larepublica.webp",
      url: "https://larepublica.pe/deportes/2024/07/12/este-es-el-unico-equipo-de-futbol-espanol-que-solo-acepta-peruanos-son-campeones-de-segunda-division-en-la-liga-espanola-evat-125736",
    },
    {
      source: "Exitosa",
      category: "Perú",
      date: "",
      title: "De pichangas a soñar con LaLiga: el Club Imperial busca llevar el nombre del Perú a la élite del fútbol español",
      image: "assets/img/prensa/exitosa.webp",
      url: "https://www.exitosanoticias.pe/deportes/de-pichangas-sonar-laliga-club-imperial-busca-llevar-nombre-peru-elite-futbol-espanol-n169507",
    },
    {
      source: "Los Profes del Fútbol",
      category: "",
      date: "2026-09-26",
      title: "Club Deportivo Imperial: el sueño peruano que comienza a jugarse en el fútbol español",
      image: "assets/img/prensa/losprofes.webp",
      url: "https://www.losprofesdelfutbol.com/2026/09/26/club-deportivo-imperial-madrid-futbol-espana/",
    },
    {
      source: "Infomercado",
      category: "Perú",
      date: "",
      title: "Club Deportivo Imperial: los estudiantes peruanos que formaron su club de fútbol en España",
      image: "assets/img/prensa/infomercado.webp",
      url: "https://infomercado.pe/deportivo-toque-fino-los-estudiantes-peruanos-que-formaron-su-club-de-futbol-en-espana/",
    },
  ],

  // Patrocinadores y colaboradores activos.
  // Añadir SOLO marcas con autorización expresa. Formato:
  // { name: "Marca", logo: "assets/img/sponsors/marca.svg", url: "https://...", tier: "Patrocinador principal" }
  // Mientras la lista esté vacía se muestran espacios reservados.
  sponsors: [
    { name: "Migra Easy", logo: "assets/img/sponsors/migraeasy.webp", url: "https://www.instagram.com/migraeasy/" },
    { name: "Tacoholic", logo: "assets/img/sponsors/tacoholic.webp", url: "https://www.instagram.com/tacoholic.es/" },
    { name: "Sentimiento Peruano", logo: "assets/img/sponsors/sentimiento-peruano.webp", url: "https://www.instagram.com/sentimientoperuano.es/" },
    { name: "Sumaq Relax", logo: "assets/img/sponsors/sumaq-relax.webp", url: "https://www.instagram.com/sumaq.relax/" },
  ],
};

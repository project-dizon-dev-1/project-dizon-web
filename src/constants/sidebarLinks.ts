const COMMON_LINKS = {
    dashboard: {
      label: "Dashboard",
      link: "/",
    //   icon: "mingcute:announcement-line",
    },
    announcements: {
      label: "Announcements",
      link: "/announcements",
    //   icon: "mingcute:calendar-time-add-line",

    },
    collection: {
      label: "Collection",
      link: "/collection",
    //   icon: "mingcute:calendar-time-add-line",

    },
    residents: {
      label: "Residents",
      link: "/residents",
    //   icon: "mingcute:group-3-line",
    },
    dues: {
        label: "Dues",
        link: "/dues",
      //   icon: "mingcute:group-3-line",
      },
  };
  
  export const SIDEBAR_LINKS = Object.freeze({
    admin: [
      COMMON_LINKS.dashboard,
      COMMON_LINKS.residents,
    ],
    finance: [
      COMMON_LINKS.dues,
      COMMON_LINKS.collection,
    ],
    // resident: [COMMON_LINKS.announcements, COMMON_LINKS.schedule],
  });
  
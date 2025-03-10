const COMMON_LINKS = {
  dashboard: {
    label: "Dashboard",
    link: "/",
      icon: "mingcute:chart-pie-2-line",
  },
  announcements: {
    label: "Announcements",
    link: "/announcements",
    icon: "mingcute:black-board-2-line",
  },
  collection: {
    label: "Collection",
    link: "/finance/collection",
    icon: "mingcute:task-line",
  },
  residents: {
    label: "Residents",
    link: "/residents",
      icon: "mingcute:house-line",
  },
  dues: {
    label: "Dues",
    link: "/finance/dues",
      icon: "mingcute:calendar-time-add-line",
  },
  financeDashboard: {
    label: "Dashboard",
    link: "/finance",
    icon: "mingcute:presentation-1-line"
  },
  paymenthistory: {
    label: "Payment History",
    link: "/finance/payment-history",
    icon:"mingcute:history-line"
  },
  
  
};

export const SIDEBAR_LINKS = Object.freeze({
  admin: [COMMON_LINKS.dashboard, COMMON_LINKS.residents,COMMON_LINKS.announcements],
  finance: [
    COMMON_LINKS.financeDashboard,
    COMMON_LINKS.dues,
    COMMON_LINKS.collection,
    COMMON_LINKS.paymenthistory
  ],
  // resident: [COMMON_LINKS.announcements, COMMON_LINKS.schedule],
});

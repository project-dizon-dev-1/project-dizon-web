const COMMON_LINKS = {
  dashboard: {
    label: "Dashboard",
    link: "/dashboard",
    icon: "mingcute:chart-pie-2-line",
  },
  announcements: {
    label: "Announcements",
    link: "/announcements",
    icon: "mingcute:black-board-2-line",
  },
  paymentCollection: {
    label: "Collection",
    link: "/collection",
    icon: "mingcute:task-line",
  },
  residents: {
    label: "Residents",
    link: "/residents",
    icon: "mingcute:house-line",
  },
  expenses: {
    label: "Monthly Expenses",
    link: "/expenses",
    icon: "mingcute:calendar-time-add-line",
  },
  financeOverview: {
    label: "Finance Overview",
    link: "/finance-overview",
    icon: "mingcute:presentation-1-line",
  },
  paymentHistory: {
    label: "Collection History",
    link: "/history",
    icon: "mingcute:history-line",
  },
  transactions: {
    label: "Transactions",
    link: "/transactions",
    icon: "mingcute:pig-money-line",
  },
  auditLogs: {
    label: "Audit Logs",
    link: "/audit-logs",
    icon: "mingcute:file-check-line",
  },
  financeLogs: {
    label: "Transaction History",
    link: "/financial-logs",
    icon: "mingcute:file-check-line",
  },
};

export const SIDEBAR_LINKS = Object.freeze({
  resident: [
    COMMON_LINKS.dashboard,
    COMMON_LINKS.announcements,
    COMMON_LINKS.paymentHistory,
  ],
  admin: [
    COMMON_LINKS.dashboard,
    COMMON_LINKS.residents,
    COMMON_LINKS.announcements,
  ],
  finance: [
    COMMON_LINKS.financeOverview,
    COMMON_LINKS.expenses,
    COMMON_LINKS.paymentCollection,
    COMMON_LINKS.paymentHistory,
    COMMON_LINKS.transactions,
    COMMON_LINKS.auditLogs,
    COMMON_LINKS.financeLogs,
  ],
  // resident: [COMMON_LINKS.announcements, COMMON_LINKS.schedule],
});

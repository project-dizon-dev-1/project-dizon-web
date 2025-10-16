const COMMON_LINKS = {
  villageDashboard: {
    label: 'Village Dashboard',
    link: '/village-dashboard',
    icon: 'mingcute:home-3-line',
  },
  announcements: {
    label: 'Announcements',
    link: '/announcements',
    icon: 'mingcute:black-board-2-line',
  },
  paymentCollection: {
    label: 'Collection',
    link: '/collection',
    icon: 'mingcute:task-line',
  },
  residents: {
    label: 'Residents',
    link: '/residents',
    icon: 'mingcute:house-line',
  },
  expenses: {
    label: 'Monthly Expenses',
    link: '/expenses',
    icon: 'mingcute:calendar-time-add-line',
  },
  financeOverview: {
    label: 'Finance Overview',
    link: '/finance-overview',
    icon: 'mingcute:presentation-1-line',
  },
  collectionHistory: {
    label: 'Collection History',
    link: '/history',
    icon: 'mingcute:history-line',
  },
  paymentHistory: {
    label: 'Payment History',
    link: '/payment-history',
    icon: 'mingcute:history-line',
  },
  financeLogs: {
    label: 'Transactions',
    link: '/financial-logs',
    icon: 'mingcute:book-2-line',
  },
  manageSubdivision: {
    label: 'Subdivision',
    link: '/subdivision',
    icon: 'mingcute:building-1-line',
  },
  users: {
    label: 'Users',
    link: '/users',
    icon: 'mingcute:group-3-line',
  },
};

export const SIDEBAR_LINKS = Object.freeze({
  resident: [COMMON_LINKS.announcements, COMMON_LINKS.paymentHistory],
  admin: [
    COMMON_LINKS.villageDashboard, // 🆕 Added here
    COMMON_LINKS.residents,
    COMMON_LINKS.announcements,
    COMMON_LINKS.paymentHistory,
    COMMON_LINKS.manageSubdivision,
  ],
  superadmin: [
    COMMON_LINKS.villageDashboard, // 🆕 Added here
    COMMON_LINKS.residents,
    COMMON_LINKS.announcements,
    COMMON_LINKS.manageSubdivision,
    COMMON_LINKS.users,
  ],
  finance: [
    COMMON_LINKS.financeOverview,
    COMMON_LINKS.financeLogs,
    COMMON_LINKS.expenses,
    COMMON_LINKS.paymentCollection,
    COMMON_LINKS.collectionHistory,
  ],
});

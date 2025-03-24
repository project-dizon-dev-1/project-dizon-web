import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import MainLayout from "@/layouts/MainLayout";
import CheckAuth from "./components/CheckAuth";
import GuestRoute from "./components/GuestRoute";
import NotFound from "./pages/NotFound";
import Residents from "@/pages/Residents";
import Dashboard from "./pages/Dashboard";
import Collection from "@/pages/Collection";
import Dues from "./pages/Dues";
import PaymentHistory from "./pages/PaymentHistory";
import Announcements from "./pages/Announcements";
import ResidentDetails from "./pages/ResidentDetails";
import CollectionDetails from "./pages/CollectionDetails";
import FinanceOverview from "./pages/FinanceOverview";
import Transactions from "./pages/Transactions";
import AuditLogs from "./pages/AuditLogs";
import FinancialLogs from "./pages/FinancialLogs";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect the root path to /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<CheckAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/collection/:phase" element={<CollectionDetails />} />
            <Route path="/residents" element={<Residents />} />
            <Route path="residents/:houseId" element={<ResidentDetails />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/history" element={<PaymentHistory />} />
            <Route path="/finance-overview" element={<FinanceOverview />} />
            <Route path="/expenses" element={<Dues />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/financial-logs" element={<FinancialLogs />} />
            {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

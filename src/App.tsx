import { BrowserRouter as Router, Routes, Route } from "react-router";
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
import CollectionHistory from "./pages/CollectionHistory";
import Announcements from "./pages/Announcements";
import ResidentDetails from "./pages/ResidentDetails";
import CollectionDetails from "./pages/CollectionDetails";
import FinanceOverview from "./pages/FinanceOverview";
import AuditLogs from "./pages/AuditLogs";
import FinancialLogs from "./pages/FinancialLogs";
import PaymentHistory from "./pages/PaymentHistory";
import ManageSubdivision from "./pages/SubdivisionManagement";
import Profile from "./pages/Profile";
import FeedbackForm from "./pages/FeedbackForm";
import SendResetPassword from "./pages/SendResetPassword";
import PasswordRecovery from "./pages/PasswordRecovery";
import Homepage from "./pages/Homepage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<SendResetPassword />} />
        </Route>
        <Route element={<CheckAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/collection/:phase" element={<CollectionDetails />} />
            <Route path="/residents" element={<Residents />} />
            <Route path="residents/:houseId" element={<ResidentDetails />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/history" element={<CollectionHistory />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/finance-overview" element={<FinanceOverview />} />
            <Route path="/expenses" element={<Dues />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/subdivision" element={<ManageSubdivision />} />
            <Route path="/financial-logs" element={<FinancialLogs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/send-feedback" element={<FeedbackForm />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />

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

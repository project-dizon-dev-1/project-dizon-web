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
import Expenses from "./pages/Expenses";
import CollectionHistory from "./pages/CollectionHistory";
import Announcements from "./pages/Announcements";
import ResidentDetails from "./pages/ResidentDetails";
import CollectionDetails from "./pages/CollectionDetails";
import FinanceOverview from "./pages/FinanceOverview";
import AuditLogs from "./pages/AuditLogs";
import PaymentHistory from "./pages/PaymentHistory";
import ManageSubdivision from "./pages/SubdivisionManagement";
import Profile from "./pages/Profile";
import FeedbackForm from "./pages/FeedbackForm";
import SendResetPassword from "./pages/SendResetPassword";
import PasswordRecovery from "./pages/PasswordRecovery";
import Homepage from "./pages/Homepage";
import Contact from "./pages/Contact";
import AuthorizeByRole from "./components/AuthorizeByRole";
import TransactionHistory from "./pages/TransactionHistory";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<SendResetPassword />} />
        </Route>
        <Route element={<CheckAuth />}>
          <Route element={<MainLayout />}>
            <Route element={<AuthorizeByRole roles={["admin", "resident"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/payment-history" element={<PaymentHistory />} />
              <Route path="/announcements" element={<Announcements />} />
            </Route>
            <Route element={<AuthorizeByRole roles={["admin"]} />}>
              <Route path="/collection" element={<Collection />} />
              <Route
                path="/collection/:phase"
                element={<CollectionDetails />}
              />
              <Route path="/residents" element={<Residents />} />
              <Route path="residents/:houseId" element={<ResidentDetails />} />
              <Route path="/history" element={<CollectionHistory />} />
              <Route path="/finance-overview" element={<FinanceOverview />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/subdivision" element={<ManageSubdivision />} />
              <Route path="/financial-logs" element={<TransactionHistory />} />
            </Route>

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

import { BrowserRouter, Route, Routes } from "react-router";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import MainLayout from "@/layouts/MainLayout";
import CheckAuth from "./components/CheckAuth";
import GuestRoute from "./components/GuestRoute";
import NotFound from "./pages/NotFound";
import Residents from "@/pages/Residents";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import Dues from "./pages/Dues";

const App = () => {
return (
    <BrowserRouter>
      <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<CheckAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/residents" element={<Residents />} />
            <Route path="/dues" element={<Dues />} />
             {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
     
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import { BrowserRouter, Route, Routes } from "react-router";
import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";

const App = () => {
  return (<BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
</BrowserRouter>);
};

export default App;

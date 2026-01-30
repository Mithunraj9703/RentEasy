import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./pages/Header";
import Hero from "./pages/Hero";
import Footer from "./pages/Footer";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Hero />} />

          {/* Auth Pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* 404 */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

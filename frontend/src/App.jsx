import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./pages/Header";
import Hero from "./pages/Hero";
import Footer from "./pages/Footer";
import Layout from "./Layout";
import FireBaseLogin from "./pages/FireBaseLogin";
import ListingDetails from "./pages/ListingDetails";
import { useEffect, useState } from "react";
import { UserProvider } from "./context/UserContext";
import { checkAuth } from "./api/auth.jsx";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchAuth = async () => {
      const data = await checkAuth();
      setIsAuthenticated(data.isAuthenticated);
      setUser(data.user || null);
    };
    fetchAuth()
  }, []);

  return (
    <BrowserRouter>
      <UserProvider value={{ isAuthenticated, user, setUser, setIsAuthenticated }}>
      <Layout >
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Hero />} />

          {/* Auth Pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/google_login" element={<FireBaseLogin />} />
          
          <Route path="/listing/:id" element={<ListingDetails />} />

          {/* 404 */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
        </Layout>
        </UserProvider>
    </BrowserRouter>
  );
}

export default App;

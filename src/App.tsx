// src/App.tsx
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Foodlog from "./pages/FoodLog";
import Activitylog from "./pages/Activitylog";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Loading from "./components/ui/Loading";
import Onboarding from "./pages/Onboarding";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const {
    user,
    isUserFetched,
    onboardingCompleted,
  } = useAppContext();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  if (!isUserFetched) return <Loading />;
  if (!user) return <Login />;
  if (!onboardingCompleted) return <Onboarding />;

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Dashboard no longer needs a user prop */}
          <Route index element={<Dashboard />} />
          <Route path="food" element={<Foodlog />} />
          <Route path="activity" element={<Activitylog />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
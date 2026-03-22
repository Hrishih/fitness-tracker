// src/pages/Layout.tsx
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BottomNav from "../components/ui/BottomNav";

// Sidebar icons (keep same as before)
const HomeIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9v9a3 3 0 01-3 3h-3a3 3 0 01-3-3v-6H9v6a3 3 0 01-3 3H3a3 3 0 01-3-3v-9z" />
</svg>;

// Dummy icons for other routes
const FoodIcon = () => <div className="w-6 h-6 bg-yellow-400 rounded"></div>;
const ActivityIcon = () => <div className="w-6 h-6 bg-green-400 rounded"></div>;
const ProfileIcon = () => <div className="w-6 h-6 bg-blue-400 rounded"></div>;

const links = [
  { name: "Home", path: "/", icon: <HomeIcon /> },
  { name: "Food", path: "/food", icon: <FoodIcon /> },
  { name: "Activity", path: "/activity", icon: <ActivityIcon /> },
  { name: "Profile", path: "/profile", icon: <ProfileIcon /> },
];

export default function Layout() {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen flex`}>
      {/* Sidebar */}
      <div className="hidden md:flex w-64 p-6 border-r border-gray-700 flex-col justify-between">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-yellow-400">MyApp</h1>
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? "bg-yellow-400 text-gray-900"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-200"
                }`}
              >
                {link.icon} <span className="font-semibold">{link.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-3 p-3 rounded-lg justify-center font-semibold transition-colors ${
            darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet /> {/* This renders nested routes like Dashboard */}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
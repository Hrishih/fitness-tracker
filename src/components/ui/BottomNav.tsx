import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Utensils, Activity, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/food', icon: Utensils, label: 'Food' },
    { path: '/activity', icon: Activity, label: 'Activity' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-200",
            location.pathname === item.path
              ? "text-emerald-500"
              : "text-slate-400 dark:text-slate-500"
          )}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;

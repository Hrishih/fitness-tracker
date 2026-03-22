// src/pages/Profile.tsx
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { 
  User, Calendar, Scale, Ruler, Target, 
  LogOut, Moon, Sun, Key 
} from 'lucide-react';
import API from '../config/api';
import toast from 'react-hot-toast';
import { goalOptions, goalLabels } from '../assets/assets';

const Profile = () => {
  const { user, logout, fetchUser, allFoodLogs, allActivityLogs } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: "" as string | number, 
    weight: "" as string | number, 
    height: "" as string | number, 
    goal: 'maintain',
    dailyCaloriesIntake: 2000, 
    dailyCaloriesBurned: 400,
    customApiKey: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        age: user.age || "",
        weight: user.weight || "",
        height: user.height || "",
        goal: user.goal || 'maintain',
        dailyCaloriesIntake: user.dailyCaloriesIntake || 2000,
        dailyCaloriesBurned: user.dailyCaloriesBurned || 400,
        customApiKey: user.customApiKey || ""
      });
    }
  }, [user]);

  const stats = {
    totalFoodEntries: allFoodLogs?.length || 0,
    totalActivities: allActivityLogs?.length || 0
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await API.put(`/api/users/${user.id}`, formData);
      await fetchUser(user.token);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (!user) return null;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-slate-500">Manage your settings</p>
      </header>

      <div className="profile-content grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-6 border-b flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-full text-white"><User size={24} /></div>
            <div>
              <h2 className="text-xl font-bold">{user.username}</h2>
              <p className="text-sm text-slate-500">
                Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
              </p>
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                <Input 
                  label="Age" 
                  type="number" 
                  value={formData.age} 
                  onChangeValue={(v) => setFormData({...formData, age: Number(v)})} 
                />
                <Input 
                  label="Weight (kg)" 
                  type="number" 
                  value={formData.weight} 
                  onChangeValue={(v) => setFormData({...formData, weight: Number(v)})} 
                />
                <Input 
                  label="Height (cm)" 
                  type="number" 
                  value={formData.height} 
                  onChangeValue={(v) => setFormData({...formData, height: Number(v)})} 
                />
                <Select 
                  label="Fitness Goal" 
                  options={goalOptions} 
                  value={formData.goal} 
                  onChangeValue={(v) => setFormData({...formData, goal: v.toString()})} 
                />
                <div className="flex gap-4 mt-6">
                  <Button variant="secondary" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button className="flex-1" onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Calendar className="text-blue-500" />
                  <div>
                    <p className="text-xs text-slate-500">Age</p>
                    <p className="font-semibold">{user.age ?? "Unknown"} years</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Scale className="text-purple-500" />
                  <div>
                    <p className="text-xs text-slate-500">Weight</p>
                    <p className="font-semibold">{user.weight ?? "Unknown"} kg</p>
                  </div>
                </div>

                {user.height !== undefined && (
                  <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <Ruler className="text-green-500" />
                    <div>
                      <p className="text-xs text-slate-500">Height</p>
                      <p className="font-semibold">{user.height} cm</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Target className="text-orange-500" />
                  <div>
                    <p className="text-xs text-slate-500">Goal</p>
                    <p className="font-semibold">
                      {goalLabels[user.goal as keyof typeof goalLabels] || "Unknown"}
                    </p>
                  </div>
                </div>

                <Button variant="secondary" className="w-full mt-4" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Key size={18} className="text-blue-500" />
              API Settings
            </h3>
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Provide your own Gemini API Key to use for AI Food Analysis.
              </p>
              <Input 
                placeholder="Enter Gemini API Key"
                type="password"
                value={formData.customApiKey}
                onChangeValue={(v) => setFormData({...formData, customApiKey: v.toString()})}
              />
              <Button 
                variant="secondary" 
                className="w-full text-xs"
                onClick={handleSave}
              >
                Save API Key
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <p className="text-2xl font-bold text-orange-600">{stats.totalFoodEntries}</p>
                <p className="text-xs text-slate-500">Food Entries</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">{stats.totalActivities}</p>
                <p className="text-xs text-slate-500">Activities</p>
              </div>
            </div>
          </Card>

          <Button variant="secondary" className="w-full lg:hidden gap-2" onClick={toggleTheme}>
            {theme === 'light' ? <><Moon size={18}/> Dark Mode</> : <><Sun size={18}/> Light Mode</>}
          </Button>

          <Button variant="danger" className="w-full gap-2" onClick={logout}>
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
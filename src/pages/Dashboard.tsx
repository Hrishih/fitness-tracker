// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import CaloriesChart from "../components/CaloriesChart";
import { getMotivationalMessage } from "../assets/assets";
import {
  Utensils as Hamburger,
  Flame,
  Activity,
  Zap,
  Scale,
  Ruler,
} from "lucide-react";
import type { FoodEntry, ActivityEntry } from "../types";

const Dashboard = () => {
  const { user, allActivityLogs = [], allFoodLogs = [] } = useAppContext();

  const [todayFood, setTodayFood] = useState<FoodEntry[]>([]);
  const [todayActivities, setTodayActivities] = useState<ActivityEntry[]>([]);

  // ✅ FIXED DATE LOGIC
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const foodData = allFoodLogs.filter((f: FoodEntry) =>
      f.created_at?.split("T")[0] === today
    );

    const activityData = allActivityLogs.filter((a: ActivityEntry) =>
      a.created_at?.split("T")[0] === today
    );

    setTodayFood(foodData);
    setTodayActivities(activityData);
  }, [allActivityLogs, allFoodLogs]);

  // ✅ SAFE CALCULATIONS WITH TYPES
  const dailyCalorieLimit = user?.dailyCaloriesIntake || 2000;

  const totalCalories = todayFood.reduce(
    (sum: number, item: FoodEntry) => sum + (item.calories || 0),
    0
  );

  const totalBurned = todayActivities.reduce(
    (sum: number, item: ActivityEntry) => sum + (item.calories || 0),
    0
  );

  const remainingCalories = dailyCalorieLimit - totalCalories;

  const totalActiveMinutes = todayActivities.reduce(
    (sum: number, item: ActivityEntry) => sum + (item.duration || 0),
    0
  );

  // ✅ Motivation
  const motivation = getMotivationalMessage(
    totalCalories,
    totalActiveMinutes,
    dailyCalorieLimit
  );

  // ✅ BMI
  const bmi =
    user?.weight && user?.height
      ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1)
      : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-slate-400">Welcome back,</p>
        <h1 className="text-2xl font-bold">
          Hi 👋 {user?.username || "User"}
        </h1>

        {/* Motivation */}
        <div className="mt-4 p-4 bg-slate-800 rounded-xl flex items-center gap-4">
          <span className="text-2xl">{motivation.emoji}</span>
          <p>{motivation.text}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Calories */}
        <Card>
          <div className="flex justify-between mb-4">
            <div className="flex gap-2 items-center">
              <Hamburger className="text-orange-500" />
              <div>
                <p className="text-sm text-gray-400">Consumed</p>
                <p className="font-bold">{totalCalories} kcal</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Limit</p>
              <p className="font-bold">{dailyCalorieLimit}</p>
            </div>
          </div>

          {/* ✅ If your ProgressBar only takes value */}
          <ProgressBar value={totalCalories} />

          <p className="mt-2 text-sm">
            {remainingCalories >= 0
              ? `${remainingCalories} kcal remaining`
              : `${Math.abs(remainingCalories)} kcal over`}
          </p>

          <hr className="my-4" />

          {/* Burned */}
          <div className="flex gap-2 items-center">
            <Flame className="text-blue-500" />
            <p>{totalBurned} kcal burned</p>
          </div>
        </Card>

        {/* Activity */}
        <Card>
          <div className="flex items-center gap-2">
            <Activity className="text-blue-500" />
            <p>Active Time</p>
          </div>
          <p className="text-2xl font-bold">
            {totalActiveMinutes} min
          </p>

          <div className="flex items-center gap-2 mt-4">
            <Zap className="text-yellow-500" />
            <p>{todayActivities.length} workouts</p>
          </div>
        </Card>

        {/* Body Metrics */}
        <Card>
          <h3 className="font-semibold mb-2">Body Metrics</h3>
          <p><Scale size={14} /> Weight: {user?.weight || "--"} kg</p>
          <p><Ruler size={14} /> Height: {user?.height || "--"} cm</p>

          {bmi && (
            <p className="mt-2 text-blue-400">BMI: {bmi}</p>
          )}
        </Card>

        {/* Graph */}
        <Card>
          <h3 className="font-semibold mb-2">Weekly Progress</h3>
          <CaloriesChart />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
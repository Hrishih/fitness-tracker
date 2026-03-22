import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Plus, Activity, Trash2, Dumbbell } from "lucide-react";
import API from "../config/api";
import toast from "react-hot-toast";
import { quickActivities } from "../assets/assets";
import type { ActivityEntry } from "../types";

interface QuickActivity {
  name: string;
  emoji: string;
  rate: number; // calories per 30 minutes
}

const ActivityLog = () => {
  const { allActivityLogs = [], setAllActivityLogs } = useAppContext();

  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    duration: "" as string | number,
    calories: "" as string | number,
  });

  const today = new Date().toISOString().split("T")[0];

  const loadActivities = () => {
    const todayActivities = allActivityLogs.filter(
      (a: ActivityEntry) => a.created_at?.split("T")[0] === today
    );
    setActivities(todayActivities);
  };

  useEffect(() => {
    loadActivities();
  }, [allActivityLogs]);

  const totalMinutes = activities.reduce(
    (sum: number, a: ActivityEntry) => sum + (a.duration || 0),
    0
  );

  const handleQuickAdd = (activity: QuickActivity) => {
    setFormData({
      name: activity.name,
      duration: 30,
      calories: 30 * activity.rate,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const duration = Number(formData.duration);
    const calories = Number(formData.calories);
    
    if (!formData.name || isNaN(duration) || duration <= 0) {
      return toast.error("Please enter valid data");
    }

    try {
      const { data } = await API.post("/api/activity-logs", { 
        data: { ...formData, duration, calories } 
      });
      setAllActivityLogs((prev: ActivityEntry[]) => [...prev, data]);
      setFormData({ name: "", duration: "", calories: "" });
      setShowForm(false);
      toast.success("Activity added!");
    } catch (err) {
      toast.error("Failed to add activity");
    }
  };

  const handleDelete = async (documentId?: string) => {
    if (!documentId) return;
    if (!window.confirm("Delete this activity?")) return;

    try {
      await API.delete(`/api/activity-logs/${documentId}`);
      setAllActivityLogs((prev: ActivityEntry[]) =>
        prev.filter((a) => a.documentId !== documentId)
      );
      toast.success("Deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activity Log</h1>
          <p className="text-gray-400">Track your workouts</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Active Today</p>
          <p className="text-2xl font-bold text-blue-500">{totalMinutes} min</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="space-y-4">
          {!showForm ? (
            <>
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Quick Add</h3>
                <div className="flex flex-wrap gap-2">
                  {quickActivities.map((item: QuickActivity) => (
                    <Button
                      key={item.name}
                      variant="secondary"
                      onClick={() => handleQuickAdd(item)}
                    >
                      {item.emoji} {item.name}
                    </Button>
                  ))}
                </div>
              </Card>

              <Button onClick={() => setShowForm(true)}>
                <Plus /> Add Activity
              </Button>
            </>
          ) : (
            <Card className="p-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  placeholder="Activity name"
                  value={formData.name}
                  onChangeValue={(v) =>
                    setFormData({ ...formData, name: v.toString() })
                  }
                />

                <Input
                  type="number"
                  placeholder="Duration (min)"
                  value={formData.duration}
                  onChangeValue={(v) =>
                    setFormData({ ...formData, duration: Number(v) })
                  }
                />

                <Input
                  type="number"
                  placeholder="Calories"
                  value={formData.calories}
                  onChangeValue={(v) =>
                    setFormData({ ...formData, calories: Number(v) })
                  }
                />

                <div className="flex gap-2">
                  <Button type="button" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add</Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* RIGHT */}
        <div>
          {activities.length === 0 ? (
            <Card className="p-6 text-center text-gray-400">
              <Dumbbell size={40} className="mx-auto mb-2 opacity-30" />
              No activity logged today
            </Card>
          ) : (
            <Card className="p-4">
              <h3 className="font-bold mb-3 flex gap-2 items-center">
                <Activity className="text-blue-500" />
                Today's Activities
              </h3>

              {activities.map((item) => (
                <div key={item.id} className="flex justify-between p-2 border-b">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleTimeString()
                        : ""}
                    </p>
                  </div>

                  <div className="flex gap-3 items-center">
                    <span>{item.duration} min</span>
                    <span>{item.calories} cal</span>

                    <Button
                      variant="secondary" // ✅ Changed from "ghost" to allowed variant
                      onClick={() => handleDelete(item.documentId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="mt-4 font-bold">Total: {totalMinutes} min</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
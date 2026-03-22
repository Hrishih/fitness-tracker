// src/pages/FoodLog.tsx
import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { Plus, Sparkles, Loader2, Apple } from "lucide-react";
import API from "../config/api";
import toast from "react-hot-toast";
import { GoogleGenAI } from "@google/genai";
import {
  quickActivitiesFoodLog,
  mealTypeOptions,
} from "../assets/assets";
import type { FoodEntry } from "../types";

const FoodLog = () => {
  const { user, allFoodLogs = [], setAllFoodLogs } = useAppContext();

  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use string for calories to handle empty input correctly
  const [formData, setFormData] = useState({
    name: "",
    calories: "" as string | number,
    mealType: "",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split("T")[0];

  const loadEntries = () => {
    const todayEntries = allFoodLogs.filter(
      (e: FoodEntry) => e.created_at?.split("T")[0] === today
    );
    setEntries(todayEntries);
  };

  useEffect(() => {
    loadEntries();
  }, [allFoodLogs]);

  const totalCalories = entries.reduce(
    (sum, e) => sum + (e.calories || 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const calories = Number(formData.calories);
    if (!formData.name || isNaN(calories) || calories <= 0 || !formData.mealType) {
      return toast.error("Please enter valid data");
    }

    try {
      const { data } = await API.post("/api/food-logs", { 
        data: { ...formData, calories } 
      });
      setAllFoodLogs((prev: any) => [...prev, data]);
      setFormData({ name: "", calories: "", mealType: "" });
      setShowForm(false);
      toast.success("Food added!");
    } catch (error) {
      toast.error("Failed to add food");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Use user's custom key if available, otherwise fallback to platform key
      const apiKey = user?.customApiKey || process.env.GEMINI_API_KEY!;
      
      if (!apiKey) {
        throw new Error("No API Key found. Please set one in your Profile.");
      }

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const base64String = await base64Promise;
      const base64Data = base64String.split(',')[1];

      // Use Gemini to analyze
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: "Analyze this food image and return a JSON object with 'name' (string) and 'calories' (number). Return ONLY the JSON object, no other text." },
              { inlineData: { data: base64Data, mimeType: file.type } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
        }
      });

      let text = response.text || "{}";
      // Clean up markdown if present
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const result = JSON.parse(text);
      
      const calories = Number(result.calories);
      const name = result.name || result.food || result.item;
      
      if (!name || isNaN(calories)) {
        console.error("AI returned invalid data:", result);
        throw new Error("AI could not identify food or calories clearly.");
      }

      const hour = new Date().getHours();
      let mealType = "Snack";
      if (hour < 12) mealType = "Breakfast";
      else if (hour < 16) mealType = "Lunch";
      else mealType = "Dinner";

      const newEntry = await API.post("/api/food-logs", {
        data: {
          name: name.toString(),
          calories: calories,
          mealType,
        },
      });

      setAllFoodLogs((prev: any) => [...prev, newEntry.data]);
      toast.success(`AI identified: ${result.name} (${result.calories} cal)`);
    } catch (error) {
      console.error("AI Analysis error:", error);
      toast.error("AI Analysis failed. Please try again.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const groupedEntries = entries.reduce((acc: any, entry) => {
    const type = entry.mealType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(entry);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Food Log</h1>
          <p className="text-gray-400">Track your daily intake</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Today's Total</p>
          <p className="text-2xl font-bold text-orange-500">{totalCalories} cal</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {!showForm ? (
            <>
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Quick Add</h3>
                <div className="flex flex-wrap gap-2">
                  {quickActivitiesFoodLog.map((item) => (
                    <Button
                      key={item.name}
                      variant="secondary"
                      onClick={() => {
                        setFormData({ ...formData, mealType: item.name });
                        setShowForm(true);
                      }}
                    >
                      {item.emoji} {item.name}
                    </Button>
                  ))}
                </div>
              </Card>

              <Button onClick={() => setShowForm(true)}>
                <Plus /> Add Food
              </Button>

              <Button
                className="bg-purple-600 text-white"
                onClick={() => inputRef.current?.click()}
              >
                <Sparkles /> AI Food Snap
              </Button>

              <input type="file" hidden ref={inputRef} onChange={handleImageChange} />
              {loading && <Loader2 className="animate-spin" />}
            </>
          ) : (
            <Card className="p-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  placeholder="Food name"
                  value={formData.name}
                  onChangeValue={(v) => setFormData({ ...formData, name: v.toString() })}
                />
                <Input
                  type="number"
                  value={formData.calories}
                  onChangeValue={(v) => setFormData({ ...formData, calories: Number(v) })}
                />
                <Select
                  options={mealTypeOptions}
                  value={formData.mealType}
                  onChangeValue={(v) => setFormData({ ...formData, mealType: v.toString() })}
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

        <div>
          {entries.length === 0 ? (
            <Card className="p-6 text-center text-gray-400">
              <Apple size={40} className="mx-auto mb-2 opacity-30" />
              No food logged today
            </Card>
          ) : (
            Object.keys(groupedEntries).map((meal) => (
              <Card key={meal} className="p-4 mb-4">
                <h3 className="font-bold mb-2">{meal}</h3>
                {groupedEntries[meal].map((entry: FoodEntry) => (
                  <div key={entry.id} className="flex justify-between p-2">
                    <span>{entry.name}</span>
                    <span>{entry.calories} cal</span>
                  </div>
                ))}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodLog;
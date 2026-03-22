import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock database
const users: any[] = [
  {
    id: 1,
    username: "demo",
    email: "demo@example.com",
    password: "password123",
    age: 25,
    weight: 70,
    height: 175,
    goal: "maintain",
    dailyCaloriesIntake: 2000,
    dailyCaloriesBurned: 500,
    created_at: new Date().toISOString()
  }
];
const foodLogs: any[] = [];
const activityLogs: any[] = [];

// Auth Routes
app.post("/api/auth/local/register", (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: { message: "Missing fields" } });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: { message: "Email already exists" } });
  }

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password, // In a real app, hash this!
    age: null,
    weight: null,
    height: null,
    goal: null,
    dailyCaloriesIntake: 2000,
    dailyCaloriesBurned: 500,
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  res.json({
    jwt: "mock-token-" + newUser.id,
    user: userWithoutPassword
  });
});

app.post("/api/auth/local", (req, res) => {
  const { identifier, password } = req.body;

  const user = users.find(u => u.email === identifier && u.password === password);
  if (!user) {
    return res.status(400).json({ error: { message: "Invalid credentials" } });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    jwt: "mock-token-" + user.id,
    user: userWithoutPassword
  });
});

app.get("/api/users/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.replace("mock-token-", ""));
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// User Update
app.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) return res.status(404).json({ error: "User not found" });

  const updatedData = { ...req.body };
  
  // Calculate daily calorie intake if age, weight, and height are provided
  if (updatedData.age && updatedData.weight && updatedData.height) {
    const age = Number(updatedData.age);
    const weight = Number(updatedData.weight);
    const height = Number(updatedData.height);
    const goal = updatedData.goal || users[userIndex].goal || 'maintain';

    // Basic BMR calculation (Mifflin-St Jeor average)
    // (10 * weight) + (6.25 * height) - (5 * age) + 5 (average of male/female)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    
    // Adjust based on goal
    if (goal === 'lose') bmr -= 500;
    else if (goal === 'gain') bmr += 500;
    
    updatedData.dailyCaloriesIntake = Math.round(bmr);
    updatedData.dailyCaloriesBurned = 300; // Default baseline
  }

  users[userIndex] = { ...users[userIndex], ...updatedData };
  const { password: _, ...userWithoutPassword } = users[userIndex];
  res.json(userWithoutPassword);
});

// Logs Routes
app.get("/api/food-logs", (req, res) => {
  res.json(foodLogs);
});

app.post("/api/food-logs", (req, res) => {
  const newLog = { id: Date.now(), ...req.body.data, created_at: new Date().toISOString() };
  foodLogs.push(newLog);
  res.json(newLog);
});

app.get("/api/activity-logs", (req, res) => {
  res.json(activityLogs);
});

app.post("/api/activity-logs", (req, res) => {
  const newLog = { 
    id: Date.now(), 
    documentId: "doc-" + Date.now(),
    ...req.body.data, 
    created_at: new Date().toISOString() 
  };
  activityLogs.push(newLog);
  res.json(newLog);
});

app.delete("/api/activity-logs/:id", (req, res) => {
  const id = req.params.id;
  const index = activityLogs.findIndex(a => a.documentId === id || a.id.toString() === id);
  if (index !== -1) {
    activityLogs.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Log not found" });
  }
});

// Mock AI Image Analysis
app.post("/api/image-analysis", (req, res) => {
  // Simulate AI analysis
  setTimeout(() => {
    res.json({
      result: {
        name: "Healthy Salad",
        calories: 350
      }
    });
  }, 1500);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

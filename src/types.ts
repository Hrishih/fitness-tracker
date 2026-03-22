// src/types.ts
import React from 'react';

export type User = {
    id: string;
    email: string;
    username: string;
    token: string;
    documentId?: string;
    age?: number;
    weight?: number;
    height?: number;
    goal?: "lose" | "maintain" | "gain";
    dailyCaloriesIntake?: number;
    dailyCaloriesBurned?: number;
    createdAt?: string;
    created_at?: string;
    customApiKey?: string;
} | null;

export type Credentials = {
    username?: string;
    email: string;
    password: string;
};

export interface UserData {
    name: string;
    age: number;
    weight: number;
    height: number | null;
    goal: "lose" | "maintain" | "gain";
    dailyCaloriesIntake?: number;
    dailyCaloriesBurned?: number;
    createdAt: string;
}

export interface ProfileFormData {
    age: number;
    weight: number;
    height: number;
    goal: string;
    dailyCaloriesIntake: number;
    dailyCaloriesBurned: number;
}

export interface FoodEntry {
    id?: number | string;
    name: string;
    calories: number;
    mealType: string;
    date?: string;
    createdAt?: string;
    created_at?: string;
    documentId?: string;
}

export interface ActivityEntry {
    id?: number | string;
    name: string;
    duration: number;
    calories: number;
    date?: string;
    documentId?: string;
    createdAt?: string;
    created_at?: string;
}

export type AppContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    login: (credentials: Credentials) => Promise<void>;
    signup: (credentials: Credentials) => Promise<void>;
    fetchUser: (token: string) => Promise<void>;
    isUserFetched: boolean;
    logout: () => void;
    onboardingCompleted: boolean;
    setOnboardingCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    allFoodLogs: FoodEntry[];
    setAllFoodLogs: React.Dispatch<React.SetStateAction<FoodEntry[]>>;
    allActivityLogs: ActivityEntry[];
    setAllActivityLogs: React.Dispatch<React.SetStateAction<ActivityEntry[]>>;
};

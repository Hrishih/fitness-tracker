export const quickActivities = [
  { name: 'Running', emoji: '🏃', rate: 300 },
  { name: 'Cycling', emoji: '🚴', rate: 250 },
  { name: 'Swimming', emoji: '🏊', rate: 280 },
  { name: 'Walking', emoji: '🚶', rate: 120 },
  { name: 'Gym', emoji: '🏋️', rate: 200 },
];

export const quickActivitiesFoodLog = [
  { name: 'Breakfast', emoji: '🍳' },
  { name: 'Lunch', emoji: '🥗' },
  { name: 'Dinner', emoji: '🍝' },
  { name: 'Snack', emoji: '🍎' },
];

export const mealTypeOptions = [
  { label: 'Breakfast', value: 'Breakfast' },
  { label: 'Lunch', value: 'Lunch' },
  { label: 'Dinner', value: 'Dinner' },
  { label: 'Snack', value: 'Snack' },
];

export const goalOptions = [
  { label: 'Lose Weight', value: 'lose' },
  { label: 'Maintain Weight', value: 'maintain' },
  { label: 'Gain Muscle', value: 'gain' },
];

export const goalLabels = {
  lose: 'Lose Weight',
  maintain: 'Maintain Weight',
  gain: 'Gain Muscle',
};

export const getMotivationalMessage = (calories: number, activeMinutes: number, limit: number) => {
  if (activeMinutes > 60) return { text: "You're a beast today!", emoji: "🔥" };
  if (calories > limit) return { text: "Watch your intake, but keep moving!", emoji: "⚠️" };
  if (calories < limit && activeMinutes > 30) return { text: "Perfect balance today!", emoji: "✨" };
  return { text: "Keep pushing towards your goals!", emoji: "💪" };
};

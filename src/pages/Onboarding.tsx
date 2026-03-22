import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import API from "../config/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import { goalOptions } from "../assets/assets";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    id: "age",
    label: "How old are you?",
    description: "This helps us calculate your calorie needs.",
    type: "number",
    placeholder: "e.g. 25",
  },
  {
    id: "weight",
    label: "What is your current weight?",
    description: "Enter your weight in kilograms.",
    type: "number",
    placeholder: "e.g. 70",
  },
  {
    id: "height",
    label: "What is your height?",
    description: "Enter your height in centimeters.",
    type: "number",
    placeholder: "e.g. 175",
  },
  {
    id: "goal",
    label: "What is your fitness goal?",
    description: "Choose the goal that best describes your objective.",
    type: "select",
    options: goalOptions,
  },
];

export default function Onboarding() {
  const { user, fetchUser } = useAppContext();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "maintain",
  });
  const [loading, setLoading] = useState(false);

  const currentStep = steps[currentStepIndex];

  const handleNext = async () => {
    const value = formData[currentStep.id as keyof typeof formData];
    if (!value) {
      toast.error("Please provide a value");
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Final step, submit to API
      if (!user) return;
      setLoading(true);
      try {
        await API.put(`/api/users/${user.id}`, {
          age: Number(formData.age),
          weight: Number(formData.weight),
          height: Number(formData.height),
          goal: formData.goal,
        });
        await fetchUser(user.token);
        toast.success("Onboarding complete!");
      } catch (error) {
        toast.error("Failed to save profile");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${
                  index <= currentStepIndex ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-2xl font-bold mb-2">{currentStep.label}</h1>
            <p className="text-slate-500 mb-6">{currentStep.description}</p>

            <div className="mb-8">
              {currentStep.type === "number" ? (
                <Input
                  type="number"
                  placeholder={currentStep.placeholder}
                  value={formData[currentStep.id as keyof typeof formData]}
                  onChangeValue={(val) => setFormData({ ...formData, [currentStep.id]: val.toString() })}
                  autoFocus
                />
              ) : (
                <Select
                  options={currentStep.options || []}
                  value={formData.goal}
                  onChangeValue={(val) => setFormData({ ...formData, goal: val.toString() })}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4">
          {currentStepIndex > 0 && (
            <Button variant="secondary" className="flex-1" onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          <Button className="flex-1" onClick={handleNext} loading={loading}>
            {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

"use client"

import { Apple, Droplets, Flame, Wheat, Beef, Leaf, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserDetails } from "@/components/details-form"

interface DietTabProps {
  details: UserDetails
  heartRisk: number | null
  diabetesRisk: number | null
}

function calcBMR(age: number, gender: string, weight: number, height: number) {
  if (gender === "Male") {
    return 10 * weight + 6.25 * height - 5 * age + 5
  }
  return 10 * weight + 6.25 * height - 5 * age - 161
}

function calcTDEE(bmr: number, activityLevel: number) {
  return bmr * activityLevel
}

interface MealPlan {
  time: string
  name: string
  items: string[]
  calories: number
  icon: React.ReactNode
}

function generateMealPlan(
  details: UserDetails,
  heartRisk: number | null,
  diabetesRisk: number | null
): { meals: MealPlan[]; dailyCalories: number; macros: { protein: number; carbs: number; fat: number }; notes: string[] } {
  const bmi = details.weight / (details.height / 100) ** 2
  const bmr = calcBMR(details.age, details.gender, details.weight, details.height)
  const tdee = calcTDEE(bmr, 1.55) // moderate activity
  
  let targetCalories = Math.round(tdee)
  const notes: string[] = []

  // Adjust calories based on BMI
  if (bmi >= 30) {
    targetCalories = Math.round(tdee * 0.75)
    notes.push("Caloric deficit recommended for weight management (25% reduction)")
  } else if (bmi >= 25) {
    targetCalories = Math.round(tdee * 0.85)
    notes.push("Mild caloric deficit recommended for gradual weight loss (15% reduction)")
  } else if (bmi < 18.5) {
    targetCalories = Math.round(tdee * 1.15)
    notes.push("Caloric surplus recommended for healthy weight gain (15% increase)")
  }

  // Macros based on conditions
  let proteinRatio = 0.30
  let carbRatio = 0.45
  let fatRatio = 0.25

  if (diabetesRisk !== null && diabetesRisk > 0.4) {
    carbRatio = 0.35
    proteinRatio = 0.35
    fatRatio = 0.30
    notes.push("Lower carb ratio recommended due to elevated diabetes risk")
  }

  if (heartRisk !== null && heartRisk > 0.4) {
    fatRatio = 0.20
    carbRatio = 0.45
    proteinRatio = 0.35
    notes.push("Lower fat intake recommended due to elevated heart disease risk")
  }

  const protein = Math.round((targetCalories * proteinRatio) / 4) // 4 cal/g
  const carbs = Math.round((targetCalories * carbRatio) / 4)
  const fat = Math.round((targetCalories * fatRatio) / 9) // 9 cal/g

  const isHighHeartRisk = heartRisk !== null && heartRisk > 0.4
  const isHighDiabetesRisk = diabetesRisk !== null && diabetesRisk > 0.4
  const isObese = bmi >= 30

  // Generate meal plan based on conditions
  const meals: MealPlan[] = [
    {
      time: "7:00 AM",
      name: "Breakfast",
      icon: <Clock className="h-4 w-4" />,
      calories: Math.round(targetCalories * 0.25),
      items: isHighDiabetesRisk
        ? ["Steel-cut oats with cinnamon (no sugar)", "2 boiled eggs", "Handful of almonds", "Green tea (unsweetened)"]
        : isHighHeartRisk
          ? ["Overnight oats with flaxseed", "Fresh berries", "Low-fat Greek yogurt", "Green tea"]
          : isObese
            ? ["Egg white omelet with spinach", "1 slice whole grain toast", "Black coffee or green tea"]
            : ["Whole grain toast with avocado", "2 scrambled eggs", "Fresh fruit bowl", "Coffee or tea"],
    },
    {
      time: "10:00 AM",
      name: "Mid-Morning Snack",
      icon: <Apple className="h-4 w-4" />,
      calories: Math.round(targetCalories * 0.10),
      items: isHighDiabetesRisk
        ? ["Small apple with peanut butter", "Herbal tea"]
        : isHighHeartRisk
          ? ["Handful of walnuts", "1 small banana"]
          : ["Mixed nuts (30g)", "Fresh fruit"],
    },
    {
      time: "1:00 PM",
      name: "Lunch",
      icon: <Beef className="h-4 w-4" />,
      calories: Math.round(targetCalories * 0.30),
      items: isHighDiabetesRisk
        ? ["Grilled chicken breast (150g)", "Quinoa (1/2 cup)", "Large mixed salad with olive oil", "Steamed broccoli"]
        : isHighHeartRisk
          ? ["Grilled salmon fillet (150g)", "Brown rice (1/2 cup)", "Steamed vegetables", "Olive oil dressing salad"]
          : isObese
            ? ["Lean turkey wrap with lettuce", "Mixed vegetable soup", "Side salad with lemon dressing"]
            : ["Grilled chicken with brown rice", "Mixed vegetables stir-fry", "Side salad", "Water with lemon"],
    },
    {
      time: "4:00 PM",
      name: "Afternoon Snack",
      icon: <Leaf className="h-4 w-4" />,
      calories: Math.round(targetCalories * 0.10),
      items: isHighDiabetesRisk
        ? ["Celery sticks with hummus", "Small handful of pumpkin seeds"]
        : isHighHeartRisk
          ? ["Carrot sticks with hummus", "Green tea"]
          : ["Greek yogurt with berries", "A handful of trail mix"],
    },
    {
      time: "7:00 PM",
      name: "Dinner",
      icon: <Flame className="h-4 w-4" />,
      calories: Math.round(targetCalories * 0.25),
      items: isHighDiabetesRisk
        ? ["Baked fish (150g) with herbs", "Roasted sweet potato (small)", "Sauteed spinach and garlic", "Cucumber & tomato salad"]
        : isHighHeartRisk
          ? ["Baked cod with lemon (150g)", "Steamed asparagus", "Small portion of whole wheat pasta", "Mixed green salad"]
          : isObese
            ? ["Grilled tofu or lean fish (150g)", "Large portion of roasted vegetables", "Small sweet potato", "Light vinaigrette salad"]
            : ["Lean protein (chicken/fish 150g)", "Roasted vegetables", "Whole grain side", "Fresh green salad"],
    },
  ]

  return { meals, dailyCalories: targetCalories, macros: { protein, carbs, fat }, notes }
}

export function DietTab({ details, heartRisk, diabetesRisk }: DietTabProps) {
  const bmi = details.weight / (details.height / 100) ** 2
  const plan = generateMealPlan(details, heartRisk, diabetesRisk)

  return (
    <div className="flex flex-col gap-6">
      {/* Calorie & Macro Overview */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MacroCard
          label="Daily Target"
          value={`${plan.dailyCalories}`}
          unit="kcal"
          icon={<Flame className="h-4 w-4" />}
          color="primary"
        />
        <MacroCard
          label="Protein"
          value={`${plan.macros.protein}`}
          unit="g/day"
          icon={<Beef className="h-4 w-4" />}
          color="success"
        />
        <MacroCard
          label="Carbs"
          value={`${plan.macros.carbs}`}
          unit="g/day"
          icon={<Wheat className="h-4 w-4" />}
          color="warning"
        />
        <MacroCard
          label="Fat"
          value={`${plan.macros.fat}`}
          unit="g/day"
          icon={<Droplets className="h-4 w-4" />}
          color="danger"
        />
      </div>

      {/* Macro Ratio Bar */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Macro Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-6 w-full overflow-hidden rounded-full">
            <div
              className="flex items-center justify-center bg-success text-[10px] font-semibold text-background"
              style={{ width: `${(plan.macros.protein * 4 / plan.dailyCalories) * 100}%` }}
            >
              Protein
            </div>
            <div
              className="flex items-center justify-center bg-warning text-[10px] font-semibold text-background"
              style={{ width: `${(plan.macros.carbs * 4 / plan.dailyCalories) * 100}%` }}
            >
              Carbs
            </div>
            <div
              className="flex items-center justify-center bg-danger text-[10px] font-semibold text-background"
              style={{ width: `${(plan.macros.fat * 9 / plan.dailyCalories) * 100}%` }}
            >
              Fat
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conditions Notice */}
      {plan.notes.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="flex flex-col gap-2 p-4">
            {plan.notes.map((note, i) => (
              <div key={i} className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
                <p className="text-sm text-foreground">{note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Meal Plan Timeline */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            Daily Meal Plan
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              - Personalized for BMI {bmi.toFixed(1)}
              {heartRisk !== null && `, Heart Risk ${(heartRisk * 100).toFixed(0)}%`}
              {diabetesRisk !== null && `, Diabetes Risk ${(diabetesRisk * 100).toFixed(0)}%`}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-0">
          {plan.meals.map((meal, index) => (
            <div key={meal.name} className="relative flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  {meal.icon}
                </div>
                {index < plan.meals.length - 1 && (
                  <div className="w-px flex-1 bg-border" />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{meal.name}</p>
                    <p className="text-xs text-muted-foreground">{meal.time}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-mono font-semibold text-primary">
                    {meal.calories} kcal
                  </span>
                </div>
                <ul className="mt-2 flex flex-col gap-1">
                  {meal.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-primary/50 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hydration & General Tips */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Dietary Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TipCard icon={<Droplets className="h-4 w-4 text-primary" />} text="Drink 8-10 glasses of water daily. Stay hydrated throughout the day." />
            <TipCard icon={<Leaf className="h-4 w-4 text-primary" />} text="Include 5 servings of fruits and vegetables daily for essential vitamins." />
            <TipCard icon={<Flame className="h-4 w-4 text-primary" />} text="Avoid processed foods, sugary drinks, and excessive sodium intake." />
            <TipCard icon={<Clock className="h-4 w-4 text-primary" />} text="Eat at consistent times and avoid heavy meals within 3 hours of bedtime." />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MacroCard({ label, value, unit, icon, color }: { label: string; value: string; unit: string; icon: React.ReactNode; color: string }) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  }
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col items-center gap-2 p-4">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono text-foreground">{value}</span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function TipCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  )
}

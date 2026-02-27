"use client"

import { Dumbbell, Clock, Flame, Heart, Activity, Zap, Timer, ChevronRight, Droplets } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserDetails } from "@/components/details-form"

interface ExerciseTabProps {
  details: UserDetails
  heartRisk: number | null
  diabetesRisk: number | null
}

interface Exercise {
  name: string
  duration: string
  intensity: "Low" | "Moderate" | "High"
  calories: number
  notes: string
  icon: React.ReactNode
}

interface DayPlan {
  day: string
  focus: string
  exercises: Exercise[]
  totalCalories: number
  restDay: boolean
}

function generateExercisePlan(
  details: UserDetails,
  heartRisk: number | null,
  diabetesRisk: number | null
): DayPlan[] {
  const bmi = details.weight / (details.height / 100) ** 2
  const isHighHeartRisk = heartRisk !== null && heartRisk > 0.6
  const isModerateHeartRisk = heartRisk !== null && heartRisk > 0.4
  const isHighDiabetesRisk = diabetesRisk !== null && diabetesRisk > 0.5
  const isObese = bmi >= 30
  const isOverweight = bmi >= 25
  const isElderly = details.age > 60
  const isSenior = details.age > 50

  // Determine exercise intensity level
  let maxIntensity: "Low" | "Moderate" | "High" = "High"
  if (isHighHeartRisk || isElderly) maxIntensity = "Low"
  else if (isModerateHeartRisk || isSenior || isObese) maxIntensity = "Moderate"

  const weekPlan: DayPlan[] = []

  if (isHighHeartRisk) {
    // Very gentle plan
    weekPlan.push(
      {
        day: "Monday", focus: "Light Cardio", restDay: false, totalCalories: 150,
        exercises: [
          { name: "Gentle Walking", duration: "20 min", intensity: "Low", calories: 80, notes: "Flat terrain, comfortable pace", icon: <Activity className="h-4 w-4" /> },
          { name: "Deep Breathing", duration: "10 min", intensity: "Low", calories: 20, notes: "Diaphragmatic breathing exercises", icon: <Heart className="h-4 w-4" /> },
          { name: "Seated Stretching", duration: "15 min", intensity: "Low", calories: 50, notes: "Gentle full body stretches", icon: <Zap className="h-4 w-4" /> },
        ],
      },
      { day: "Tuesday", focus: "Rest & Recovery", restDay: true, totalCalories: 0, exercises: [] },
      {
        day: "Wednesday", focus: "Light Activity", restDay: false, totalCalories: 120,
        exercises: [
          { name: "Chair Yoga", duration: "20 min", intensity: "Low", calories: 60, notes: "Gentle poses with chair support", icon: <Zap className="h-4 w-4" /> },
          { name: "Light Walking", duration: "15 min", intensity: "Low", calories: 60, notes: "Indoor or outdoor, slow pace", icon: <Activity className="h-4 w-4" /> },
        ],
      },
      { day: "Thursday", focus: "Rest & Recovery", restDay: true, totalCalories: 0, exercises: [] },
      {
        day: "Friday", focus: "Gentle Movement", restDay: false, totalCalories: 140,
        exercises: [
          { name: "Walking", duration: "20 min", intensity: "Low", calories: 80, notes: "Comfortable pace with breaks", icon: <Activity className="h-4 w-4" /> },
          { name: "Gentle Stretching", duration: "15 min", intensity: "Low", calories: 40, notes: "Focus on flexibility", icon: <Zap className="h-4 w-4" /> },
          { name: "Breathing Exercises", duration: "5 min", intensity: "Low", calories: 20, notes: "Relaxation and recovery", icon: <Heart className="h-4 w-4" /> },
        ],
      },
      { day: "Saturday", focus: "Rest & Recovery", restDay: true, totalCalories: 0, exercises: [] },
      { day: "Sunday", focus: "Rest & Recovery", restDay: true, totalCalories: 0, exercises: [] },
    )
  } else if (maxIntensity === "Moderate") {
    weekPlan.push(
      {
        day: "Monday", focus: "Cardio & Core", restDay: false, totalCalories: 300,
        exercises: [
          { name: "Brisk Walking", duration: "30 min", intensity: "Moderate", calories: 150, notes: "Maintain steady pace", icon: <Activity className="h-4 w-4" /> },
          { name: "Bodyweight Core", duration: "15 min", intensity: "Moderate", calories: 80, notes: "Planks, crunches, leg raises", icon: <Dumbbell className="h-4 w-4" /> },
          { name: "Stretching", duration: "10 min", intensity: "Low", calories: 30, notes: "Cool down stretches", icon: <Zap className="h-4 w-4" /> },
        ],
      },
      {
        day: "Tuesday", focus: "Light Strength", restDay: false, totalCalories: 250,
        exercises: [
          { name: "Resistance Bands", duration: "20 min", intensity: "Moderate", calories: 100, notes: "Upper body focus", icon: <Dumbbell className="h-4 w-4" /> },
          { name: "Bodyweight Squats", duration: "15 min", intensity: "Moderate", calories: 100, notes: "3 sets of 12 reps", icon: <Zap className="h-4 w-4" /> },
          { name: "Walking", duration: "15 min", intensity: "Low", calories: 50, notes: "Cool down walk", icon: <Activity className="h-4 w-4" /> },
        ],
      },
      { day: "Wednesday", focus: "Active Recovery", restDay: true, totalCalories: 0, exercises: [] },
      {
        day: "Thursday", focus: "Cardio", restDay: false, totalCalories: 320,
        exercises: [
          { name: "Cycling/Stationary Bike", duration: "30 min", intensity: "Moderate", calories: 200, notes: "Moderate resistance", icon: <Activity className="h-4 w-4" /> },
          { name: "Yoga Flow", duration: "20 min", intensity: "Low", calories: 70, notes: "Sun salutations sequence", icon: <Zap className="h-4 w-4" /> },
          { name: "Cool Down", duration: "10 min", intensity: "Low", calories: 30, notes: "Stretching and breathing", icon: <Heart className="h-4 w-4" /> },
        ],
      },
      {
        day: "Friday", focus: "Full Body Strength", restDay: false, totalCalories: 280,
        exercises: [
          { name: "Dumbbell Exercises", duration: "25 min", intensity: "Moderate", calories: 150, notes: "Light weights, higher reps", icon: <Dumbbell className="h-4 w-4" /> },
          { name: "Walking Lunges", duration: "10 min", intensity: "Moderate", calories: 80, notes: "3 sets of 10 each leg", icon: <Zap className="h-4 w-4" /> },
          { name: "Stretching", duration: "10 min", intensity: "Low", calories: 30, notes: "Full body cool down", icon: <Activity className="h-4 w-4" /> },
        ],
      },
      { day: "Saturday", focus: "Light Activity", restDay: false, totalCalories: 180, exercises: [
        { name: "Swimming or Walking", duration: "30 min", intensity: "Low", calories: 150, notes: "Enjoy a leisure activity", icon: <Activity className="h-4 w-4" /> },
        { name: "Stretching", duration: "10 min", intensity: "Low", calories: 30, notes: "Gentle flexibility work", icon: <Zap className="h-4 w-4" /> },
      ] },
      { day: "Sunday", focus: "Rest & Recovery", restDay: true, totalCalories: 0, exercises: [] },
    )
  } else {
    // High intensity plan
    weekPlan.push(
      {
        day: "Monday", focus: "Upper Body Strength", restDay: false, totalCalories: 450,
        exercises: [
          { name: "Push-ups (varied)", duration: "15 min", intensity: "High", calories: 120, notes: "Standard, wide, diamond - 3x12 each", icon: <Dumbbell className="h-4 w-4" /> },
          { name: "Dumbbell Press & Rows", duration: "20 min", intensity: "High", calories: 150, notes: "4 sets of 10 reps each", icon: <Dumbbell className="h-4 w-4" /> },
          { name: "HIIT Cardio", duration: "15 min", intensity: "High", calories: 180, notes: "30s on / 15s off intervals", icon: <Flame className="h-4 w-4" /> },
        ],
      },
      {
        day: "Tuesday", focus: "Lower Body & Core", restDay: false, totalCalories: 480,
        exercises: [
          { name: "Squats & Lunges", duration: "20 min", intensity: "High", calories: 180, notes: "4 sets of 12 each", icon: <Zap className="h-4 w-4" /> },
          { name: "Deadlifts", duration: "15 min", intensity: "High", calories: 150, notes: "4 sets of 8-10 reps", icon: <Dumbbell className="h-4 w-4" /> },
          { name: "Core Circuit", duration: "15 min", intensity: "High", calories: 120, notes: "Planks, Russian twists, leg raises", icon: <Flame className="h-4 w-4" /> },
        ],
      },
      {
        day: "Wednesday", focus: "Cardio & Flexibility", restDay: false, totalCalories: 400,
        exercises: [
          { name: "Running/Jogging", duration: "30 min", intensity: "High", calories: 300, notes: "Maintain 70-80% max heart rate", icon: <Activity className="h-4 w-4" /> },
          { name: "Yoga", duration: "20 min", intensity: "Low", calories: 70, notes: "Focus on recovery and flexibility", icon: <Zap className="h-4 w-4" /> },
        ],
      },
      { day: "Thursday", focus: "Active Recovery", restDay: true, totalCalories: 0, exercises: [] },
      {
        day: "Friday", focus: "Full Body HIIT", restDay: false, totalCalories: 500,
        exercises: [
          { name: "Burpees", duration: "10 min", intensity: "High", calories: 150, notes: "4 rounds of 15 reps", icon: <Flame className="h-4 w-4" /> },
          { name: "Kettlebell Swings", duration: "15 min", intensity: "High", calories: 180, notes: "4 sets of 15 reps", icon: <Dumbbell className="h-4 w-4" /> },
          { name: "Mountain Climbers + Jumping Jacks", duration: "15 min", intensity: "High", calories: 170, notes: "Superset, 30s each, 4 rounds", icon: <Zap className="h-4 w-4" /> },
        ],
      },
      {
        day: "Saturday", focus: "Sports/Recreation", restDay: false, totalCalories: 350,
        exercises: [
          { name: "Sport Activity", duration: "45 min", intensity: "Moderate", calories: 300, notes: "Basketball, swimming, cycling, or hiking", icon: <Activity className="h-4 w-4" /> },
          { name: "Stretching", duration: "10 min", intensity: "Low", calories: 30, notes: "Full body cool down", icon: <Zap className="h-4 w-4" /> },
        ],
      },
      { day: "Sunday", focus: "Rest & Recovery", restDay: true, totalCalories: 0, exercises: [] },
    )
  }

  return weekPlan
}

export function ExerciseTab({ details, heartRisk, diabetesRisk }: ExerciseTabProps) {
  const bmi = details.weight / (details.height / 100) ** 2
  const plan = generateExercisePlan(details, heartRisk, diabetesRisk)
  const weeklyCalories = plan.reduce((sum, day) => sum + day.totalCalories, 0)
  const activeDays = plan.filter((d) => !d.restDay).length

  // Determine overall intensity label
  const isHighHeartRisk = heartRisk !== null && heartRisk > 0.6
  const isModerate = (heartRisk !== null && heartRisk > 0.4) || bmi >= 30 || details.age > 50
  const intensityLabel = isHighHeartRisk ? "Light (Heart-Safe)" : isModerate ? "Moderate" : "High Intensity"
  const intensityColor = isHighHeartRisk ? "text-success" : isModerate ? "text-warning" : "text-primary"

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <OverviewCard
          label="Weekly Burn"
          value={`${weeklyCalories}`}
          unit="kcal"
          icon={<Flame className="h-4 w-4 text-danger" />}
        />
        <OverviewCard
          label="Active Days"
          value={`${activeDays}`}
          unit="/ week"
          icon={<Dumbbell className="h-4 w-4 text-primary" />}
        />
        <OverviewCard
          label="Intensity"
          value={intensityLabel}
          unit=""
          icon={<Zap className="h-4 w-4 text-warning" />}
          valueClass={intensityColor}
        />
        <OverviewCard
          label="Rest Days"
          value={`${7 - activeDays}`}
          unit="/ week"
          icon={<Heart className="h-4 w-4 text-success" />}
        />
      </div>

      {/* Intensity Explanation */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {"This exercise plan is tailored based on your profile: "}
            <span className="text-foreground font-medium">Age {details.age}</span>
            {", BMI "}
            <span className="text-foreground font-medium">{bmi.toFixed(1)}</span>
            {heartRisk !== null && (
              <>, Heart Risk <span className="text-foreground font-medium">{(heartRisk * 100).toFixed(0)}%</span></>
            )}
            {diabetesRisk !== null && (
              <>, Diabetes Risk <span className="text-foreground font-medium">{(diabetesRisk * 100).toFixed(0)}%</span></>
            )}
            . Intensity and volume have been adjusted accordingly for safety and effectiveness.
          </p>
        </CardContent>
      </Card>

      {/* Weekly Plan */}
      <div className="flex flex-col gap-4">
        {plan.map((day) => (
          <Card key={day.day} className={`border-border ${day.restDay ? "bg-card/50" : "bg-card"}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${day.restDay ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                    {day.restDay ? <Timer className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" />}
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">{day.day}</CardTitle>
                    <p className="text-xs text-muted-foreground">{day.focus}</p>
                  </div>
                </div>
                {!day.restDay && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-mono font-semibold text-primary">
                    {day.totalCalories} kcal
                  </span>
                )}
              </div>
            </CardHeader>
            {!day.restDay && (
              <CardContent className="flex flex-col gap-3 pt-2">
                {day.exercises.map((exercise, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                      {exercise.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">{exercise.name}</p>
                        <IntensityBadge intensity={exercise.intensity} />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {exercise.duration}</span>
                        <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {exercise.calories} kcal</span>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <ChevronRight className="h-3 w-3 shrink-0" />
                        {exercise.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
            {day.restDay && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  Take this day to rest, hydrate, and allow your body to recover. Light stretching or a short walk is fine.
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* General Exercise Tips */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Exercise Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TipItem icon={<Heart className="h-4 w-4 text-primary" />} text="Always warm up for 5-10 minutes before exercise and cool down after." />
            <TipItem icon={<Droplets className="h-4 w-4 text-primary" />} text="Drink water before, during, and after your workout. Stay hydrated." />
            <TipItem icon={<Activity className="h-4 w-4 text-primary" />} text="Listen to your body. Stop if you feel chest pain, dizziness, or unusual fatigue." />
            <TipItem icon={<Clock className="h-4 w-4 text-primary" />} text="Consistency matters more than intensity. Stick to your routine." />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OverviewCard({
  label, value, unit, icon, valueClass = "text-foreground"
}: {
  label: string; value: string; unit: string; icon: React.ReactNode; valueClass?: string
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col items-center gap-2 p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
          {icon}
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-lg font-bold font-mono ${valueClass}`}>{value}</span>
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

function IntensityBadge({ intensity }: { intensity: "Low" | "Moderate" | "High" }) {
  const colorMap = {
    Low: "bg-success/10 text-success border-success/20",
    Moderate: "bg-warning/10 text-warning border-warning/20",
    High: "bg-danger/10 text-danger border-danger/20",
  }
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${colorMap[intensity]}`}>
      {intensity}
    </span>
  )
}

function TipItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  )
}

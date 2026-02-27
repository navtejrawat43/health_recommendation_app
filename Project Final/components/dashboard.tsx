"use client"

import { useState } from "react"
import {
  Heart,
  Activity,
  ArrowLeft,
  Zap,
  Shield,
  Droplets,
  Apple,
  Dumbbell,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { RadialProgress } from "@/components/radial-progress"
import { HeartTab } from "@/components/heart-tab"
import { DiabetesTab } from "@/components/diabetes-tab"
import { DietTab } from "@/components/diet-tab"
import { ExerciseTab } from "@/components/exercise-tab"
import type { UserDetails } from "@/components/details-form"

interface DashboardProps {
  details: UserDetails
  onBack: () => void
}

function bmiCalc(weight: number, height: number) {
  return weight / (height / 100) ** 2
}

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-warning" }
  if (bmi < 25) return { label: "Normal", color: "text-success" }
  if (bmi < 30) return { label: "Overweight", color: "text-warning" }
  return { label: "Obese", color: "text-danger" }
}

type TabKey = "overview" | "heart" | "diabetes" | "diet" | "exercise"

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Overview", icon: <Activity className="h-4 w-4" /> },
  { key: "heart", label: "Heart", icon: <Heart className="h-4 w-4" /> },
  { key: "diabetes", label: "Diabetes", icon: <Droplets className="h-4 w-4" /> },
  { key: "diet", label: "Diet Plan", icon: <Apple className="h-4 w-4" /> },
  { key: "exercise", label: "Exercise", icon: <Dumbbell className="h-4 w-4" /> },
]

export function Dashboard({ details, onBack }: DashboardProps) {
  const bmi = bmiCalc(details.weight, details.height)
  const bmiCat = bmiCategory(bmi)
  const [activeTab, setActiveTab] = useState<TabKey>("overview")
  const [heartRisk, setHeartRisk] = useState<number | null>(null)
  const [diabetesRisk, setDiabetesRisk] = useState<number | null>(null)

  return (
    <TooltipProvider>
      <div className="min-h-screen px-4 pb-20">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/3 to-transparent pointer-events-none" />

        {/* Header */}
        <header className="relative mx-auto flex max-w-6xl items-center justify-between py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Health Dashboard</span>
          </div>
        </header>

        <div className="relative mx-auto max-w-6xl flex flex-col gap-6">
          {/* Tab Navigation */}
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === "overview" && (
              <OverviewTab details={details} bmi={bmi} bmiCat={bmiCat} heartRisk={heartRisk} diabetesRisk={diabetesRisk} />
            )}
            {activeTab === "heart" && (
              <HeartTab details={details} onRiskChange={setHeartRisk} heartRisk={heartRisk} />
            )}
            {activeTab === "diabetes" && (
              <DiabetesTab details={details} onRiskChange={setDiabetesRisk} diabetesRisk={diabetesRisk} />
            )}
            {activeTab === "diet" && (
              <DietTab details={details} heartRisk={heartRisk} diabetesRisk={diabetesRisk} />
            )}
            {activeTab === "exercise" && (
              <ExerciseTab details={details} heartRisk={heartRisk} diabetesRisk={diabetesRisk} />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

/* ==================== OVERVIEW TAB ==================== */

function OverviewTab({
  details,
  bmi,
  bmiCat,
  heartRisk,
  diabetesRisk,
}: {
  details: UserDetails
  bmi: number
  bmiCat: { label: string; color: string }
  heartRisk: number | null
  diabetesRisk: number | null
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Top stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        <StatCard label="Age" value={`${details.age}`} sublabel="years" icon={<Heart className="h-4 w-4" />} />
        <StatCard label="Gender" value={details.gender} sublabel={details.gender === "Male" ? "M" : "F"} icon={<Activity className="h-4 w-4" />} />
        <StatCard label="Height" value={`${details.height}`} sublabel="cm" icon={<Zap className="h-4 w-4" />} />
        <StatCard label="Weight" value={`${details.weight}`} sublabel="kg" icon={<Shield className="h-4 w-4" />} />
      </div>

      {/* BMI Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 animate-fade-in-delay-1">
        <Card className="border-border bg-card col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Body Mass Index</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-2">
            <RadialProgress
              value={bmi}
              max={40}
              color={bmi < 18.5 ? "var(--warning)" : bmi < 25 ? "var(--success)" : bmi < 30 ? "var(--warning)" : "var(--danger)"}
              sublabel="BMI"
            />
            <div className={`rounded-full px-4 py-1 text-sm font-semibold ${bmiCat.color} bg-secondary`}>
              {bmiCat.label}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">BMI Categories</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-2">
            <BmiBar bmi={bmi} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <BmiCategoryCard label="Underweight" range="< 18.5" active={bmi < 18.5} color="warning" />
              <BmiCategoryCard label="Normal" range="18.5 - 24.9" active={bmi >= 18.5 && bmi < 25} color="success" />
              <BmiCategoryCard label="Overweight" range="25 - 29.9" active={bmi >= 25 && bmi < 30} color="warning" />
              <BmiCategoryCard label="Obese" range="> 30" active={bmi >= 30} color="danger" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in-delay-2">
        <RiskSummaryCard
          title="Heart Disease Risk"
          risk={heartRisk}
          icon={<Heart className="h-5 w-5" />}
          emptyText="Run heart prediction in the Heart tab to see results here."
          accentColor="primary"
        />
        <RiskSummaryCard
          title="Diabetes Risk"
          risk={diabetesRisk}
          icon={<Droplets className="h-5 w-5" />}
          emptyText="Run diabetes prediction in the Diabetes tab to see results here."
          accentColor="warning"
        />
      </div>

      {/* Quick Actions */}
      <Card className="border-border bg-card animate-fade-in-delay-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickAction icon={<Heart className="h-5 w-5 text-primary" />} label="Heart Assessment" description="Predict cardiac risk" />
            <QuickAction icon={<Droplets className="h-5 w-5 text-warning" />} label="Diabetes Check" description="Blood sugar screening" />
            <QuickAction icon={<Apple className="h-5 w-5 text-success" />} label="Diet Plan" description="Personalized nutrition" />
            <QuickAction icon={<Dumbbell className="h-5 w-5 text-danger" />} label="Exercise Plan" description="Custom workout routine" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ==================== SHARED COMPONENTS ==================== */

function StatCard({ label, value, sublabel, icon }: { label: string; value: string; sublabel: string; icon: React.ReactNode }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-foreground">{value}</span>
            <span className="text-xs text-muted-foreground">{sublabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BmiBar({ bmi }: { bmi: number }) {
  const percentage = Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100)
  return (
    <div className="relative">
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        <div className="flex-1 bg-warning/30" />
        <div className="flex-[1.5] bg-success/30" />
        <div className="flex-1 bg-warning/30" />
        <div className="flex-1 bg-danger/30" />
      </div>
      <div
        className="absolute top-[-4px] h-6 w-1 rounded-full bg-foreground shadow-lg transition-all duration-700"
        style={{ left: `${percentage}%` }}
      />
    </div>
  )
}

function BmiCategoryCard({ label, range, active, color }: { label: string; range: string; active: boolean; color: string }) {
  const colorClasses = {
    success: active ? "border-success/40 bg-success/10 text-success" : "border-border bg-card text-muted-foreground",
    warning: active ? "border-warning/40 bg-warning/10 text-warning" : "border-border bg-card text-muted-foreground",
    danger: active ? "border-danger/40 bg-danger/10 text-danger" : "border-border bg-card text-muted-foreground",
  }
  return (
    <div className={`rounded-lg border p-3 text-center transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="mt-0.5 text-xs opacity-70">{range}</p>
    </div>
  )
}

function RiskSummaryCard({
  title,
  risk,
  icon,
  emptyText,
  accentColor,
}: {
  title: string
  risk: number | null
  icon: React.ReactNode
  emptyText: string
  accentColor: string
}) {
  if (risk === null) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-${accentColor}/10 text-${accentColor}`}>
            {icon}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{emptyText}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const riskPercent = (risk * 100).toFixed(1)
  const riskColor = risk > 0.7 ? "text-danger" : risk > 0.4 ? "text-warning" : "text-success"
  const riskLabel = risk > 0.7 ? "High Risk" : risk > 0.4 ? "Moderate Risk" : "Low Risk"
  const riskBg = risk > 0.7 ? "bg-danger/10" : risk > 0.4 ? "bg-warning/10" : "bg-success/10"

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-center gap-4 p-6">
        <RadialProgress
          value={risk * 100}
          max={100}
          size={80}
          strokeWidth={6}
          color={risk > 0.7 ? "var(--danger)" : risk > 0.4 ? "var(--warning)" : "var(--success)"}
        />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold font-mono ${riskColor}`}>{riskPercent}%</span>
          </div>
          <span className={`inline-flex w-fit rounded-full px-3 py-0.5 text-xs font-semibold ${riskColor} ${riskBg}`}>
            {riskLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickAction({ icon, label, description }: { icon: React.ReactNode; label: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-secondary/30 p-4 text-center transition-colors hover:bg-secondary/50">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card">
        {icon}
      </div>
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="text-[10px] text-muted-foreground">{description}</p>
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import {
  Droplets,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { RadialProgress } from "@/components/radial-progress"
import type { UserDetails } from "@/components/details-form"

// Simulate diabetes risk based on common factors
function simulateDiabetesRisk(params: {
  age: number
  bmi: number
  glucose: number
  bloodPressure: number
  insulin: number
  skinThickness: number
  dpf: number
  pregnancies: number
  gender: string
}): number {
  const { age, bmi, glucose, bloodPressure, insulin, skinThickness, dpf, pregnancies, gender } = params
  let z = -8.5
  z += 0.035 * age
  z += 0.09 * bmi
  z += 0.035 * glucose
  z += 0.008 * bloodPressure
  z += 0.001 * insulin
  z += 0.01 * skinThickness
  z += 1.2 * dpf
  z += 0.1 * pregnancies
  if (gender === "Female") z += 0.05 * pregnancies
  return 1 / (1 + Math.exp(-z))
}

function riskLevel(risk: number) {
  if (risk > 0.7) return { label: "High", color: "text-danger", bg: "bg-danger/10", border: "border-danger/30" }
  if (risk > 0.4) return { label: "Moderate", color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" }
  return { label: "Low", color: "text-success", bg: "bg-success/10", border: "border-success/30" }
}

const diabetesInputs = [
  { key: "glucose", label: "Glucose Level", min: 0, max: 200, defaultVal: 100, step: 1, tooltip: "Plasma glucose concentration (2h oral glucose tolerance test, mg/dL)" },
  { key: "bloodPressure", label: "Blood Pressure", min: 0, max: 150, defaultVal: 72, step: 1, tooltip: "Diastolic blood pressure (mm Hg)" },
  { key: "skinThickness", label: "Skin Thickness", min: 0, max: 100, defaultVal: 25, step: 1, tooltip: "Triceps skinfold thickness (mm)" },
  { key: "insulin", label: "Insulin Level", min: 0, max: 850, defaultVal: 80, step: 1, tooltip: "2-Hour serum insulin (mu U/ml)" },
  { key: "dpf", label: "Diabetes Pedigree", min: 0, max: 2.5, defaultVal: 0.5, step: 0.01, tooltip: "Diabetes pedigree function - genetic influence score" },
  { key: "pregnancies", label: "Pregnancies", min: 0, max: 15, defaultVal: 0, step: 1, tooltip: "Number of times pregnant" },
]

interface DiabetesTabProps {
  details: UserDetails
  onRiskChange: (risk: number | null) => void
  diabetesRisk: number | null
}

export function DiabetesTab({ details, onRiskChange, diabetesRisk }: DiabetesTabProps) {
  const bmi = details.weight / (details.height / 100) ** 2

  const [values, setValues] = useState<Record<string, number>>(
    () => Object.fromEntries(diabetesInputs.map((inp) => [inp.key, inp.defaultVal]))
  )
  const [showInputs, setShowInputs] = useState(true)

  const handleChange = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handlePredict = () => {
    const result = simulateDiabetesRisk({
      age: details.age,
      bmi,
      glucose: values.glucose,
      bloodPressure: values.bloodPressure,
      insulin: values.insulin,
      skinThickness: values.skinThickness,
      dpf: values.dpf,
      pregnancies: values.pregnancies,
      gender: details.gender,
    })
    onRiskChange(result)
  }

  const riskInfo = diabetesRisk !== null ? riskLevel(diabetesRisk) : null

  const featureImportance = useMemo(() => {
    if (diabetesRisk === null) return []
    const items = [
      { name: "Glucose", val: Math.abs(0.035 * values.glucose) },
      { name: "BMI", val: Math.abs(0.09 * bmi) },
      { name: "Age", val: Math.abs(0.035 * details.age) },
      { name: "Pedigree", val: Math.abs(1.2 * values.dpf) },
      { name: "Insulin", val: Math.abs(0.001 * values.insulin) },
      { name: "Blood Pressure", val: Math.abs(0.008 * values.bloodPressure) },
      { name: "Skin Thickness", val: Math.abs(0.01 * values.skinThickness) },
      { name: "Pregnancies", val: Math.abs(0.1 * values.pregnancies) },
    ]
    items.sort((a, b) => b.val - a.val)
    const maxVal = items[0]?.val || 1
    return items.map((c) => ({ ...c, normalized: c.val / maxVal }))
  }, [diabetesRisk, details, values, bmi])

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <QuickStat label="BMI" value={bmi.toFixed(1)} />
        <QuickStat label="Age" value={`${details.age}`} />
        <QuickStat label="Gender" value={details.gender} />
        <QuickStat label="Weight" value={`${details.weight} kg`} />
      </div>

      {/* Inputs */}
      <Card className="border-border bg-card">
        <CardHeader>
          <button
            onClick={() => setShowInputs(!showInputs)}
            className="flex w-full items-center justify-between cursor-pointer"
          >
            <div>
              <CardTitle className="text-lg font-semibold text-foreground text-left">Diabetes Parameters</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground text-left">Enter clinical data for diabetes risk assessment</p>
            </div>
            {showInputs ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {showInputs && (
          <CardContent className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {diabetesInputs.map((input) => (
                <div key={input.key} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      {input.label}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-xs">{input.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <span className="text-sm font-mono font-semibold text-primary">
                      {input.step < 1 ? values[input.key].toFixed(2) : values[input.key]}
                    </span>
                  </div>
                  <Slider
                    value={[values[input.key]]}
                    onValueChange={(v) => handleChange(input.key, v[0])}
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{input.min}</span>
                    <span>{input.max}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              onClick={handlePredict}
              className="h-12 gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 cursor-pointer"
            >
              <Droplets className="h-4 w-4" />
              Predict Diabetes Risk
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Risk Results */}
      {diabetesRisk !== null && riskInfo && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className={`border ${riskInfo.border} ${riskInfo.bg} col-span-1`}>
              <CardContent className="flex flex-col items-center gap-4 py-8">
                <RadialProgress
                  value={diabetesRisk * 100}
                  max={100}
                  color={diabetesRisk > 0.7 ? "var(--danger)" : diabetesRisk > 0.4 ? "var(--warning)" : "var(--success)"}
                  sublabel="%"
                  label="Diabetes Risk"
                />
                <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${riskInfo.color} bg-card`}>
                  {diabetesRisk > 0.7 ? <XCircle className="h-4 w-4" /> : diabetesRisk > 0.4 ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  {riskInfo.label} Risk
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Feature Contributions to Diabetes Risk</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-2">
                {featureImportance.map((feat) => (
                  <div key={feat.name} className="flex items-center gap-3">
                    <span className="w-28 text-xs text-muted-foreground shrink-0">{feat.name}</span>
                    <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-warning transition-all duration-700"
                        style={{ width: `${feat.normalized * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-mono text-muted-foreground">
                      {(feat.normalized * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Key Warnings */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {values.glucose > 140 && (
                <InsightRow color="danger" text="Your glucose level is elevated. Consider consulting an endocrinologist." />
              )}
              {bmi >= 30 && (
                <InsightRow color="danger" text="Obesity significantly increases diabetes risk. Weight management is critical." />
              )}
              {bmi >= 25 && bmi < 30 && (
                <InsightRow color="warning" text="Being overweight increases diabetes risk. A healthy diet and exercise can help." />
              )}
              {values.dpf > 1.0 && (
                <InsightRow color="warning" text="High diabetes pedigree suggests genetic predisposition. Regular screening advised." />
              )}
              {values.bloodPressure > 90 && (
                <InsightRow color="warning" text="Elevated blood pressure is a co-morbidity factor for diabetes." />
              )}
              {diabetesRisk <= 0.4 && (
                <InsightRow color="success" text="Your diabetes risk is currently low. Maintain healthy habits to keep it that way." />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold font-mono text-foreground">{value}</p>
    </div>
  )
}

function InsightRow({ color, text }: { color: "danger" | "warning" | "success"; text: string }) {
  const colorMap = {
    danger: "text-danger bg-danger/10 border-danger/20",
    warning: "text-warning bg-warning/10 border-warning/20",
    success: "text-success bg-success/10 border-success/20",
  }
  const Icon = color === "danger" ? XCircle : color === "warning" ? AlertTriangle : CheckCircle2
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colorMap[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  )
}

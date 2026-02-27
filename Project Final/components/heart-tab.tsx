"use client"

import { useState, useMemo } from "react"
import {
  Heart,
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

// Simple logistic regression simulation for heart disease risk
function simulateHeartRisk(features: number[]): number {
  const weights = [0.04, 0.15, 0.2, 0.01, 0.005, 0.1, 0.05, -0.03, 0.3, 0.15, 0.1, 0.25, 0.12]
  const bias = -3.5
  let z = bias
  for (let i = 0; i < weights.length; i++) {
    z += weights[i] * features[i]
  }
  return 1 / (1 + Math.exp(-z))
}

function riskLevel(risk: number) {
  if (risk > 0.7) return { label: "High", color: "text-danger", bg: "bg-danger/10", border: "border-danger/30" }
  if (risk > 0.4) return { label: "Moderate", color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" }
  return { label: "Low", color: "text-success", bg: "bg-success/10", border: "border-success/30" }
}

const medicalInputs = [
  { key: "cp", label: "Chest Pain Type", min: 0, max: 3, defaultVal: 1, step: 1, tooltip: "0: Typical Angina, 1: Atypical Angina, 2: Non-anginal, 3: Asymptomatic" },
  { key: "trestbps", label: "Resting Blood Pressure", min: 90, max: 200, defaultVal: 120, step: 1, tooltip: "Resting blood pressure in mm Hg on admission" },
  { key: "chol", label: "Cholesterol", min: 100, max: 400, defaultVal: 200, step: 1, tooltip: "Serum cholesterol in mg/dl" },
  { key: "fbs", label: "Fasting Blood Sugar > 120", min: 0, max: 1, defaultVal: 0, step: 1, tooltip: "0: No, 1: Yes (fasting blood sugar > 120 mg/dl)" },
  { key: "restecg", label: "Resting ECG", min: 0, max: 2, defaultVal: 0, step: 1, tooltip: "0: Normal, 1: ST-T abnormality, 2: LV hypertrophy" },
  { key: "thalach", label: "Max Heart Rate", min: 60, max: 200, defaultVal: 150, step: 1, tooltip: "Maximum heart rate achieved during exercise" },
  { key: "exang", label: "Exercise Induced Angina", min: 0, max: 1, defaultVal: 0, step: 1, tooltip: "0: No, 1: Yes" },
  { key: "oldpeak", label: "ST Depression (Oldpeak)", min: 0, max: 6, defaultVal: 1, step: 0.1, tooltip: "ST depression induced by exercise relative to rest" },
  { key: "slope", label: "Slope of Peak ST", min: 0, max: 2, defaultVal: 1, step: 1, tooltip: "0: Upsloping, 1: Flat, 2: Downsloping" },
  { key: "ca", label: "Major Vessels (CA)", min: 0, max: 4, defaultVal: 0, step: 1, tooltip: "Number of major vessels colored by fluoroscopy (0-4)" },
  { key: "thal", label: "Thalassemia", min: 0, max: 3, defaultVal: 2, step: 1, tooltip: "0: Normal, 1: Fixed Defect, 2: Reversible Defect, 3: Other" },
]

interface HeartTabProps {
  details: UserDetails
  onRiskChange: (risk: number | null) => void
  heartRisk: number | null
}

export function HeartTab({ details, onRiskChange, heartRisk }: HeartTabProps) {
  const [medicalValues, setMedicalValues] = useState<Record<string, number>>(
    () => Object.fromEntries(medicalInputs.map((inp) => [inp.key, inp.defaultVal]))
  )
  const [showMedical, setShowMedical] = useState(true)

  const handleMedicalChange = (key: string, value: number) => {
    setMedicalValues((prev) => ({ ...prev, [key]: value }))
  }

  const handlePredict = () => {
    const features = [
      details.age,
      details.gender === "Male" ? 1 : 0,
      medicalValues.cp,
      medicalValues.trestbps,
      medicalValues.chol,
      medicalValues.fbs,
      medicalValues.restecg,
      medicalValues.thalach,
      medicalValues.exang,
      medicalValues.oldpeak,
      medicalValues.slope,
      medicalValues.ca,
      medicalValues.thal,
    ]
    const result = simulateHeartRisk(features)
    onRiskChange(result)
  }

  const riskInfo = heartRisk !== null ? riskLevel(heartRisk) : null

  const featureImportance = useMemo(() => {
    if (heartRisk === null) return []
    const names = ["Age", "Sex", "Chest Pain", "BP", "Cholesterol", "FBS", "ECG", "Max HR", "Angina", "Oldpeak", "Slope", "CA", "Thal"]
    const weights = [0.04, 0.15, 0.2, 0.01, 0.005, 0.1, 0.05, 0.03, 0.3, 0.15, 0.1, 0.25, 0.12]
    const features = [
      details.age,
      details.gender === "Male" ? 1 : 0,
      medicalValues.cp,
      medicalValues.trestbps,
      medicalValues.chol,
      medicalValues.fbs,
      medicalValues.restecg,
      medicalValues.thalach,
      medicalValues.exang,
      medicalValues.oldpeak,
      medicalValues.slope,
      medicalValues.ca,
      medicalValues.thal,
    ]
    const contributions = names.map((name, i) => ({
      name,
      importance: Math.abs(weights[i] * features[i]),
    }))
    contributions.sort((a, b) => b.importance - a.importance)
    const maxImportance = contributions[0]?.importance || 1
    return contributions.map((c) => ({ ...c, normalized: c.importance / maxImportance }))
  }, [heartRisk, details, medicalValues])

  return (
    <div className="flex flex-col gap-6">
      {/* Medical Inputs */}
      <Card className="border-border bg-card">
        <CardHeader>
          <button
            onClick={() => setShowMedical(!showMedical)}
            className="flex w-full items-center justify-between cursor-pointer"
          >
            <div>
              <CardTitle className="text-lg font-semibold text-foreground text-left">Clinical Parameters</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground text-left">Provide clinical data for heart disease risk prediction</p>
            </div>
            {showMedical ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {showMedical && (
          <CardContent className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {medicalInputs.map((input) => (
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
                      {input.step < 1 ? medicalValues[input.key].toFixed(1) : medicalValues[input.key]}
                    </span>
                  </div>
                  <Slider
                    value={[medicalValues[input.key]]}
                    onValueChange={(v) => handleMedicalChange(input.key, v[0])}
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
              <Heart className="h-4 w-4" />
              Predict Heart Disease Risk
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Risk Results */}
      {heartRisk !== null && riskInfo && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className={`border ${riskInfo.border} ${riskInfo.bg} col-span-1`}>
              <CardContent className="flex flex-col items-center gap-4 py-8">
                <RadialProgress
                  value={heartRisk * 100}
                  max={100}
                  color={heartRisk > 0.7 ? "var(--danger)" : heartRisk > 0.4 ? "var(--warning)" : "var(--success)"}
                  sublabel="%"
                  label="Risk Score"
                />
                <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${riskInfo.color} bg-card`}>
                  {heartRisk > 0.7 ? <XCircle className="h-4 w-4" /> : heartRisk > 0.4 ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  {riskInfo.label} Risk
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Explainable AI - Feature Contributions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-2">
                {featureImportance.slice(0, 8).map((feat) => (
                  <div key={feat.name} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-muted-foreground shrink-0">{feat.name}</span>
                    <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
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
        </div>
      )}
    </div>
  )
}

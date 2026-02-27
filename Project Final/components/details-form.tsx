"use client"

import { useState } from "react"
import { User, Ruler, Weight, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface UserDetails {
  age: number
  gender: "Male" | "Female"
  height: number
  weight: number
}

interface DetailsFormProps {
  onSubmit: (details: UserDetails) => void
  onBack: () => void
}

export function DetailsForm({ onSubmit, onBack }: DetailsFormProps) {
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<"Male" | "Female">("Male")
  const [height, setHeight] = useState(170)
  const [weight, setWeight] = useState(70)

  const bmiPreview = (weight / (height / 100) ** 2).toFixed(1)

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Your Details</h2>
          <p className="mt-2 text-muted-foreground">Enter your basic information to get started.</p>
        </div>

        <div className="mt-10 flex flex-col gap-8 animate-fade-in-delay-1">
          {/* Age */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="h-4 w-4 text-primary" />
                Age
              </Label>
              <span className="text-sm font-mono font-semibold text-primary">{age} years</span>
            </div>
            <Slider
              value={[age]}
              onValueChange={(v) => setAge(v[0])}
              min={20}
              max={80}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>20</span>
              <span>80</span>
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-3">
            <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="h-4 w-4 text-primary" />
              Gender
            </Label>
            <Select value={gender} onValueChange={(v) => setGender(v as "Male" | "Female")}>
              <SelectTrigger className="h-11 rounded-xl border-border bg-card text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Height */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Ruler className="h-4 w-4 text-primary" />
                Height
              </Label>
              <span className="text-sm font-mono font-semibold text-primary">{height} cm</span>
            </div>
            <Slider
              value={[height]}
              onValueChange={(v) => setHeight(v[0])}
              min={140}
              max={200}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>140 cm</span>
              <span>200 cm</span>
            </div>
          </div>

          {/* Weight */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Weight className="h-4 w-4 text-primary" />
                Weight
              </Label>
              <span className="text-sm font-mono font-semibold text-primary">{weight} kg</span>
            </div>
            <Slider
              value={[weight]}
              onValueChange={(v) => setWeight(v[0])}
              min={40}
              max={120}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>40 kg</span>
              <span>120 kg</span>
            </div>
          </div>

          {/* BMI Preview */}
          <div className="rounded-xl border border-border bg-card/50 p-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated BMI</span>
            <span className="text-lg font-mono font-bold text-primary">{bmiPreview}</span>
          </div>

          <Button
            size="lg"
            onClick={() => onSubmit({ age, gender, height, weight })}
            className="h-12 gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 cursor-pointer"
          >
            Generate Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

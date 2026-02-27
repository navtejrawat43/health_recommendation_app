"use client"

import { Activity, Heart, Shield, ArrowRight, Droplets, Apple, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onStart: () => void
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

      {/* Floating badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 animate-fade-in">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          AI-Powered Health Analysis
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
          </span>
          Diabetes Screening
        </div>
      </div>

      {/* Main heading */}
      <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground text-balance animate-fade-in-delay-1">
        Your AI Health &<br />
        <span className="text-primary">Wellness</span> Coach
      </h1>

      <p className="mt-6 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground animate-fade-in-delay-2">
        Predict heart disease and diabetes risk with machine learning. Get a personalized diet plan and exercise routine tailored to your health profile.
      </p>

      {/* CTA Button */}
      <div className="mt-10 animate-fade-in-delay-3">
        <Button
          size="lg"
          onClick={onStart}
          className="h-12 gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 cursor-pointer"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Feature cards */}
      <div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 animate-fade-in-delay-3">
        <FeatureCard
          icon={<Heart className="h-5 w-5 text-primary" />}
          title="Heart Risk"
          description="ML-powered cardiac risk prediction"
        />
        <FeatureCard
          icon={<Droplets className="h-5 w-5 text-primary" />}
          title="Diabetes Risk"
          description="Blood sugar risk assessment"
        />
        <FeatureCard
          icon={<Activity className="h-5 w-5 text-primary" />}
          title="BMI Analysis"
          description="Body mass index calculation"
        />
        <FeatureCard
          icon={<Apple className="h-5 w-5 text-primary" />}
          title="Diet Plan"
          description="Personalized nutrition guidance"
        />
        <FeatureCard
          icon={<Dumbbell className="h-5 w-5 text-primary" />}
          title="Exercise Plan"
          description="Custom workout routines"
        />
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card/50 p-6 text-center transition-colors duration-200 hover:border-primary/30 hover:bg-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

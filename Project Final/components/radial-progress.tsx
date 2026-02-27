"use client"

import { useEffect, useRef } from "react"

interface RadialProgressProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  sublabel?: string
}

export function RadialProgress({
  value,
  max,
  size = 140,
  strokeWidth = 10,
  color = "var(--primary)",
  label,
  sublabel,
}: RadialProgressProps) {
  const svgRef = useRef<SVGCircleElement>(null)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = Math.min((value / max) * 100, 100)
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  useEffect(() => {
    const circle = svgRef.current
    if (circle) {
      circle.style.transition = "stroke-dashoffset 1s ease-out"
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            ref={svgRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-mono text-foreground">{value.toFixed(1)}</span>
          {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
    </div>
  )
}

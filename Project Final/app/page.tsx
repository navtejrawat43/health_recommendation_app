"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { DetailsForm, type UserDetails } from "@/components/details-form"
import { Dashboard } from "@/components/dashboard"

type Page = "hero" | "details" | "dashboard"

export default function Home() {
  const [page, setPage] = useState<Page>("hero")
  const [details, setDetails] = useState<UserDetails | null>(null)

  const handleDetailsSubmit = (data: UserDetails) => {
    setDetails(data)
    setPage("dashboard")
  }

  return (
    <main className="min-h-screen bg-background">
      {page === "hero" && <HeroSection onStart={() => setPage("details")} />}
      {page === "details" && (
        <DetailsForm
          onSubmit={handleDetailsSubmit}
          onBack={() => setPage("hero")}
        />
      )}
      {page === "dashboard" && details && (
        <Dashboard
          details={details}
          onBack={() => setPage("details")}
        />
      )}
    </main>
  )
}

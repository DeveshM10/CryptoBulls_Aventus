import type { Metadata } from "next"
import { DashboardPage } from "@/components/dashboard/dashboard-page"

export const metadata: Metadata = {
  title: "Dashboard - FinVault",
  description: "View your financial overview",
}

export default function Dashboard() {
  return <DashboardPage />
}

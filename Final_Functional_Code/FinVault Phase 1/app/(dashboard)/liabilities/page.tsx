import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Liabilities - FinVault",
  description: "Manage your liabilities",
}

export default function LiabilitiesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Liabilities</h2>
      </div>
      <div className="flex items-center justify-center h-[500px] border rounded-md">
        <p className="text-muted-foreground">Liabilities management coming soon</p>
      </div>
    </div>
  )
}

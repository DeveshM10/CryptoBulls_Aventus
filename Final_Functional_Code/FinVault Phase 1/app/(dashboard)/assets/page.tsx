import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Assets - FinVault",
  description: "Manage your assets",
}

export default function AssetsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Assets</h2>
      </div>
      <div className="flex items-center justify-center h-[500px] border rounded-md">
        <p className="text-muted-foreground">Assets management coming soon</p>
      </div>
    </div>
  )
}

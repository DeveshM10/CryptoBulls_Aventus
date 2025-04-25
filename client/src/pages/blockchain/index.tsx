import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, RefreshCw, ShieldCheck, Wallet as WalletIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function BlockchainSettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <a className="mr-6 flex items-center gap-2 md:mr-8" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="font-bold">FinVault</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="font-medium transition-colors hover:text-primary" href="/">Dashboard</a>
            <a className="font-medium transition-colors hover:text-primary" href="/assets">Assets</a>
            <a className="font-medium transition-colors hover:text-primary" href="/blockchain">Blockchain</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area with padding for fixed sidebar */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Blockchain Settings</h1>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Connections
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Connected Wallet</CardTitle>
              <CardDescription>Manage your connected crypto wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <WalletIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">MetaMask</div>
                    <div className="text-sm text-muted-foreground">0x83f...a3b2</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Disconnect</Button>
                  <Button size="sm">View on Explorer</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Settings</CardTitle>
              <CardDescription>Configure blockchain network settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#627EEA]/10 flex items-center justify-center">
                        <span className="text-[#627EEA] text-xs font-bold">Ξ</span>
                      </div>
                      <span className="font-medium">Ethereum Mainnet</span>
                    </div>
                    <Switch id="ethereum-switch" checked={true} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Chain ID: 1
                  </div>
                  <div className="text-sm text-muted-foreground">
                    RPC URL: https://mainnet.infura.io/v3/...
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#8247E5]/10 flex items-center justify-center">
                        <span className="text-[#8247E5] text-xs font-bold">P</span>
                      </div>
                      <span className="font-medium">Polygon Mainnet</span>
                    </div>
                    <Switch id="polygon-switch" checked={true} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Chain ID: 137
                  </div>
                  <div className="text-sm text-muted-foreground">
                    RPC URL: https://polygon-rpc.com
                  </div>
                </div>
              </div>

              <Button className="w-full" variant="outline">Add Custom Network</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security settings for your blockchain activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-y-0">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="transaction-signing" className="text-sm font-medium">
                    Require Transaction Signing
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Request approval before sending any transaction.
                  </span>
                </div>
                <Switch id="transaction-signing" checked={true} />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="contract-validation" className="text-sm font-medium">
                    Smart Contract Validation
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Validate smart contracts before interaction.
                  </span>
                </div>
                <Switch id="contract-validation" checked={true} />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="address-book" className="text-sm font-medium">
                    Use Address Book Only
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Restrict transactions to saved addresses only.
                  </span>
                </div>
                <Switch id="address-book" checked={false} />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="auto-lock" className="text-sm font-medium">
                    Auto-lock After Inactivity
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Automatically lock wallet after 15 minutes of inactivity.
                  </span>
                </div>
                <Switch id="auto-lock" checked={true} />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
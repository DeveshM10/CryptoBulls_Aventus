import { MainLayout } from "@/components/layout/main-layout";
import { Helmet } from "react-helmet-async";
import { DynamicBlockchainTransactions } from "@/components/blockchain/dynamic-transactions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  ArrowLeftRight,
  LinkIcon, 
  PieChart, 
  Share, 
  ShieldCheck,
  Activity
} from "lucide-react";
import { useState } from "react";

export default function BlockchainPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  
  return (
    <MainLayout>
      <Helmet>
        <title>Blockchain | FinVault</title>
      </Helmet>
      
      <div className="container py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Blockchain</h1>
              <p className="text-muted-foreground">
                Connect your crypto wallets and manage blockchain assets
              </p>
            </div>
            
            <Button 
              className="flex items-center gap-2"
              onClick={() => setWalletConnected(!walletConnected)}
            >
              <Wallet className="h-4 w-4" />
              {walletConnected ? "Disconnect Wallet" : "Connect Wallet"}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Portfolio Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹34,245.78</div>
                <p className="text-xs text-muted-foreground mt-1">
                  1.253 ETH • 0.065 BTC • 12 MATIC
                </p>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+3.2% today</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Wallets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg viewBox="0 0 35 33" className="h-5 w-5 text-orange-500">
                        <path fill="currentColor" d="M32.9582 1l-13.1341 9.7183 2.4424-5.72731z" fillOpacity=".8"></path>
                        <path fill="currentColor" d="M32.9582 1l-13.1341 9.7183 2.4424-5.72731z" fillOpacity=".6"></path>
                        <path fill="currentColor" d="M14.9938 21.976l-2.8622-4.4218-8.585 6.4971z" fillOpacity=".6"></path>
                        <path fill="currentColor" d="M28.6312 17.264l-2.4343-8.473-.8633 4.2386z" fillOpacity=".6"></path>
                        <path fill="currentColor" d="M19.2874 14.986l-4.2967-1.7514 2.3889-4.7308z" fillOpacity=".6"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">MetaMask</div>
                      <div className="text-xs text-muted-foreground">0x83f...a3b2</div>
                    </div>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600">
                        <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Ledger</div>
                      <div className="text-xs text-muted-foreground">0x76a...12c9</div>
                    </div>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <ArrowLeftRight className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Swap ETH → USDC</div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                  <div className="font-medium">₹1,255.32</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Deposit MATIC</div>
                    <div className="text-xs text-muted-foreground">Yesterday</div>
                  </div>
                  <div className="font-medium">₹452.15</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <LinkIcon className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Bridge to Polygon</div>
                    <div className="text-xs text-muted-foreground">3 days ago</div>
                  </div>
                  <div className="font-medium">₹2,850.00</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid grid-cols-4 max-w-md">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="defi">DeFi</TabsTrigger>
              <TabsTrigger value="nft">NFTs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions" className="mt-4">
              <DynamicBlockchainTransactions />
            </TabsContent>
            
            <TabsContent value="assets" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Crypto Assets</CardTitle>
                  <CardDescription>Manage your cryptocurrency portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-6 text-muted-foreground">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-2 text-primary/30" />
                      <h3 className="text-lg font-medium mb-1">No Assets Found</h3>
                      <p className="text-sm mb-4">Connect your wallet to view and manage your crypto assets</p>
                      <Button>Connect Wallet</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="defi" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>DeFi Investments</CardTitle>
                  <CardDescription>Track your decentralized finance investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-6 text-muted-foreground">
                    <div className="text-center">
                      <Activity className="h-12 w-12 mx-auto mb-2 text-primary/30" />
                      <h3 className="text-lg font-medium mb-1">No DeFi Positions</h3>
                      <p className="text-sm mb-4">Connect your wallet to view and manage your DeFi positions</p>
                      <Button>Connect Wallet</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="nft" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>NFT Collection</CardTitle>
                  <CardDescription>Browse your NFT collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-6 text-muted-foreground">
                    <div className="text-center">
                      <Share className="h-12 w-12 mx-auto mb-2 text-primary/30" />
                      <h3 className="text-lg font-medium mb-1">No NFTs Found</h3>
                      <p className="text-sm mb-4">Connect your wallet to view and manage your NFT collection</p>
                      <Button>Connect Wallet</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {walletConnected && (
            <Card>
              <CardHeader>
                <CardTitle>Security Center</CardTitle>
                <CardDescription>
                  Security settings for your blockchain activities
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Transaction Signing</h3>
                    <p className="text-sm text-muted-foreground">
                      All transactions require explicit approval
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                    <Activity className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Advanced Protection</h3>
                    <p className="text-sm text-muted-foreground">
                      Smart contract validation is enabled
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Web3Provider } from "@/components/wallet/web3-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Dashboard from "@/pages/dashboard";
import KycPage from "@/pages/kyc";
import NotFound from "@/pages/not-found";
import LiabilitiesPage from "@/pages/liabilities";
import CreditScorePage from "@/pages/credit-score";
import ComparePage from "@/pages/compare";
import BudgetPage from "@/pages/budget";
import LearningHubPage from "@/pages/learning-hub";
import ToolsPage from "@/pages/tools";
import BlockchainPage from "@/pages/blockchain";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import LandingPage from "@/pages/landing";
import AuthPage from "@/pages/auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/kyc" component={KycPage} />
      <Route path="/assets" component={Dashboard} />
      <Route path="/liabilities" component={LiabilitiesPage} />
      <Route path="/credit-score" component={CreditScorePage} />
      <Route path="/compare" component={ComparePage} />
      <Route path="/budget" component={BudgetPage} />
      <Route path="/learning-hub" component={LearningHubPage} />
      <Route path="/tools" component={ToolsPage} />
      <Route path="/blockchain" component={BlockchainPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="finvault-theme">
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <Router />
          <Toaster />
        </Web3Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

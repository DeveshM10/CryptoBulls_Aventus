import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Web3Provider } from "@/components/wallet/web3-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { HelmetProvider } from 'react-helmet-async';
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
import AssetsPage from "@/pages/assets";
import PortfolioPage from "@/pages/portfolio";
import FraudDetectionPage from "@/pages/fraud-detection";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/kyc" component={KycPage} />
      <ProtectedRoute path="/assets" component={AssetsPage} />
      <ProtectedRoute path="/liabilities" component={LiabilitiesPage} />
      <ProtectedRoute path="/portfolio" component={PortfolioPage} />
      <ProtectedRoute path="/credit-score" component={CreditScorePage} />
      <ProtectedRoute path="/compare" component={ComparePage} />
      <ProtectedRoute path="/budget" component={BudgetPage} />
      <ProtectedRoute path="/learning-hub" component={LearningHubPage} />
      <ProtectedRoute path="/tools" component={ToolsPage} />
      <ProtectedRoute path="/blockchain" component={BlockchainPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/reports" component={ReportsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="finvault-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Web3Provider>
              <Router />
              <Toaster />
            </Web3Provider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

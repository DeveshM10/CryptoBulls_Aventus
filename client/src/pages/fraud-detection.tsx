import { MainLayout } from "@/components/layout/main-layout";
import { FraudDetectionDashboard } from "@/components/fraud-detection/FraudDetectionDashboard";
import { Helmet } from "react-helmet-async";

export default function FraudDetectionPage() {
  return (
    <MainLayout>
      <Helmet>
        <title>Fraud Detection | FinVault</title>
      </Helmet>
      
      <div className="container py-6 max-w-7xl mx-auto">
        <FraudDetectionDashboard />
      </div>
    </MainLayout>
  );
}
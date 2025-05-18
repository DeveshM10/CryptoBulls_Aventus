import { Sidebar } from "@/components/layout/sidebar";
import { FinancialTools } from "@/components/tools/financial-tools";
import { Helmet } from "react-helmet-async";

export default function ToolsPage() {
  return (
    <>
      <Helmet>
        <title>Financial Tools | FinVault</title>
      </Helmet>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <FinancialTools />
        </div>
      </div>
    </>
  );
}
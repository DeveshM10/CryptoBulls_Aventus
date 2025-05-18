import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Briefcase } from "lucide-react";

export function PortfolioLink() {
  return (
    <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-4 rounded-lg border shadow-sm">
      <div className="flex flex-col items-start space-y-3">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-primary/20 p-2">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Portfolio Management</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your entire financial portfolio including assets and liabilities in one place with voice input capability.
        </p>
        <Link href="/portfolio">
          <Button variant="outline" className="mt-2">
            Go to Portfolio
          </Button>
        </Link>
      </div>
    </div>
  );
}
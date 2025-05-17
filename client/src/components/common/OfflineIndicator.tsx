import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    // Handler to update online/offline status
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    // Listen for events
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center">
      <Badge variant="destructive" className="px-3 py-1.5 text-sm flex items-center gap-2">
        <WifiOff size={16} />
        <span>Offline Mode</span>
      </Badge>
    </div>
  );
}
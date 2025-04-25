"use client"

import { useState, useEffect } from "react";
import { useWeb3 } from "@/components/wallet/web3-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, CheckCircle, Copy, Wallet, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function WalletConnect() {
  const { connectWallet, disconnectWallet, account, isConnecting, error } = useWeb3();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Format address to display 0x123...abc
  const formatAddress = (address: string | null): string => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Copy wallet address to clipboard
  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleConnectClick = () => {
    setIsDialogOpen(true);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
      variant: "default",
    });
  };

  const handleConfirmConnect = async () => {
    await connectWallet();
    if (!error) {
      setIsDialogOpen(false);
    }
  };

  // Close dialog when account connects successfully
  useEffect(() => {
    if (account && isDialogOpen) {
      setIsDialogOpen(false);
      toast({
        title: "Wallet connected",
        description: "Your wallet is now connected to the application",
        variant: "default",
      });
    }
  }, [account, isDialogOpen, toast]);

  return (
    <>
      {!account ? (
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleConnectClick}
            className="w-full flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            Connect MetaMask
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-2 text-emerald-500">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Connected</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted p-2">
            <div className="wallet-address text-xs font-mono max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
              {account}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy address</span>
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-1" 
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask logo" 
                className="w-6 h-6" 
              />
              Connect MetaMask
            </DialogTitle>
            <DialogDescription>
              Connect your wallet to access all features of the application
            </DialogDescription>
          </DialogHeader>
          
          {isConnecting && (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Connecting your wallet...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">Connection Error</p>
              </div>
              <p className="text-sm mt-1">
                {error === "MetaMask not installed" 
                  ? "MetaMask extension is not installed. Please install it and try again."
                  : error}
              </p>
            </div>
          )}
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmConnect}
              disabled={isConnecting}
            >
              Connect Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

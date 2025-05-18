import React, { useState, useEffect, createContext, useContext } from "react";

interface Web3ContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
}

// Create Web3 context
const Web3Context = createContext<Web3ContextType>({
  account: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
  error: null,
});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== "undefined" && window.ethereum !== undefined;
  };

  // Initialize - check for existing connection
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        // Check if already connected
        const accounts = await window.ethereum!.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    };

    checkConnection();

    // Setup event listeners for account changes
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setAccount(null);
        } else {
          setAccount(accounts[0]);
        }
      };

      window.ethereum!.on("accountsChanged", handleAccountsChanged);

      return () => {
        // Cleanup event listeners
        if (isMetaMaskInstalled()) {
          window.ethereum!.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
    
    return undefined;
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    if (!isMetaMaskInstalled()) {
      setError("MetaMask not installed");
      setIsConnecting(false);
      return;
    }

    try {
      const accounts = await window.ethereum!.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to connect wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
  };

  return (
    <Web3Context.Provider 
      value={{
        account,
        connectWallet,
        disconnectWallet,
        isConnecting,
        error
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Hook to use Web3 context
export function useWeb3() {
  return useContext(Web3Context);
}

// Type declaration for global ethereum object
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
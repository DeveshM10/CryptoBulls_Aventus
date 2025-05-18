"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { AddTransactionForm } from "@/components/blockchain/add-transaction-form"
import { useFinanceStore } from "@/components/store/finance-store"

// Sample blockchain transaction data
// In a real app, this would come from an API
const initialTransactions = [
  {
    id: "tx_01",
    hash: "0x7d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f",
    from: "0x1234...5678",
    to: "0x8765...4321",
    amount: "$1,250.00",
    type: "Mortgage Payment",
    timestamp: "2025-04-15T10:30:00Z",
    status: "verified",
    confirmations: 12,
  },
  {
    id: "tx_02",
    hash: "0x8e5f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f",
    from: "0x8765...4321",
    to: "0x1234...5678",
    amount: "$4,200.00",
    type: "Salary Deposit",
    timestamp: "2025-04-10T09:15:00Z",
    status: "verified",
    confirmations: 24,
  },
  {
    id: "tx_03",
    hash: "0x9f6f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f",
    from: "0x1234...5678",
    to: "0x5555...6666",
    amount: "$128.42",
    type: "Grocery Purchase",
    timestamp: "2025-04-08T15:45:00Z",
    status: "verified",
    confirmations: 30,
  },
  {
    id: "tx_04",
    hash: "0xa07f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f",
    from: "0x1234...5678",
    to: "0x7777...8888",
    amount: "$86.30",
    type: "Restaurant Payment",
    timestamp: "2025-04-05T19:20:00Z",
    status: "verified",
    confirmations: 42,
  },
  {
    id: "tx_05",
    hash: "0xb18f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f4d8f",
    from: "0x1234...5678",
    to: "0x9999...0000",
    amount: "$450.00",
    type: "Credit Card Payment",
    timestamp: "2025-04-03T14:10:00Z",
    status: "pending",
    confirmations: 5,
  },
]

// Sample KYC data
const kycData = {
  status: "verified",
  verifiedOn: "2025-03-15T10:30:00Z",
  documents: [
    { type: "ID Card", status: "verified", date: "2025-03-10T14:25:00Z" },
    { type: "Proof of Address", status: "verified", date: "2025-03-12T09:15:00Z" },
    { type: "Bank Statement", status: "verified", date: "2025-03-14T16:40:00Z" },
  ],
}

export default function BlockchainPage() {
  const { transactions, addTransaction } = useFinanceStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [verifyHash, setVerifyHash] = useState("")
  const [verificationResult, setVerificationResult] = useState(null)
  const [expandedTransaction, setExpandedTransaction] = useState(null)

  // Initialize with sample data if no transactions exist
  const allTransactions = transactions.length > 0 ? transactions : initialTransactions

  // Filter transactions based on search term
  const filteredTransactions = allTransactions.filter(
    (tx) =>
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle hash verification
  const handleVerifyHash = () => {
    // In a real app, this would make an API call to verify the hash
    // For this example, we'll just check if the hash exists in our sample data
    const transaction = allTransactions.find((tx) => tx.hash === verifyHash)

    if (transaction) {
      setVerificationResult({
        valid: true,
        transaction,
      })
    } else {
      setVerificationResult({
        valid: false,
        message: "Hash not found in the blockchain.",
      })
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Toggle transaction details
  const toggleTransaction = (id) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null)
    } else {
      setExpandedTransaction(id)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blockchain Logs</h2>
          <p className="text-muted-foreground">View and verify your financial transactions on the blockchain</p>
        </div>
        <AddTransactionForm onAddTransaction={addTransaction} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {/* Transaction Ledger */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Ledger</CardTitle>
              <CardDescription>Secure record of all your financial transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <div key={tx.id} className="border rounded-lg overflow-hidden">
                      <div
                        className={`p-4 cursor-pointer ${
                          tx.status === "verified" ? "bg-emerald-500/10" : "bg-amber-500/10"
                        }`}
                        onClick={() => toggleTransaction(tx.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{tx.type}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(tx.timestamp)}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{tx.amount}</div>
                            <div
                              className={`text-xs ${tx.status === "verified" ? "text-emerald-500" : "text-amber-500"}`}
                            >
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)} • {tx.confirmations}{" "}
                              confirmations
                            </div>
                          </div>
                        </div>
                      </div>

                      {expandedTransaction === tx.id && (
                        <div className="p-4 bg-muted/30 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Transaction Hash</div>
                              <div className="text-xs font-mono break-all">{tx.hash}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">From</div>
                              <div className="font-mono">{tx.from}</div>
                              <div className="text-sm text-muted-foreground mt-2">To</div>
                              <div className="font-mono">{tx.to}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found matching your search.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Hash Verification */}
          <Card>
            <CardHeader>
              <CardTitle>Verify Transaction</CardTitle>
              <CardDescription>Validate the authenticity of a transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Transaction Hash</label>
                <Input
                  placeholder="Enter transaction hash..."
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                />
                <button
                  className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
                  onClick={handleVerifyHash}
                >
                  Verify Hash
                </button>
              </div>

              {verificationResult && (
                <div
                  className={`p-4 rounded-lg ${
                    verificationResult.valid
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-rose-500/10 border border-rose-500/20"
                  }`}
                >
                  {verificationResult.valid ? (
                    <div>
                      <div className="font-medium text-emerald-500 mb-2">Transaction Verified</div>
                      <div className="text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span> {verificationResult.transaction.type}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount:</span> {verificationResult.transaction.amount}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date:</span>{" "}
                          {formatDate(verificationResult.transaction.timestamp)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="font-medium text-rose-500">{verificationResult.message}</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* KYC Status */}
          <Card>
            <CardHeader>
              <CardTitle>KYC Status</CardTitle>
              <CardDescription>Your identity verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status</span>
                  <span className={`text-sm ${kycData.status === "verified" ? "text-emerald-500" : "text-amber-500"}`}>
                    {kycData.status.charAt(0).toUpperCase() + kycData.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Verified On</span>
                  <span className="text-sm">{formatDate(kycData.verifiedOn)}</span>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Verified Documents</h4>
                  <div className="space-y-2">
                    {kycData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{doc.type}</span>
                        <span className="text-emerald-500">{formatDate(doc.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Info */}
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Info</CardTitle>
              <CardDescription>Information about the blockchain network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <span className="font-medium">FinVault Chain</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-emerald-500">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Block Height</span>
                  <span className="font-mono">1,245,678</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Block</span>
                  <span className="text-sm">2 minutes ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import type { BankStatement, BankStatementResponse } from "@/types/response"
import { cn } from "@/lib/utils"

interface BankStatementCompProps {
    bankStatement: BankStatement[]
    status: BankStatementResponse["status"] | null
}

const BankStatementComp = ({ bankStatement, status }: BankStatementCompProps) => {
    const [activeTab, setActiveTab] = useState(0)
    console.log("Status", status)
    if (status === "PROCESSING" || !status) return
    if (status === "FAILED" || !bankStatement || bankStatement.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-20">
                <div className="font-bold text-2xl text-muted-foreground">No Data Available</div>
            </div>
        )
    }

    const currentStatement = bankStatement[activeTab]

    return (
        <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
            {/* Custom Trapezoidal Tabs */}
            <div className="flex items-end border-b-2 border-black">
                {bankStatement.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={cn(
                            "relative px-8 py-2 transition-all duration-200 group outline-none",
                            activeTab === index ? "z-10" : "z-0 hover:z-10",
                        )}
                    >
                        {/* Trapezoid Background */}
                        <div
                            className={cn(
                                "absolute inset-0 transition-colors duration-200",
                                activeTab === index ? "bg-white" : "bg-[#D1D5DB] hover:bg-[#E5E7EB]",
                            )}
                            style={{
                                clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                                transform: "scaleX(1.1)",
                            }}
                        />
                        {/* Border Effect */}
                        <div
                            className={cn(
                                "absolute inset-0 border-x-2 border-t-2 border-black pointer-events-none",
                                activeTab === index ? "opacity-100" : "opacity-100",
                            )}
                            style={{
                                clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                                transform: "scaleX(1.1)",
                            }}
                        />
                        {/* Label */}
                        <span
                            className={cn(
                                "relative z-10 font-bold text-sm tracking-wide",
                                activeTab === index ? "text-black" : "text-[#4B5563]",
                            )}
                        >
                            File {index + 1}
                        </span>
                    </button>
                ))}
            </div>

            {/* Statement Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Header Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                    <InfoRow label="File name" value={currentStatement.fileName} />
                    <div className="hidden md:block" /> {/* Spacer */}
                    <InfoRow label="Account Number" value={currentStatement.accountNumber} />
                    <InfoRow label="Bank Name" value={currentStatement.bankName} />
                    <InfoRow label="Account Holder" value={currentStatement.accountHolderName} />
                    <div className="hidden md:block col-span-2 h-4" /> {/* Spacer */}
                    <InfoRow label="Opening Balance" value={`₹ ${currentStatement.openingBalance.toLocaleString()}`} />
                    <InfoRow label="Closing Balance" value={`₹ ${currentStatement.closingBalance.toLocaleString()}`} />
                    <InfoRow label="Start Date" value={currentStatement.statementStartDate} />
                    <InfoRow label="End Date" value={currentStatement.statementEndDate} />
                </div>

                {/* Transactions Section */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Transactions</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F3F4F6]">
                                    <th className="p-3 font-bold border-b border-black">Date</th>
                                    <th className="p-3 font-bold border-b border-black">Description</th>
                                    <th className="p-3 font-bold border-b border-black">Debit</th>
                                    <th className="p-3 font-bold border-b border-black">Credit</th>
                                    <th className="p-3 font-bold border-b border-black text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStatement.transactions.map((tx, idx) => (
                                    <tr key={idx} className={cn(idx % 2 === 1 ? "bg-[#F3F4F6]" : "bg-white")}>
                                        <td className="p-3">{tx.date}</td>
                                        <td className="p-3">{tx.description}</td>
                                        <td className="p-3">{tx.debitAmount ? `₹ ${tx.debitAmount.toLocaleString()}` : ""}</td>
                                        <td className="p-3">{tx.creditAmount ? `₹ ${tx.creditAmount.toLocaleString()}` : ""}</td>
                                        <td className="p-3 text-right font-medium">₹ {tx.runningBalance.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-2 py-2 group">
            <span className="font-bold text-[#111827]">{label}</span>
            <span className="text-[#111827] group-odd:bg-transparent">{value}</span>
        </div>
    )
}

export default BankStatementComp

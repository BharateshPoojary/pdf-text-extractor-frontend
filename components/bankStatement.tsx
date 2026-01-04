"use client"

import type { BankStatement, BankStatementResponse } from "@/types/response"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MainDataTable from "./common/main-data-table"
import { expenseColumn } from "./expense-column"

interface BankStatementCompProps {
    bankStatement: BankStatement[]
    status: BankStatementResponse["status"] | null
}

const BankStatementComp = ({ bankStatement, status }: BankStatementCompProps) => {
    console.log("Status", status)
    if (status === "PROCESSING" || !status) return null
    if (status === "FAILED" || !bankStatement || bankStatement.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-20">
                <div className="font-bold text-2xl text-muted-foreground">No Data Available</div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
            <Tabs defaultValue="0" className="w-full">
                <TabsList className="mb-4">
                    {bankStatement.map((_, index) => (
                        <TabsTrigger key={index} value={index.toString()}>
                            File {index + 1}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {bankStatement.map((currentStatement, index) => (
                    <TabsContent
                        key={index}
                        value={index.toString()}
                        className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
                    >
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
                                <MainDataTable
                                    columns={expenseColumn}
                                    data={currentStatement.transactions}
                                    title=""

                                />
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-2 py-2 group">
            <span className="font-bold text-foreground">{label}</span>
            <span className="text-foreground group-odd:bg-transparent">{value}</span>
        </div>
    )
}

export default BankStatementComp

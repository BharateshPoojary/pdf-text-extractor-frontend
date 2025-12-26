"use client"
import BankStatementComp from "@/components/bankStatement";
import { InputFile } from "@/components/common/input-file";
import { BankStatement, BankStatementResponse } from "@/types/response";
import { useState } from "react";

export default function Home() {

  const [BankStatement, setBankStatement] = useState<BankStatement[]>([])
  const [status, setStatus] = useState<BankStatementResponse["status"] | null>(null)
  return (
    <div className=" flex flex-col w-full p-5">
      <InputFile setBankStatement={setBankStatement} 
        setStatus={setStatus}
status={status}
      />
      <BankStatementComp bankStatement={BankStatement} status={status} />
    </div>
  );
}

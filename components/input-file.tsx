"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "./ui/button"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import axios, { AxiosResponse, isAxiosError } from "axios"
import { BankStatement, BankStatementResponse, UploadApiResponse } from "@/types/response"
import { Trash2 } from "lucide-react"

export function InputFile({ setBankStatement, setStatus, status }: { setBankStatement: (val: BankStatement[]) => void, setStatus: (val: BankStatementResponse["status"]) => void, status: BankStatementResponse["status"] | null }) {
    const [file, setFile] = useState<File | null>(null)

    const [jobId, setJobId] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }
    const handleClearFile = () => {
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!file) {
            toast.error("Please select a file first")
            return
        }

        console.log("File", file)
        setStatus("PROCESSING")

        try {
            const formData = new FormData()
            formData.append("pdf-file", file)


            const response: AxiosResponse<UploadApiResponse> = await axios.post(
                "https://pdf-text-extractor-backend.vercel.app/api/uploadfile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            console.log(response.data)
            const { jobId, message } = response.data;
            setJobId(jobId)
            toast.success(message)

        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || "Upload failed")
            } else if (error instanceof Error) {
                toast.error(error.message)
            } else {
                console.error("Error processing file:", error)
                toast.error("Error processing file")
            }
        } finally {
            setFile(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }
    useEffect(() => {
        if (!jobId) return; // Guard clause

        const interval = setInterval(async () => {
            try {
                const getBankStatements: AxiosResponse<BankStatementResponse> =
                    await axios.get(`https://pdf-text-extractor-backend.vercel.app/api/notify/${jobId}`);

                // Check if job is complete and stop polling
                if (getBankStatements.data.status === 'COMPLETED') {
                    toast.success("bank statement processed successfully")
                    setBankStatement(getBankStatements.data.data)
                    clearInterval(interval);
                    setStatus(getBankStatements.data.status)

                    // Handle the completed data
                }
                if (getBankStatements.data.status === "FAILED") {
                    toast.error("Failed to process pdf")
                    setStatus("FAILED")
                    clearInterval(interval);
                }

            } catch (error) {
                console.error('Polling error:', error);
                // Optionally stop polling on error
                // clearInterval(interval);
            }
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, [jobId]);
    console.log("STATUS",status)
    return (
        <div className="grid w-full items-start gap-3 justify-start">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <Label htmlFor="pdf-file" className="py-1 my-2">Select File to Extract</Label>
                    <div className="flex space-x-2 items-center">


                        <Input
                            ref={fileInputRef}
                            id="pdf-file"
                            name="pdf-file"
                            type="file"
                            className="cursor-pointer"
                            onChange={handleFileChange}
                            accept=".pdf"
                            disabled={status === "PROCESSING"}
                        />
                        {(file && (status !== "PROCESSING")) &&
                            <Trash2 color="red" onClick={handleClearFile} />
                        }
                    </div>
                </div>
                <Button
                    type="submit"
                    className="cursor-pointer"
                    disabled={!file || status === "PROCESSING"}
                >
                    {status === "PROCESSING" ? "Processing..." : "Process File"}
                </Button>
            </form>
        </div>
    )
}
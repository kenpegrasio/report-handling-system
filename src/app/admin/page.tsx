import { prisma } from "@/db";

export default async function Admin() {
    const reports = await prisma.report.findMany()
    return (
        <div className="flex items-center justify-center flex-col p-10">
            <h1 className="text-3xl">Report List</h1>
            {reports.map((report) => {
                return (
                    <div key={report.id}> 
                        <h1 className="text-xl">Type: {report.type}</h1>
                        <h1 className="text-xl">Target ID: {report.target_id}</h1>
                        <h1 className="text-xl">Reason: {report.reason}</h1>
                        <h1 className="text-xl">Description: {report.description}</h1>
                    </div>
                )
            })}
        </div>
    )
}
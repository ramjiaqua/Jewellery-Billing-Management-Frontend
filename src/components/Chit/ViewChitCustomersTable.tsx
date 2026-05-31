import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import {useEffect, useState} from "react";
import api from "../../common/axiosConfig.tsx";


export default function ViewChitCustomersTable() {
    const [chitCustomers, setChitCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [nameFilter, setNameFilter] = useState("");
    const [phoneFilter, setPhoneFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");


    useEffect(() => {
        void fetchViewCustomers();
    }, [page, size, nameFilter, phoneFilter, statusFilter]);

    const fetchViewCustomers = async () => {
        try {
            const response = await api.get("/api/customers", {
                params: {
                    page,
                    size,
                    name: nameFilter || undefined,
                    phone: phoneFilter || undefined,
                    status: statusFilter || undefined,
                },
            });
            setChitCustomers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching Bills:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 text-gray-500">
                Loading...
            </div>
        );
    }

    return (
        <>
        <div className="overflow-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-wrap gap-4 p-4">
                <input
                    type="text"
                    placeholder="Search Customer Name"
                    value={nameFilter}
                    onChange={(e) => {
                        setPage(0);
                        setNameFilter(e.target.value);
                    }}
                    className="border rounded px-3 py-2"
                />

                <input
                    type="text"
                    placeholder="Search Phone Number"
                    value={phoneFilter}
                    onChange={(e) => {
                        setPage(0);
                        setPhoneFilter(e.target.value);
                    }}
                    className="border rounded px-3 py-2"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setPage(0);
                        setStatusFilter(e.target.value);
                    }}
                    className="border rounded px-3 py-2"
                >
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
             </div>
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-4 sm:px-6 text-start text-theme-sm"
                            >
                                Id
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-4 sm:px-6 text-start text-theme-sm"
                            >
                                Name
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Address
                            </TableCell>

                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Phone Number
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Created
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Referred By
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Status
                            </TableCell>


                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {chitCustomers.map((s) => (
                            <TableRow
                                key={s.id}
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"

                            >
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">
                                    {s.id}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.name}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.address}
                                </TableCell>

                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.phone}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.create_ts}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.referby}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Badge
                                        size="sm"
                                        color={
                                            (() => {
                                                if (s.status?.toLowerCase() === "active")
                                                    return "success";

                                                if (s.status?.toLowerCase() === "inactive")
                                                    return "error";

                                                return "warning";
                                            })()
                                        }
                                    >
                                        {s.status}
                                    </Badge>

                                </TableCell>

                                                          </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between p-4">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span>
                    Page {page + 1} of {totalPages}
                </span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>

            </div>
        </div>





</>
    );
}


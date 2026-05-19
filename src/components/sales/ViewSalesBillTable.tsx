import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import {API_URL} from '../../common/constants';
import axios from "axios";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";

export default function ViewSalesBillTable() {
    const [salesBills, setSalesBills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [billNumberFilter, setBillNumberFilter] = useState("");
    const [phoneFilter, setPhoneFilter] = useState("");
    const [pendingOnly, setPendingOnly] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const parseDate = (dateStr: string) => {
        if (!dateStr) return new Date(0);

        // assume DD-MM-YYYY
        const [day, month, year] = dateStr.split("-");
        return new Date(`${year}-${month}-${day}`);
    };

    useEffect(() => {
        void fetchViewBills();
    }, [
        page,
        billNumberFilter,
        phoneFilter,
        pendingOnly, fromDate, toDate
    ]);

    const fetchViewBills = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/bills`,
                {
                    params: {
                        page,
                        size,
                        billNumber: billNumberFilter,
                        phone: phoneFilter,
                        pendingOnly,
                        fromDate,
                        toDate
                    }
                });

            console.log(response);
            setSalesBills(response.data.content);
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
                Loading bills...
            </div>
        );
    }

    return (
        <div className="overflow-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-wrap gap-4 p-4">
                <input
                    type="text"
                    placeholder="Search Bill Number"
                    value={billNumberFilter}
                    onChange={(e) => {
                        setPage(0);
                        setBillNumberFilter(e.target.value);
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


                <div className="flex gap-3">

                    <div className="flex items-center gap-2">
                        <label>From</label>

                        <input
                            type="date"
                            value={
                                fromDate
                                    ? fromDate.split("-").reverse().join("-")
                                    : ""
                            }
                            onChange={(e) => {
                                setPage(0);

                                const value = e.target.value;

                                if (value) {
                                    const [year, month, day] = value.split("-");
                                    setFromDate(`${day}-${month}-${year}`);
                                } else {
                                    setFromDate("");
                                }
                            }}
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label>To</label>

                        <input
                            type="date"
                            value={
                                toDate
                                    ? toDate.split("-").reverse().join("-")
                                    : ""
                            }
                            onChange={(e) => {
                                setPage(0);

                                const value = e.target.value;

                                if (value) {
                                    const [year, month, day] = value.split("-");
                                    setToDate(`${day}-${month}-${year}`);
                                } else {
                                    setToDate("");
                                }
                            }}
                            className="border rounded px-3 py-2"
                        />
                    </div>

                </div>


                <label className="flex items-center gap-2">

                    <input
                        type="checkbox"
                        checked={pendingOnly}
                        onChange={(e) => {
                            setPage(0);
                            setPendingOnly(e.target.checked);
                        }}
                    />

                    Balance Greater Than 0
                </label>

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
                                Bill Number
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-4 sm:px-6 text-start text-theme-sm"
                            >
                                Date
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
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
                                Item
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Weight
                            </TableCell>

                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Rate
                            </TableCell>

                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Making Charge
                            </TableCell>

                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Total Amount
                            </TableCell>

                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Paid Amount
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Balance
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Due Date
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Payment Mode
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Billed By
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {salesBills.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">
                                    {s.billNumber}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.billDate}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.billName}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.billAddress}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.billPhone}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.billItemName}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.billWeight}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    ₹{s.billRate}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    ₹{s.billMakingCharge}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    ₹{s.billTotalAmount}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    ₹{s.billPaidAmount}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Badge
                                        size="sm"
                                        color={
                                            (() => {
                                                const balance = Number(s.billBalance);
                                                const dueDate = parseDate(s.billBalanceDue);
                                                const today = new Date();

                                                if (balance <= 0) return "success";
                                                if (dueDate < today && balance > 0) return "error";
                                                return "warning";
                                            })()
                                        }
                                    >
                                        ₹{s.billBalance}
                                    </Badge>
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.billBalanceDue}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {s.billPaymentMode}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {s.billBilledBy}
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


    );
}


import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import api from "../../common/axiosConfig.tsx";
import {Modal} from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import {useModal} from "../../hooks/useModal.ts";

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
    const paymentMethod = ["Cash", "Card", "UPI"];
    const { isOpen, openModal, closeModal } = useModal();
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedBill, setSelectedBill] = useState<any>({});
    const [payAmount, setPayAmount] = useState("");
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



    const handleSave = async () => {
        try {
console.log(selectedBill.id);
console.log(payAmount);
            if (isEditMode) {
                await api.post(
                    `/api/balance/pay-balance/${selectedBill.id}`,
                    {
                        payAmount,
                        paymentMode: selectedBill.billPaymentMode
                    }
                );
            }
            await fetchViewBills();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };


    const fetchViewBills = async () => {
        try {
            const response = await api.get("/api/bills",
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
        <>
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
                                {s.billBalance > 0 && (
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">

                                    <button
                                        onClick={() => {
                                            setSelectedBill(s);
                                            setIsEditMode(true);
                                            openModal();
                                        }}
                                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                                    >
                                        <svg
                                            className="fill-current"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                                fill=""
                                            />
                                        </svg>
                                        Pay
                                    </button>

                                </TableCell>
                                    )}
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

    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Pay Balance
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                    Update payment details for this bill.
                </p>
            </div>
            <form className="flex flex-col">
                <div className="px-2 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                        <div>
                            <Label>Pay Amount</Label>
                            <Input
                                type="number"
                                value={payAmount}
                                onChange={(e) => setPayAmount(e.target.value)}
                            />
                        </div>


                        <div>
                            <Label>Payment Mode</Label>

                            <select
                                value={selectedBill.billPaymentMode || ""}
                                onChange={(e) =>
                                    setSelectedBill({
                                        ...selectedBill,
                                        billPaymentMode: e.target.value
                                    })
                                }
                                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2"
                            >
                                <option value="">Select Role</option>

                                {paymentMethod.map((pay) => (
                                    <option key={pay} value={pay}>
                                        {pay}
                                    </option>
                                ))}
                            </select>
                        </div>
                     </div>
                </div>

                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={closeModal}
                    >
                        Close
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleSave}
                    >
                        {isEditMode ? "Save Changes" : "Add User"}
                    </Button>
                </div>
            </form>
        </div>
    </Modal>
</>
    );
}


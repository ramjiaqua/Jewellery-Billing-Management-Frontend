import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../common/axiosConfig.tsx";
import { Modal } from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import { useModal } from "../../hooks/useModal.ts";
import PrintSalesBill from "./PrintSalesBill";
import { useReactToPrint } from "react-to-print";

// =========================================================
// TYPES
// =========================================================

type BillItem = {
    id?: number;
    itemName: string;
    hsnCode: string;
    quantity: number;
    rate: number;
    sgst: number;
    cgst: number;
    totalAmount: number;
};

type SalesBill = {
    id: number;
    billNumber: string;
    billDate: string;
    billName: string;
    billPhone: string;
    billAddress: string;
    billTotalAmount: number;
    billPaidAmount: number;
    billBalance: number;
    billBalanceDue: string;
    billPaymentMode: string;
    billBilledBy?: string;
    items: BillItem[];
    idType?: string;
    idNumber?: string;
};

type BillResponse = {
    content: SalesBill[];
    totalPages: number;
    totalElements?: number;
    number?: number;
    size?: number;
};

type PaymentMode = "Cash" | "Card" | "UPI";

const PAYMENT_METHODS: PaymentMode[] = [
    "Cash",
    "Card",
    "UPI",
];

// =========================================================
// HELPERS
// =========================================================

const formatAmount = (amount: number | string | null | undefined) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const parseDate = (dateStr?: string) => {
    if (!dateStr) {
        return new Date(0);
    }

    const parts = dateStr.split("-");

    if (parts.length !== 3) {
        return new Date(0);
    }

    const [day, month, year] = parts.map(Number);

    if (
        !day ||
        !month ||
        !year ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
    ) {
        return new Date(0);
    }

    return new Date(year, month - 1, day);
};

const getTodayWithoutTime = () => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today;
};

const isBillOverdue = (
    balance: number,
    dueDate?: string
) => {
    if (balance <= 0 || !dueDate) {
        return false;
    }

    const parsedDueDate = parseDate(dueDate);

    if (parsedDueDate.getTime() === 0) {
        return false;
    }

    parsedDueDate.setHours(0, 0, 0, 0);

    return parsedDueDate < getTodayWithoutTime();
};

// =========================================================
// COMPONENT
// =========================================================

export default function ViewSalesBillTable() {

    // =========================================================
    // STATE
    // =========================================================

    const [salesBills, setSalesBills] = useState<SalesBill[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const [billNumberFilter, setBillNumberFilter] =
        useState("");

    const [phoneFilter, setPhoneFilter] =
        useState("");

    const [pendingOnly, setPendingOnly] =
        useState(false);

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    const [selectedBill, setSelectedBill] =
        useState<SalesBill | null>(null);

    const [payAmount, setPayAmount] =
        useState("");

    const [paymentMode, setPaymentMode] =
        useState<PaymentMode | "">("");

    const [isSavingPayment, setIsSavingPayment] =
        useState(false);

    // =========================================================
    // MODALS
    // =========================================================

    const {
        isOpen: isPayModalOpen,
        openModal: openPayModal,
        closeModal: closePayModal,
    } = useModal();

    const {
        isOpen: isViewModalOpen,
        openModal: openViewModal,
        closeModal: closeViewModal,
    } = useModal();

    // =========================================================
    // PRINT
    // =========================================================

    const printRef = useRef<HTMLDivElement>(null);

    const handleRePrint = useReactToPrint({
        contentRef: printRef,
    });

    // =========================================================
    // FETCH BILLS
    // =========================================================

    const fetchViewBills = useCallback(async () => {
        try {
            setLoading(true);

            const response = await api.get<BillResponse>(
                "/api/bills",
                {
                    params: {
                        page,
                        size,
                        billNumber: billNumberFilter,
                        phone: phoneFilter,
                        pendingOnly,
                        fromDate,
                        toDate,
                    },
                }
            );

            setSalesBills(
                response.data?.content || []
            );

            setTotalPages(
                response.data?.totalPages || 0
            );

        } catch (error) {

            console.error(
                "Error fetching Bills:",
                error
            );

            setSalesBills([]);
            setTotalPages(0);

        } finally {

            setLoading(false);
        }
    }, [
        page,
        size,
        billNumberFilter,
        phoneFilter,
        pendingOnly,
        fromDate,
        toDate,
    ]);

    useEffect(() => {
        void fetchViewBills();
    }, [fetchViewBills]);

    // =========================================================
    // FILTER HANDLERS
    // =========================================================

    const handleBillNumberChange = (
        value: string
    ) => {
        setPage(0);
        setBillNumberFilter(value);
    };

    const handlePhoneChange = (
        value: string
    ) => {
        setPage(0);
        setPhoneFilter(value);
    };

    const handlePendingChange = (
        checked: boolean
    ) => {
        setPage(0);
        setPendingOnly(checked);
    };

    const handleFromDateChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setPage(0);

        const value = e.target.value;

        if (!value) {
            setFromDate("");
            return;
        }

        const [
            year,
            month,
            day,
        ] = value.split("-");

        setFromDate(
            `${day}-${month}-${year}`
        );
    };

    const handleToDateChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setPage(0);

        const value = e.target.value;

        if (!value) {
            setToDate("");
            return;
        }

        const [
            year,
            month,
            day,
        ] = value.split("-");

        setToDate(
            `${day}-${month}-${year}`
        );
    };

    // =========================================================
    // OPEN PAYMENT MODAL
    // =========================================================

    const handleOpenPayModal = (
        bill: SalesBill
    ) => {

        setSelectedBill(bill);

        setPayAmount("");

        setPaymentMode(
            (bill.billPaymentMode as PaymentMode) || ""
        );

        openPayModal();
    };

    // =========================================================
    // CLOSE PAYMENT MODAL
    // =========================================================

    const handleClosePayModal = () => {

        if (isSavingPayment) {
            return;
        }

        setPayAmount("");
        setPaymentMode("");
        closePayModal();
    };

    // =========================================================
    // OPEN VIEW MODAL
    // =========================================================

    const handleOpenViewModal = (
        bill: SalesBill
    ) => {

        setSelectedBill(bill);

        openViewModal();
    };

    // =========================================================
    // CLOSE VIEW MODAL
    // =========================================================

    const handleCloseViewModal = () => {
        closeViewModal();
    };

    // =========================================================
    // SAVE PAYMENT
    // =========================================================

    const handleSavePayment = async () => {

        if (!selectedBill) {
            return;
        }

        const amount = Number(payAmount);

        const balance = Number(
            selectedBill.billBalance || 0
        );

        // -----------------------------------------------------
        // Validate Amount
        // -----------------------------------------------------

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            alert(
                "Please enter a valid payment amount."
            );
            return;
        }

        // -----------------------------------------------------
        // Validate Balance
        // -----------------------------------------------------

        if (amount > balance) {

            alert(
                `Payment amount cannot exceed the pending balance of ₹${formatAmount(
                    balance
                )}.`
            );

            return;
        }

        // -----------------------------------------------------
        // Validate Payment Mode
        // -----------------------------------------------------

        if (!paymentMode) {

            alert(
                "Please select a payment mode."
            );

            return;
        }

        try {

            setIsSavingPayment(true);

            await api.post(
                `/api/balance/pay-balance/${selectedBill.id}`,
                {
                    payAmount: amount,
                    paymentMode,
                }
            );

            setPayAmount("");
            setPaymentMode("");

            closePayModal();

            await fetchViewBills();

        } catch (error) {

            console.error(
                "Error updating payment:",
                error
            );

            alert(
                "Unable to update the payment. Please try again."
            );

        } finally {

            setIsSavingPayment(false);
        }
    };

    // =========================================================
    // RE-PRINT
    // =========================================================

    const handlePrintBill = () => {

        closeViewModal();

        window.setTimeout(() => {
            handleRePrint();
        }, 300);
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50">

                <div className="flex min-h-[300px] items-center justify-center">

                    <div
                        className="
                        h-10
                        w-10
                        animate-spin
                        rounded-full
                        border-4
                        border-slate-200
                        border-t-blue-600
                        "
                    />

                </div>

            </div>
        );
    }

    // =========================================================
    // MAIN UI
    // =========================================================

    return (
        <>
                <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-full space-y-6">

                    {/* =================================================
                        PAGE HEADER
                    ================================================== */}

                    <div
                        className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-6
                        py-5
                        shadow-sm
                        "
                    >

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-start gap-4">

                                {/* Icon */}

                                <div
                                    className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-50
                                    text-blue-600
                                    "
                                >

                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >

                                        <path
                                            d="M7 3H17C18.1046 3 19 3.89543 19 5V21L12 18L5 21V5C5 3.89543 5.89543 3 7 3Z"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        <path
                                            d="M8.5 7H15.5"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                        <path
                                            d="M8.5 11H15.5"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                    </svg>

                                </div>

                                <div>

                                    <h1 className="text-2xl font-semibold text-slate-800">
                                        Sales Bills
                                    </h1>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        Search, view, print and manage customer bills
                                    </p>

                                </div>

                            </div>

                            <div
                                className="
                                hidden
                                rounded-lg
                                border
                                border-slate-200
                                bg-slate-50
                                px-4
                                py-2
                                text-right
                                sm:block
                                "
                            >

                                <p className="text-xs text-slate-500">
                                    Billing System
                                </p>

                                <p className="text-sm font-semibold text-slate-700">
                                    Sales Management
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        SEARCH & FILTERS
                    ================================================== */}

                    <div
                        className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                        "
                    >

                        <div className="border-b border-slate-200 px-6 py-4">

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-slate-100
                                    text-slate-600
                                    "
                                >

                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >

                                        <circle
                                            cx="11"
                                            cy="11"
                                            r="6"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        />

                                        <path
                                            d="M16 16L21 21"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                    </svg>

                                </div>

                                <div>

                                    <h2 className="text-base font-semibold text-slate-800">
                                        Search & Filters
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Filter bills using the available criteria
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="p-6">

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

                                {/* Bill Number */}

                                <div>

                                    <Label>
                                        Bill Number
                                    </Label>

                                    <input
                                        type="text"
                                        placeholder="Search Bill Number"
                                        value={billNumberFilter}
                                        onChange={(e) =>
                                            handleBillNumberChange(
                                                e.target.value
                                            )
                                        }
                                        className="
                                        mt-1.5
                                        h-11
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-3.5
                                        text-sm
                                        text-slate-800
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        "
                                    />

                                </div>

                                {/* Phone */}

                                <div>

                                    <Label>
                                        Phone Number
                                    </Label>

                                    <input
                                        type="text"
                                        placeholder="Search Phone Number"
                                        value={phoneFilter}
                                        onChange={(e) =>
                                            handlePhoneChange(
                                                e.target.value
                                            )
                                        }
                                        className="
                                        mt-1.5
                                        h-11
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-3.5
                                        text-sm
                                        text-slate-800
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        "
                                    />

                                </div>

                                {/* From Date */}

                                <div>

                                    <Label>
                                        From Date
                                    </Label>

                                    <input
                                        type="date"
                                        value={
                                            fromDate
                                                ? fromDate
                                                    .split("-")
                                                    .reverse()
                                                    .join("-")
                                                : ""
                                        }
                                        onChange={
                                            handleFromDateChange
                                        }
                                        className="
                                        mt-1.5
                                        h-11
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-3.5
                                        text-sm
                                        text-slate-800
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        "
                                    />

                                </div>

                                {/* To Date */}

                                <div>

                                    <Label>
                                        To Date
                                    </Label>

                                    <input
                                        type="date"
                                        value={
                                            toDate
                                                ? toDate
                                                    .split("-")
                                                    .reverse()
                                                    .join("-")
                                                : ""
                                        }
                                        onChange={
                                            handleToDateChange
                                        }
                                        className="
                                        mt-1.5
                                        h-11
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-3.5
                                        text-sm
                                        text-slate-800
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        "
                                    />

                                </div>

                            </div>

                            {/* Pending Only */}

                            <div className="mt-5">

                                <label
                                    className="
                                    inline-flex
                                    cursor-pointer
                                    items-center
                                    gap-3
                                    rounded-lg
                                    border
                                    border-amber-200
                                    bg-amber-50
                                    px-4
                                    py-3
                                    "
                                >

                                    <input
                                        type="checkbox"
                                        checked={pendingOnly}
                                        onChange={(e) =>
                                            handlePendingChange(
                                                e.target.checked
                                            )
                                        }
                                        className="
                                        h-4
                                        w-4
                                        rounded
                                        border-slate-300
                                        text-blue-600
                                        focus:ring-blue-500
                                        "
                                    />

                                    <div>

                                        <p className="text-sm font-medium text-slate-700">
                                            Pending Balance Only
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Show only bills with outstanding balance
                                        </p>

                                    </div>

                                </label>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        SALES BILL TABLE
                    ================================================== */}

                    <div
                        className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                        "
                    >

                        {/* Table Header */}

                        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <h2 className="text-base font-semibold text-slate-800">
                                        Sales Bills
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Customer billing history and payment status
                                    </p>

                                </div>

                                <div
                                    className="
                                    rounded-lg
                                    bg-slate-100
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    "
                                >
                                    {salesBills.length} Bills
                                </div>

                            </div>

                        </div>

                        {/* Table */}

                        <div className="max-w-full overflow-x-auto">

                            <Table>

                                <TableHeader className="bg-slate-50">

                                    <TableRow>

                                        {[
                                            "Bill Number",
                                            "Date",
                                            "Name",
                                            "Phone Number",
                                            "Particulars",
                                            "HSN Code",
                                            "Quantity",
                                            "Rate (₹)",
                                            "SGST (₹)",
                                            "CGST (₹)",
                                            "Total Amount (₹)",
                                            "Grand Total (₹)",
                                            "Paid Amount (₹)",
                                            "Balance (₹)",
                                            "Due Date",
                                            "Payment Mode",
                                            "Billed By",
                                            "Action",
                                        ].map((heading) => (

                                            <TableCell
                                                key={heading}
                                                isHeader
                                                className="
                                                whitespace-nowrap
                                                border-b
                                                border-slate-200
                                                px-4
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-slate-500
                                                "
                                            >
                                                {heading}
                                            </TableCell>

                                        ))}

                                    </TableRow>

                                </TableHeader>

                                <TableBody className="divide-y divide-slate-100">

                                    {salesBills.length === 0 ? (

                                        <TableRow>

                                            <TableCell
                                               /* colSpan={18}*/
                                                className="px-6 py-16 text-center"
                                            >

                                                <div className="flex flex-col items-center">

                                                    <div
                                                        className="
                                                        flex
                                                        h-12
                                                        w-12
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-slate-100
                                                        text-slate-400
                                                        "
                                                    >

                                                        <svg
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >

                                                            <path
                                                                d="M7 3H17C18.1046 3 19 3.89543 19 5V21L12 18L5 21V5C5 3.89543 5.89543 3 7 3Z"
                                                                stroke="currentColor"
                                                                strokeWidth="1.8"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />

                                                        </svg>

                                                    </div>

                                                    <p className="mt-4 text-sm font-medium text-slate-700">
                                                        No bills found
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Try changing your search or filter criteria.
                                                    </p>

                                                </div>

                                            </TableCell>

                                        </TableRow>

                                    ) : (

                                        salesBills.map((bill) => {

                                            const balance = Number(
                                                bill.billBalance || 0
                                            );

                                            const overdue =
                                                isBillOverdue(
                                                    balance,
                                                    bill.billBalanceDue
                                                );

                                            return (

                                                <TableRow
                                                    key={bill.id}
                                                    className="
                                                    cursor-pointer
                                                    transition-colors
                                                    hover:bg-slate-50
                                                    "
                                                    onClick={() =>
                                                        handleOpenViewModal(
                                                            bill
                                                        )
                                                    }
                                                >

                                                    {/* Bill Number */}

                                                    <TableCell className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">
                                                        {bill.billNumber || "-"}
                                                    </TableCell>

                                                    {/* Date */}

                                                    <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                                                        {bill.billDate || "-"}
                                                    </TableCell>

                                                    {/* Name */}

                                                    <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                                                        {bill.billName || "-"}
                                                    </TableCell>

                                                    {/* Phone */}

                                                    <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                                                        {bill.billPhone || "-"}
                                                    </TableCell>

                                                    {/* Particulars */}

                                                    <TableCell className="px-4 py-3 text-sm text-slate-600">

                                                        <div className="space-y-1">

                                                            {bill.items?.length ? (

                                                                bill.items.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (

                                                                        <div
                                                                            key={
                                                                                item.id ??
                                                                                index
                                                                            }
                                                                            className="whitespace-nowrap"
                                                                        >
                                                                            {item.itemName ||
                                                                                "-"}
                                                                        </div>

                                                                    )
                                                                )

                                                            ) : (

                                                                <span className="text-slate-400">
                                                                    -
                                                                </span>

                                                            )}

                                                        </div>

                                                    </TableCell>

                                                    {/* HSN */}

                                                    <TableCell className="px-4 py-3 text-sm text-slate-500">

                                                        <div className="space-y-1">

                                                            {bill.items?.length ? (

                                                                bill.items.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (

                                                                        <div
                                                                            key={
                                                                                item.id ??
                                                                                index
                                                                            }
                                                                            className="whitespace-nowrap"
                                                                        >
                                                                            {item.hsnCode ||
                                                                                "-"}
                                                                        </div>

                                                                    )
                                                                )

                                                            ) : (

                                                                <span className="text-slate-400">
                                                                    -
                                                                </span>

                                                            )}

                                                        </div>

                                                    </TableCell>

                                                    {/* Quantity */}

                                                    <TableCell className="px-4 py-3 text-right text-sm text-slate-600">

                                                        <div className="space-y-1">

                                                            {bill.items?.length ? (

                                                                bill.items.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (

                                                                        <div
                                                                            key={
                                                                                item.id ??
                                                                                index
                                                                            }
                                                                        >
                                                                            {item.quantity ?? 0}
                                                                        </div>

                                                                    )
                                                                )

                                                            ) : (

                                                                <span className="text-slate-400">
                                                                    -
                                                                </span>

                                                            )}

                                                        </div>

                                                    </TableCell>

                                                    {/* Rate */}

                                                    <TableCell className="px-4 py-3 text-right text-sm text-slate-600">

                                                        <div className="space-y-1">

                                                            {bill.items?.length ? (

                                                                bill.items.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (

                                                                        <div
                                                                            key={
                                                                                item.id ??
                                                                                index
                                                                            }
                                                                            className="whitespace-nowrap"
                                                                        >
                                                                            ₹{" "}
                                                                            {formatAmount(
                                                                                item.rate
                                                                            )}
                                                                        </div>

                                                                    )
                                                                )

                                                            ) : (

                                                                <span className="text-slate-400">
                                                                    -
                                                                </span>

                                                            )}

                                                        </div>

                                                    </TableCell>

                                                    {/* SGST */}

                                                    <TableCell className="px-4 py-3 text-right text-sm text-slate-600">

                                                        <div className="space-y-1">

                                                            {bill.items?.length ? (

                                                                bill.items.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (

                                                                        <div
                                                                            key={
                                                                                item.id ??
                                                                                index
                                                                            }
                                                                            className="whitespace-nowrap"
                                                                        >
                                                                            ₹{" "}
                                                                            {formatAmount(
                                                                                item.sgst
                                                                            )}
                                                                        </div>

                                                                    )
                                                                )

                                                            ) : (

                                                                <span className="text-slate-400">
                                                                    -
                                                                </span>

                                                            )}

                                                        </div>

                                                    </TableCell>

                                                    {/* CGST */}

                                                    <TableCell className="px-4 py-3 text-right text-sm text-slate-600">

                                                        <div className="space-y-1">

                                                            {bill.items?.length ? (

                                                                bill.items.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (

                                                                        <div
                                                                            key={
                                                                                item.id ??
                                                                                index
                                                                            }
                                                                            className="whitespace-nowrap"
                                                                        >
                                                                            ₹{" "}
                                                                            {formatAmount(
                                                                                item.cgst
                                                                            )}
                                                                        </div>

                                                                    )
                                                                )

                                                            ) : (

                                                                <span className="text-slate-400">
                                                                    -
                                                                </span>

                                                            )}

                                                        </div>

                                                    </TableCell>

                                                    {/* Item Total */}

                                                    <TableCell className="px-4 py-3 text-right text-sm font-medium text-slate-800">

                                                        <div className="space-y-1">

                                                            {bill.items?.length ? (

                                                                bill.items.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (

                                                                        <div
                                                                            key={
                                                                                item.id ??
                                                                                index
                                                                            }
                                                                            className="whitespace-nowrap"
                                                                        >
                                                                            ₹{" "}
                                                                            {formatAmount(
                                                                                item.totalAmount
                                                                            )}
                                                                        </div>

                                                                    )
                                                                )

                                                            ) : (

                                                                <span className="text-slate-400">
                                                                    -
                                                                </span>

                                                            )}

                                                        </div>

                                                    </TableCell>

                                                    {/* Grand Total */}

                                                    <TableCell className="px-4 py-3 text-right text-sm font-semibold text-slate-900">

                                                        <span className="whitespace-nowrap">
                                                            ₹{" "}
                                                            {formatAmount(
                                                                bill.billTotalAmount
                                                            )}
                                                        </span>

                                                    </TableCell>

                                                    {/* Paid Amount */}

                                                    <TableCell className="px-4 py-3 text-right text-sm font-medium text-emerald-600">

                                                        <span className="whitespace-nowrap">
                                                            ₹{" "}
                                                            {formatAmount(
                                                                bill.billPaidAmount
                                                            )}
                                                        </span>

                                                    </TableCell>

                                                    {/* Balance */}

                                                    <TableCell className="px-4 py-3">

                                                        {balance <= 0 ? (

                                                            <Badge
                                                                size="sm"
                                                                color="success"
                                                            >
                                                                Paid
                                                            </Badge>

                                                        ) : overdue ? (

                                                            <Badge
                                                                size="sm"
                                                                color="error"
                                                            >
                                                                ₹{" "}
                                                                {formatAmount(
                                                                    balance
                                                                )}
                                                            </Badge>

                                                        ) : (

                                                            <Badge
                                                                size="sm"
                                                                color="warning"
                                                            >
                                                                ₹{" "}
                                                                {formatAmount(
                                                                    balance
                                                                )}
                                                            </Badge>

                                                        )}

                                                    </TableCell>

                                                    {/* Due Date */}

                                                    <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                                                        {bill.billBalanceDue ||
                                                            "-"}
                                                    </TableCell>

                                                    {/* Payment Mode */}

                                                    <TableCell className="px-4 py-3">

                                                        <span
                                                            className="
                                                            inline-flex
                                                            rounded-md
                                                            bg-slate-100
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            text-slate-600
                                                            "
                                                        >
                                                            {bill.billPaymentMode ||
                                                                "-"}
                                                        </span>

                                                    </TableCell>

                                                    {/* Billed By */}

                                                    <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                                                        {bill.billBilledBy ||
                                                            "-"}
                                                    </TableCell>

                                                    {/* Action */}

                                                    <TableCell className="px-4 py-3">

                                                        {balance > 0 ? (

                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenPayModal(
                                                                        bill
                                                                    );
                                                                }}
                                                                className="
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                whitespace-nowrap
                                                                rounded-lg
                                                                bg-blue-600
                                                                px-3.5
                                                                py-2
                                                                text-xs
                                                                font-medium
                                                                text-white
                                                                shadow-sm
                                                                transition-colors
                                                                hover:bg-blue-700
                                                                focus:outline-none
                                                                focus:ring-2
                                                                focus:ring-blue-500
                                                                focus:ring-offset-2
                                                                "
                                                            >

                                                                <svg
                                                                    width="15"
                                                                    height="15"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >

                                                                    <path
                                                                        d="M12 5V19"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                    />

                                                                    <path
                                                                        d="M5 12H19"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                    />

                                                                </svg>

                                                                Pay

                                                            </button>

                                                        ) : (

                                                            <span className="text-xs text-slate-400">
                                                                Completed
                                                            </span>

                                                        )}

                                                    </TableCell>

                                                </TableRow>

                                            );
                                        })

                                    )}

                                </TableBody>

                            </Table>

                        </div>

                    </div>

                    {/* =================================================
                        PAGINATION
                    ================================================== */}

                    <div
                        className="
                        flex
                        flex-col
                        gap-3
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        shadow-sm
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        "
                    >

                        <p className="text-sm text-slate-500">

                            Page{" "}

                            <span className="font-medium text-slate-700">
                                {totalPages === 0
                                    ? 0
                                    : page + 1}
                            </span>{" "}

                            of{" "}

                            <span className="font-medium text-slate-700">
                                {totalPages}
                            </span>

                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={page === 0}
                                onClick={() =>
                                    setPage(
                                        (currentPage) =>
                                            Math.max(
                                                0,
                                                currentPage - 1
                                            )
                                    )
                                }
                                className="
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-slate-600
                                transition-colors
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                "
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                disabled={
                                    totalPages === 0 ||
                                    page + 1 >= totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        (currentPage) =>
                                            currentPage + 1
                                    )
                                }
                                className="
                                rounded-lg
                                bg-blue-600
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition-colors
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                "
                            >
                                Next
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* =========================================================
                PAY BALANCE MODAL
            ========================================================== */}

            <Modal
                isOpen={isPayModalOpen}
                onClose={handleClosePayModal}
                className="m-4 max-w-[600px]"
            >

                <div className="rounded-xl border border-slate-200 bg-white shadow-xl">

                    {/* Header */}

                    <div className="border-b border-slate-200 px-6 py-5">

                        <div className="flex items-start gap-3">

                            <div
                                className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-50
                                text-blue-600
                                "
                            >

                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >

                                    <path
                                        d="M12 2V22"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M17 5H9.5C8.11929 5 7 6.11929 7 7.5C7 8.88071 8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5C17 13.8807 15.8807 15 14.5 15H7"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                </svg>

                            </div>

                            <div>

                                <h2 className="text-lg font-semibold text-slate-800">
                                    Pay Balance
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update customer payment details
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Body */}

                    <div className="p-6">

                        {selectedBill && (

                            <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">

                                <div className="grid grid-cols-2 gap-4">

                                    <div>

                                        <p className="text-xs text-slate-500">
                                            Bill Number
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {selectedBill.billNumber ||
                                                "-"}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs text-slate-500">
                                            Customer
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {selectedBill.billName ||
                                                "-"}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs text-slate-500">
                                            Total Amount
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            ₹{" "}
                                            {formatAmount(
                                                selectedBill.billTotalAmount
                                            )}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs text-slate-500">
                                            Pending Balance
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-amber-600">
                                            ₹{" "}
                                            {formatAmount(
                                                selectedBill.billBalance
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            {/* Amount */}

                            <div>

                                <Label>
                                    Pay Amount
                                </Label>

                                <Input
                                    className="
                                    mt-1.5
                                    rounded-lg
                                    border-slate-300
                                    bg-white
                                    focus:border-blue-500
                                    focus:ring-blue-100
                                    "
                                    type="number"
                                    min="0"
                                  /*  step="0.01"*/
                                    value={payAmount}
                                    onChange={(e) =>
                                        setPayAmount(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter amount"
                                />

                            </div>

                            {/* Payment Mode */}

                            <div>

                                <Label>
                                    Payment Mode
                                </Label>

                                <select
                                    value={paymentMode}
                                    onChange={(e) =>
                                        setPaymentMode(
                                            e.target.value as PaymentMode
                                        )
                                    }
                                    className="
                                    mt-1.5
                                    h-11
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3.5
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                    "
                                >

                                    <option value="">
                                        Select Payment Mode
                                    </option>

                                    {PAYMENT_METHODS.map(
                                        (method) => (

                                            <option
                                                key={method}
                                                value={method}
                                            >
                                                {method}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                        {/* Actions */}

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-5">

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={isSavingPayment}
                                className="
                                border-slate-300
                                text-slate-600
                                hover:bg-slate-50
                                "
                                onClick={
                                    handleClosePayModal
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                disabled={isSavingPayment}
                                className="
                                bg-blue-600
                                text-white
                                shadow-sm
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:bg-slate-300
                                "
                                onClick={
                                    handleSavePayment
                                }
                            >
                                {isSavingPayment
                                    ? "Saving..."
                                    : "Save Payment"}
                            </Button>

                        </div>

                    </div>

                </div>

            </Modal>

            {/* =========================================================
                VIEW BILL MODAL
            ========================================================== */}

            <Modal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                className="m-4 max-w-[900px]"
            >

                <div
                    className="
                    max-h-[90vh]
                    overflow-y-auto
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-xl
                    "
                >

                    {/* Header */}

                    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5">

                        <div className="flex items-start gap-3">

                            <div
                                className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-50
                                text-blue-600
                                "
                            >

                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >

                                    <path
                                        d="M6 3H18C19.1046 3 20 3.89543 20 5V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <path
                                        d="M8 7H16"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M8 11H16"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M8 15H13"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                </svg>

                            </div>

                            <div>

                                <h2 className="text-lg font-semibold text-slate-800">
                                    Customer Bill
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    View complete bill details
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Content */}

                    {selectedBill && (

                        <div className="p-6">

                            {/* =================================================
                                CUSTOMER DETAILS
                            ================================================== */}

                            <div className="mb-6">

                                <div className="mb-4">

                                    <h3 className="text-sm font-semibold text-slate-800">
                                        Customer Details
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Customer and billing information
                                    </p>

                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                    <div className="rounded-lg border border-slate-200 bg-white p-4">

                                        <Label>
                                            Bill Number
                                        </Label>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {selectedBill.billNumber ||
                                                "-"}
                                        </p>

                                    </div>

                                    <div className="rounded-lg border border-slate-200 bg-white p-4">

                                        <Label>
                                            Date
                                        </Label>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {selectedBill.billDate ||
                                                "-"}
                                        </p>

                                    </div>

                                    <div className="rounded-lg border border-slate-200 bg-white p-4">

                                        <Label>
                                            Name
                                        </Label>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {selectedBill.billName ||
                                                "-"}
                                        </p>

                                    </div>

                                    <div className="rounded-lg border border-slate-200 bg-white p-4">

                                        <Label>
                                            Phone Number
                                        </Label>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {selectedBill.billPhone ||
                                                "-"}
                                        </p>

                                    </div>

                                    <div className="rounded-lg border border-slate-200 bg-white p-4 sm:col-span-2">

                                        <Label>
                                            Address
                                        </Label>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {selectedBill.billAddress ||
                                                "-"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* =================================================
                                BILL ITEMS
                            ================================================== */}

                            <div className="mb-6">

                                <div className="mb-4">

                                    <h3 className="text-sm font-semibold text-slate-800">
                                        Bill Items
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Products and applicable taxes
                                    </p>

                                </div>

                                <div className="overflow-x-auto rounded-lg border border-slate-200">

                                    <Table>

                                        <TableHeader className="bg-slate-50">

                                            <TableRow>

                                                {[
                                                    "Particulars",
                                                    "HSN",
                                                    "Qty",
                                                    "Rate",
                                                    "SGST",
                                                    "CGST",
                                                    "Total",
                                                ].map(
                                                    (
                                                        heading,
                                                        index
                                                    ) => (

                                                        <TableCell
                                                            key={heading}
                                                            isHeader
                                                            className={`
                                                            whitespace-nowrap
                                                            border-b
                                                            border-slate-200
                                                            px-4
                                                            py-3
                                                            text-xs
                                                            font-semibold
                                                            uppercase
                                                            tracking-wider
                                                            text-slate-500
                                                            ${
                                                                index ===
                                                                0 ||
                                                                index ===
                                                                1
                                                                    ? "text-left"
                                                                    : "text-right"
                                                            }
                                                            `}
                                                        >
                                                            {heading}
                                                        </TableCell>

                                                    )
                                                )}

                                            </TableRow>

                                        </TableHeader>

                                        <TableBody className="divide-y divide-slate-100">

                                            {selectedBill.items?.length ? (

                                                selectedBill.items.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <TableRow
                                                            key={
                                                                item.id ??
                                                                index
                                                            }
                                                            className="transition-colors hover:bg-slate-50"
                                                        >

                                                            <TableCell className="px-4 py-3 text-sm font-medium text-slate-800">
                                                                {item.itemName ||
                                                                    "-"}
                                                            </TableCell>

                                                            <TableCell className="px-4 py-3 text-sm text-slate-500">
                                                                {item.hsnCode ||
                                                                    "-"}
                                                            </TableCell>

                                                            <TableCell className="px-4 py-3 text-right text-sm text-slate-600">
                                                                {item.quantity ??
                                                                    0}
                                                            </TableCell>

                                                            <TableCell className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                                                                ₹{" "}
                                                                {formatAmount(
                                                                    item.rate
                                                                )}
                                                            </TableCell>

                                                            <TableCell className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                                                                ₹{" "}
                                                                {formatAmount(
                                                                    item.sgst
                                                                )}
                                                            </TableCell>

                                                            <TableCell className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                                                                ₹{" "}
                                                                {formatAmount(
                                                                    item.cgst
                                                                )}
                                                            </TableCell>

                                                            <TableCell className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-slate-900">
                                                                ₹{" "}
                                                                {formatAmount(
                                                                    item.totalAmount
                                                                )}
                                                            </TableCell>

                                                        </TableRow>

                                                    )
                                                )

                                            ) : (

                                                <TableRow>

                                                    <TableCell
                                                     /*   colSpan={7}*/
                                                        className="px-4 py-8 text-center text-sm text-slate-400"
                                                    >
                                                        No items available
                                                    </TableCell>

                                                </TableRow>

                                            )}

                                        </TableBody>

                                    </Table>

                                </div>

                            </div>

                            {/* =================================================
                                TOTAL SUMMARY
                            ================================================== */}

                            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5">

                                <div className="ml-auto max-w-md space-y-3">

                                    <div className="flex items-center justify-between text-sm">

                                        <span className="text-slate-500">
                                            Grand Total
                                        </span>

                                        <span className="font-semibold text-slate-900">
                                            ₹{" "}
                                            {formatAmount(
                                                selectedBill.billTotalAmount
                                            )}
                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between text-sm">

                                        <span className="text-slate-500">
                                            Paid Amount
                                        </span>

                                        <span className="font-semibold text-emerald-600">
                                            ₹{" "}
                                            {formatAmount(
                                                selectedBill.billPaidAmount
                                            )}
                                        </span>

                                    </div>

                                    <div className="border-t border-slate-200 pt-3">

                                        <div className="flex items-center justify-between">

                                            <span className="text-sm font-medium text-slate-700">
                                                Balance
                                            </span>

                                            <span
                                                className={`
                                                text-xl
                                                font-bold
                                                ${
                                                    Number(
                                                        selectedBill.billBalance ||
                                                        0
                                                    ) > 0
                                                        ? "text-amber-600"
                                                        : "text-emerald-600"
                                                }
                                                `}
                                            >
                                                ₹{" "}
                                                {formatAmount(
                                                    selectedBill.billBalance
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* =================================================
                                PAYMENT DETAILS
                            ================================================== */}

                            <div className="mb-6">

                                <div className="mb-4">

                                    <h3 className="text-sm font-semibold text-slate-800">
                                        Payment Details
                                    </h3>

                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                                    <div className="rounded-lg border border-slate-200 bg-white p-4">

                                        <Label>
                                            Due Date
                                        </Label>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {selectedBill.billBalanceDue ||
                                                "-"}
                                        </p>

                                    </div>

                                    <div className="rounded-lg border border-slate-200 bg-white p-4">

                                        <Label>
                                            Payment Mode
                                        </Label>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {selectedBill.billPaymentMode ||
                                                "-"}
                                        </p>

                                    </div>

                                    <div className="rounded-lg border border-slate-200 bg-white p-4">

                                        <Label>
                                            Billed By
                                        </Label>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {selectedBill.billBilledBy ||
                                                "-"}
                                        </p>

                                    </div>

                                    <div className="rounded-lg border border-slate-200 bg-white p-4">

                                        <Label>
                                            Customer ID
                                        </Label>

                                        <p className="mt-1 break-words text-sm font-medium text-slate-800">

                                            {selectedBill.idType
                                                ? `${selectedBill.idType}${
                                                    selectedBill.idNumber
                                                        ? ` - ${selectedBill.idNumber}`
                                                        : ""
                                                }`
                                                : "-"}

                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* =================================================
                                ACTIONS
                            ================================================== */}

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="
                                    border-slate-300
                                    text-slate-600
                                    hover:bg-slate-50
                                    "
                                    onClick={
                                        handleCloseViewModal
                                    }
                                >
                                    Close
                                </Button>

                                <Button
                                    type="button"
                                    size="sm"
                                    className="
                                    bg-blue-600
                                    text-white
                                    shadow-sm
                                    hover:bg-blue-700
                                    "
                                    onClick={
                                        handlePrintBill
                                    }
                                >
                                    Re-Print
                                </Button>

                            </div>

                        </div>

                    )}

                </div>

            </Modal>

            {/* =========================================================
                PRINT COMPONENT
            ========================================================== */}

            {selectedBill && (

                <div
                    style={{
                        display: "none",
                    }}
                >

                    <PrintSalesBill
                        ref={printRef}
                        bill={selectedBill}
                    />

                </div>

            )}

        </>
    );
}
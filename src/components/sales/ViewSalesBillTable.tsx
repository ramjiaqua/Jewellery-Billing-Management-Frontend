import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import {useEffect, useRef, useState} from "react";
import api from "../../common/axiosConfig.tsx";
import {Modal} from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import {useModal} from "../../hooks/useModal.ts";
import PrintSalesBill from './PrintSalesBill';
import {useReactToPrint} from "react-to-print";

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
    const {isOpen: isPayModalOpen, openModal: openPayModal, closeModal: closePayModal,} = useModal();
    const {isOpen: isViewModalOpen, openModal: openViewModal, closeModal: closeViewModal,} = useModal();
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedBill, setSelectedBill] = useState<any>({});
    const [payAmount, setPayAmount] = useState("");
    const printRef = useRef<HTMLDivElement>(null);
    const handleRePrint = useReactToPrint({
        contentRef: printRef
    });

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
            closePayModal();
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
{/*
                Loading bills...
*/}
                <div className="flex justify-center py-16">
                    <div className="animate-spin h-10 w-10 rounded-full border-4 border-yellow-500 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className="
rounded-3xl
border
border-yellow-300
bg-gradient-to-br
from-[#FFFDF7]
via-white
to-[#FFF8E8]
shadow-xl
overflow-hidden
"
            >
                <div
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-6 border-b border-yellow-200 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600">

                    <div>
                        <h2 className="text-3xl font-bold text-white">
                            📋 Sales Bills
                        </h2>

                        <p className="text-yellow-100 mt-1">
                            Search, View, Print & Manage Customer Bills
                        </p>
                    </div>

                </div>

                <div className="p-6 bg-white border-b border-yellow-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

                        {/* Bill Number */}
                        <div>
                            <Label>Bill Number</Label>
                            <input
                                type="text"
                                placeholder="Search Bill Number"
                                value={billNumberFilter}
                                onChange={(e) => {
                                    setPage(0);
                                    setBillNumberFilter(e.target.value);
                                }}
                                className="w-full rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <Label>Phone Number</Label>
                            <input
                                type="text"
                                placeholder="Search Phone Number"
                                value={phoneFilter}
                                onChange={(e) => {
                                    setPage(0);
                                    setPhoneFilter(e.target.value);
                                }}
                                className="w-full rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300"
                            />
                        </div>

                        {/* From Date */}
                        <div>
                            <Label>From Date</Label>
                            <input
                                type="date"
                                value={fromDate ? fromDate.split("-").reverse().join("-") : ""}
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
                                className="w-full rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300"
                            />
                        </div>

                        {/* To Date */}
                        <div>
                            <Label>To Date</Label>
                            <input
                                type="date"
                                value={toDate ? toDate.split("-").reverse().join("-") : ""}
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
                                className="w-full rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300"
                            />
                        </div>

                        {/* Pending Only */}
                        <div className="col-span-full mt-3">
                            <label className="flex items-center gap-3 font-medium text-yellow-700">
                                <input
                                    className="h-5 w-5 accent-yellow-500"
                                    type="checkbox"
                                    checked={pendingOnly}
                                    onChange={(e) => {
                                        setPage(0);
                                        setPendingOnly(e.target.checked);
                                    }}
                                />
                                Pending Balance Only
                            </label>
                        </div>

                    </div>
                </div>

{/*
                <div className="p-6 bg-white border-b border-yellow-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
                        <input
                            type="text"
                            placeholder="Search Bill Number"
                            value={billNumberFilter}
                            onChange={(e) => {
                                setPage(0);
                                setBillNumberFilter(e.target.value);
                            }}
                            className="rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-2 focus:border-yellow-500focus:ring-2 focus:ring-yellow-300"
                        />

                        <input
                            type="text"
                            placeholder="Search Phone Number"
                            value={phoneFilter}
                            onChange={(e) => {
                                setPage(0);
                                setPhoneFilter(e.target.value);
                            }}
                            className="rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300"
                        />


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="col-span-2">
                                <div className="grid grid-cols-2 gap-3">
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
                                        className="rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300"
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
                                        className="rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center h-11">
                            <label className="flex items-center gap-3 font-medium text-yellow-700">

                                <input className="h-5 w-5 accent-yellow-500"
                                       type="checkbox"
                                       checked={pendingOnly}
                                       onChange={(e) => {
                                           setPage(0);
                                           setPendingOnly(e.target.checked);
                                       }}
                                />
                                Pending Balance Only
                            </label>
                        </div>
                    </div>
                </div>
*/}





                <div className="max-w-full overflow-x-auto">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="bg-gradient-to-r from-yellow-500 to-amber-600">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Bill Number
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Date
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Name
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Phone Number
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Particulars
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    HSN Code
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Weight
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Wastage
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Rate
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Making Charge
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    SGST
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    CGST
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Total Amount
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Grand Total
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Paid Amount
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Balance
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Due Date
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Payment Mode
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-4 text-white font-semibold uppercase tracking-wider"
                                >
                                    Billed By
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {salesBills.map((s) => (
                                <TableRow
                                    key={s.id}
                                    className="
cursor-pointer
hover:bg-yellow-50
transition-all
duration-200
"
                                    onClick={() => {
                                        setSelectedBill(s);

                                        openViewModal();
                                    }}
                                >
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
                                        {s.billPhone}
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {s.items?.map((item: any, i: number) => (
                                            <div key={i}>
                                                {item.itemName}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {s.items?.map((item: any, i: number) => (
                                            <div key={i}>
                                                {item.hsnCode}
                                            </div>
                                        ))}

                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {s.items?.map((item: any, i: number) => (
                                            <div key={i}>
                                                {item.weight}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {s.items?.map((item: any, i: number) => (
                                            <div key={i}>
                                                ₹{item.wastage}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {s.items?.map((item: any, i: number) => (
                                            <div key={i}>
                                                ₹{item.rate}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {s.items?.map((item: any, i: number) => (
                                            <div key={i}>
                                                ₹{item.makingCharge}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {s.items?.map((item: any, i: number) => (
                                            <div key={i}>
                                                ₹{item.sgst}
                                            </div>
                                        ))}

                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {s.items?.map((item: any, i: number) => (
                                            <div key={i}>
                                                ₹{item.cgst}
                                            </div>
                                        ))}

                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {s.items?.map((item: any, i: number) => (
                                            <div key={i}>
                                                ₹{Number(item.totalAmount).toLocaleString("en-IN")}
                                            </div>
                                        ))}

                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                       <span className="text-green-700 font-semibold">
                                           ₹{Number(s.billTotalAmount).toLocaleString("en-IN")}
</span>
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        ₹{Number(s.billPaidAmount).toLocaleString("en-IN")}
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
                                           <span className="font-bold">
    ₹{s.billBalance}
</span>
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedBill(s);
                                                    setIsEditMode(true);
                                                    openPayModal();
                                                }}
                                                className="
inline-flex
items-center
gap-2
rounded-xl
bg-gradient-to-r
from-yellow-500
to-amber-600
px-4
py-2
text-white
font-semibold
shadow-md
hover:shadow-xl
hover:scale-105
transition-all
"
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
                        className="
rounded-xl
bg-gradient-to-r
from-yellow-500
to-amber-600
px-5
py-2
text-white
font-semibold
shadow-md
hover:shadow-lg
disabled:opacity-40
"
                    >
                        Previous
                    </button>

                    <span className="font-semibold text-yellow-700">
                    Page {page + 1} of {totalPages}
                </span>

                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage(page + 1)}
                        className="
rounded-xl
bg-gradient-to-r
from-yellow-500
to-amber-600
px-5
py-2
text-white
font-semibold
shadow-md
hover:shadow-lg
disabled:opacity-40
"
                    >
                        Next
                    </button>

                </div>
            </div>

            <Modal isOpen={isPayModalOpen} onClose={closePayModal} className="max-w-[700px] m-4">
                <div
                    className="
rounded-3xl
border
border-yellow-300
bg-gradient-to-br
from-white
via-yellow-50
to-yellow-100
shadow-2xl
p-8
">
                    <div className="px-2 pr-14">
                        <h2 className="text-3xl font-bold text-yellow-700">
                            💰 Pay Balance
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Update customer payment details.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                                <div>
                                    <Label>Pay Amount</Label>
                                    <Input className="
rounded-xl
border-yellow-300
bg-yellow-50
focus:border-yellow-500
focus:ring-yellow-300
"
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
                                        className="
h-11
w-full
rounded-xl
border
border-yellow-300
bg-yellow-50
px-4
focus:border-yellow-500
focus:ring-2
focus:ring-yellow-300
"
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
                            <Button className="
border-yellow-400
text-yellow-700
hover:bg-yellow-100
"
                                    size="sm"
                                    variant="outline"
                                    onClick={closePayModal}
                            >
                                Close
                            </Button>

                            <Button className="
bg-gradient-to-r
from-yellow-500
to-amber-600
text-white
shadow-lg
hover:shadow-xl
"
                                    size="sm"
                                    onClick={handleSave}
                            >
                                {isEditMode ? "Save Changes" : "Add User"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal isOpen={isViewModalOpen} onClose={closeViewModal} className="max-w-[700px] m-4">
                <div
                    className="
rounded-3xl
border
border-yellow-300
bg-gradient-to-br
from-white
via-yellow-50
to-yellow-100
shadow-2xl
p-8
">
                    <div className="px-2 pr-14">
                        <h2 className="text-3xl font-bold text-yellow-700">
                            🧾 Customer Bill
                        </h2>

                        <p className="text-gray-600 mt-2">
                            View complete bill details
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">

                                    <Label className="text-yellow-700 font-semibold">
                                        Bill Number
                                    </Label>

                                    <p className="mt-1 font-medium text-gray-700">
                                        {selectedBill.billNumber}
                                    </p>

                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Date</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.billDate}</p>
                                </div>
                                <div>
                                    <Label className="text-yellow-700 font-semibold">Name</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.billName}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Address</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.billAddress}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Phone Number</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.billPhone}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Particulars</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.items?.map((item: any, i: number) => (
                                        <div key={i}>
                                            {item.itemName}
                                        </div>
                                    ))}</p>

                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">HSN Code</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.items?.map((item: any, i: number) => (
                                        <div key={i}>
                                            {item.hsnCode}
                                        </div>
                                    ))}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Weight</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.items?.map((item: any, i: number) => (
                                        <div key={i}>
                                            {item.weight}
                                        </div>
                                    ))}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Wastage</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.items?.map((item: any, i: number) => (
                                        <div key={i}>
                                            ₹{item.wastage}
                                        </div>
                                    ))}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Rate</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.items?.map((item: any, i: number) => (
                                        <div key={i}>
                                            ₹{item.rate}
                                        </div>
                                    ))}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Making Charge</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.items?.map((item: any, i: number) => (
                                        <div key={i}>
                                            ₹{item.makingCharge}
                                        </div>
                                    ))}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">SGST</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.items?.map((item: any, i: number) => (
                                        <div key={i}>
                                            ₹{item.sgst}
                                        </div>
                                    ))}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">CGST</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.items?.map((item: any, i: number) => (
                                        <div key={i}>
                                            ₹{item.cgst}
                                        </div>
                                    ))}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Total Amount</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.items?.map((item: any, i: number) => (
                                        <div key={i}>
                                            ₹{item.totalAmount}
                                        </div>
                                    ))}</p>

                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Grand Total</Label>
                                    <p className="mt-1 font-medium text-gray-700">₹{selectedBill.billTotalAmount}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Paid Amount</Label>
                                    <p className="mt-1 font-medium text-gray-700">₹{selectedBill.billPaidAmount}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Balance</Label>
                                    <p className="mt-1 font-medium text-gray-700">₹{selectedBill.billBalance}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Due Date</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.billBalanceDue}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Payment Mode</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.billPaymentMode}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Customer ID</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.idType}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Customer ID Number</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.idNumber}</p>
                                </div>
                                <div className="rounded-xl bg-white border border-yellow-200 p-4 shadow-sm">
                                    <Label className="text-yellow-700 font-semibold">Billed By</Label>
                                    <p className="mt-1 font-medium text-gray-700">{selectedBill.billBilledBy}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button className="
bg-gradient-to-r
from-yellow-500
to-amber-600
text-white
shadow-lg
hover:shadow-xl
"
                                    size="sm"
                                    variant="outline"
                                    onClick={closeViewModal}
                            >
                                Close
                            </Button>
                            <Button className="
bg-gradient-to-r
from-yellow-500
to-amber-600
text-white
shadow-lg
hover:shadow-xl
"

                                    size="sm"
                                    onClick={() => {
                                        closeViewModal(); // optional
                                        setTimeout(() => {
                                            handleRePrint();
                                        }, 300); // allow render
                                    }}
                            >
                                Re-Print
                            </Button>

                        </div>
                    </form>
                </div>
            </Modal>
            {selectedBill && (
                <div style={{display: "none"}}>
                    <PrintSalesBill ref={printRef} bill={selectedBill}/>
                </div>
            )}
        </>
    );
}


import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { SHOP_NAME } from "../../common/constants";
import { useRef, useState, useEffect } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import api from "../../common/axiosConfig";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import PrintSalesBill from "../../components/sales/PrintSalesBill";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

type BillItem = {
    itemName: string;
    hsnCode: string;
    quantity: number;
    rate: number;
    sgst: number;
    cgst: number;
    totalAmount: number;
};

type Bill = {
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
    items: BillItem[];
    idType: string;
    idNumber: string;
};

export default function GenerateSalesBill() {
    const ID_REQUIRED_LIMIT = 200000;

    const [errors, setErrors] = useState({
        billName: "",
        billPhone: "",
        billAddress: "",
        billPaidAmount: "",
        billItemName: "",
        billHSNCode: "",
        billQuantity: "",
        billRate: "",
        billSGST: "",
        billCGST: "",
        idType: "",
        idNumber: "",
    });

    const [formData, setFormData] = useState({
        billName: "",
        billPhone: "",
        billAddress: "",
        referred_by: "",
        idType: "",
        idNumber: "",
        billItemName: "",
        billHSNCode: "",
        billQuantity: "",
        billRate: "",
        billSGST: "",
        billCGST: "",
        billPaymentMode: "",
        billPaidAmount: "",
        billBalanceDue: "",
    });

    const fullName = localStorage.getItem("fullname");
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [bill, setBill] = useState<Bill | null>(null);
    const [items, setItems] = useState<BillItem[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const total_amount = items.reduce(
        (sum, item) => sum + item.totalAmount,
        0
    );

    const paidAmount = Number(formData.billPaidAmount || 0);

    const balance_amount = Math.max(
        0,
        total_amount - paidAmount
    );

    const isIdMandatory = total_amount > ID_REQUIRED_LIMIT;

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.billName.trim()) {
            newErrors.billName = "Customer name is required";
        }

        if (!formData.billPhone.trim()) {
            newErrors.billPhone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.billPhone)) {
            newErrors.billPhone = "Enter a valid 10-digit phone number";
        }

        if (items.length === 0) {
            alert("Please add at least one item.");
            return false;
        }

        if (total_amount > ID_REQUIRED_LIMIT) {
            if (!formData.idType) {
                newErrors.idType = "Please select ID Type";
            }

            if (!formData.idNumber.trim()) {
                newErrors.idNumber = "ID Number is required";
            }

            if (formData.idType === "PAN") {
                const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

                if (!panRegex.test(formData.idNumber.toUpperCase())) {
                    newErrors.idNumber = "Invalid PAN Number";
                }
            }

            if (formData.idType === "AADHAR") {
                const aadhaarRegex = /^\d{12}$/;

                if (!aadhaarRegex.test(formData.idNumber)) {
                    newErrors.idNumber = "Invalid Aadhaar Number";
                }
            }
        }

        if (paidAmount < 0) {
            newErrors.billPaidAmount = "Paid amount cannot be negative";
        }

        if (paidAmount > total_amount) {
            newErrors.billPaidAmount =
                "Paid amount cannot be greater than bill total";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const validateItemField = () => {
        const newErrors: any = {};

        if (!formData.billItemName.trim()) {
            newErrors.billItemName = "Item name is required";
        }

        if (!formData.billHSNCode.trim()) {
            newErrors.billHSNCode = "HSN code is required";
        }

        if (!formData.billQuantity.trim()) {
            newErrors.billQuantity = "Weight/Quantity is required";
        } else if (Number(formData.billQuantity) <= 0) {
            newErrors.billQuantity = "Weight/Quantity must be greater than 0";
        }

        if (!formData.billRate.trim()) {
            newErrors.billRate = "Rate is required";
        } else if (Number(formData.billRate) <= 0) {
            newErrors.billRate = "Rate must be greater than 0";
        }
        const cgst = Number(formData.billCGST || 0);
        const sgst = Number(formData.billSGST || 0);

        if (cgst < 0 || cgst > 100) {
            newErrors.billCGST = "CGST must be between 0 and 100%";
        }

        if (sgst < 0 || sgst > 100) {
            newErrors.billSGST = "SGST must be between 0 and 100%";
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        if (name === "billPhone") {
            if (!/^\d*$/.test(value)) return;
        }

        const decimalFields = [
            "billQuantity",
            "billRate",
            "billSGST",
            "billCGST",
            "billPaidAmount",
        ];

        if (decimalFields.includes(name)) {
            if (!/^\d*\.?\d*$/.test(value)) {
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleCancelEdit = () => {
        setEditIndex(null);

        setFormData((prev) => ({
            ...prev,
            billItemName: "",
            billHSNCode: "",
            billQuantity: "",
            billRate: "",
            billSGST: "",
            billCGST: "",
        }));
    };

    const handleEditItem = (index: number) => {
        const item = items[index];

        setFormData((prev) => ({
            ...prev,
            billItemName: item.itemName,
            billHSNCode: item.hsnCode,
            billQuantity: item.quantity.toString(),
            billRate: item.rate.toString(),
            billSGST: item.sgst.toString(),
            billCGST: item.cgst.toString(),
        }));

        setEditIndex(index);
    };

    const handleAddItem = () => {
        if (!validateItemField()) return;

        const quantity = Number(formData.billQuantity || 0);
        const rate = Number(formData.billRate || 0);

        // Get GST percentages entered in text fields
        const cgstPercent = Number(formData.billCGST || 0);
        const sgstPercent = Number(formData.billSGST || 0);

        // Base amount
        const taxableAmount = quantity * rate;

        // Calculate GST amounts
        const cgst = taxableAmount * cgstPercent / 100;
        const sgst = taxableAmount * sgstPercent / 100;

        // Final item amount including GST
        const totalAmount =
            taxableAmount +
            cgst +
            sgst;

        const newItem: BillItem = {
            itemName: formData.billItemName,
            hsnCode: formData.billHSNCode,
            quantity,
            rate,
            sgst: Number(sgst.toFixed(2)),
            cgst: Number(cgst.toFixed(2)),
            totalAmount: Number(totalAmount.toFixed(2)),
        };

        if (editIndex !== null) {
            const updatedItems = [...items];

            updatedItems[editIndex] = newItem;

            setItems(updatedItems);
            setEditIndex(null);
        } else {
            setItems([...items, newItem]);
        }

        // Clear item fields
        setFormData((prev) => ({
            ...prev,
            billItemName: "",
            billHSNCode: "",
            billRate: "",
            billQuantity: "",
            billSGST: "",
            billCGST: "",
        }));
    };



    const handleDeleteItem = (index: number) => {
        const updatedItems = items.filter(
            (_, i) => i !== index
        );

        setItems(updatedItems);

        if (editIndex === index) {
            setEditIndex(null);
        }
    };

    useEffect(() => {
        if (total_amount <= ID_REQUIRED_LIMIT) {
            setFormData((prev) => ({
                ...prev,
                idType: "",
                idNumber: "",
            }));

            setErrors((prev) => ({
                ...prev,
                idType: "",
                idNumber: "",
            }));
        }
    }, [total_amount]);

    const paymentOptions = [
        {
            value: "Cash",
            label: "Cash",
        },
        {
            value: "Card",
            label: "Card",
        },
        {
            value: "UPI",
            label: "UPI",
        },
    ];

    const idOptions = [
        {
            value: "PAN",
            label: "PAN Card",
        },
        {
            value: "AADHAR",
            label: "Aadhaar Card",
        },
    ];

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            billPaymentMode: value,
        }));

        setErrors((prev) => ({
            ...prev,
            billPaymentMode: "",
        }));
    };

    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        onAfterPrint: () => {
            navigate("/home", {
                replace: true,
            });
        },
    });

    const sendWhatsApp = (data: any) => {
        const message =
            SHOP_NAME +
            "\n\n" +
            "Bill No: " +
            data.billNumber +
            "\n" +
            "Name: " +
            data.billName +
            "\n" +
            "Total: ₹ " +
            data.billTotalAmount +
            "\n" +
            "Paid: ₹ " +
            data.billPaidAmount +
            "\n" +
            "Balance: ₹ " +
            data.billBalance;

        const url =
            `https://wa.me/91${data.billPhone}` +
    `?text=${encodeURIComponent(message)}`;

window.open(url, "_blank");
};

const isGenerateDisabled =
    loading ||
    items.length === 0 ||
    total_amount <= 0 ||
    !formData.billName.trim() ||
    !formData.billPhone.trim() ||
    !formData.billPaymentMode ||
    (isIdMandatory &&
        (!formData.idType ||
            !formData.idNumber.trim())) ||
    paidAmount < 0 ||
    paidAmount > total_amount;

const handleGenerateBill = async () => {
    if (!validateForm()) return;

    try {
        setLoading(true);

        const payload = {
            billName: formData.billName,
            billPhone: formData.billPhone,
            billAddress: formData.billAddress,
            idType: formData.idType,
            idNumber: formData.idNumber,
            billPaymentMode:
            formData.billPaymentMode,
            billPaidAmount: paidAmount,
            billBilledBy: fullName,
            billTotalAmount: total_amount,
            billBalance: balance_amount,
            items: items,
        };

        const response = await api.post(
            "/api/bills",
            payload
        );

        setBill(response.data);

        setTimeout(() => {
            handlePrint();
        }, 500);

        sendWhatsApp(response.data);
    } catch (err) {
        console.error(err);

        alert(
            "Unable to generate bill. Please try again."
        );
    } finally {
        setLoading(false);
    }
};

return (
    <div className="min-h-screen bg-slate-50">

        <PageMeta
            title={SHOP_NAME}
            description={SHOP_NAME}
        />

        {/* =====================================================
                PAGE HEADER
            ====================================================== */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">

            <div className="flex items-center justify-between gap-4">

                <div>
                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 14h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V21a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold text-slate-800">
                                Generate Bill
                            </h1>

                            <p className="mt-0.5 text-sm text-slate-500">
                                Create, review and print customer billing details
                            </p>
                        </div>

                    </div>
                </div>


            </div>

        </div>


        {/* =====================================================
                MAIN CONTENT
            ====================================================== */}
        <div className="grid grid-cols-1 gap-5">


            {/* =================================================
                    CUSTOMER DETAILS
                ================================================== */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <ComponentCard title="Customer Details">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Customer Name
                                <span className="ml-1 text-red-500">
                                        *
                                    </span>
                            </label>

                            <Input
                                name="billName"
                                value={formData.billName}
                                onChange={handleChange}
                                placeholder="Enter customer name"
                                className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                            />

                            {errors.billName && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.billName}
                                </p>
                            )}
                        </div>


                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Phone Number
                                <span className="ml-1 text-red-500">
                                        *
                                    </span>
                            </label>

                            <Input
                                name="billPhone"
                                value={formData.billPhone}
                                onChange={handleChange}
                                placeholder="10-digit mobile number"
                                maxLength={10}
                                className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                            />

                            {errors.billPhone && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.billPhone}
                                </p>
                            )}
                        </div>


                        <div className="md:col-span-2">

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Billing Address
                            </label>

                            <Input
                                name="billAddress"
                                value={formData.billAddress}
                                onChange={handleChange}
                                placeholder="Enter billing address"
                                className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                            />

                        </div>

                    </div>

                </ComponentCard>

            </div>


            {/* =================================================
                    PRODUCT ENTRY
                ================================================== */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <ComponentCard title="Add Bill Item">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                        {/* ITEM */}
                        <div className="lg:col-span-2">

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Item Description
                                <span className="ml-1 text-red-500">
                                        *
                                    </span>
                            </label>

                            <Input
                                name="billItemName"
                                value={formData.billItemName}
                                onChange={handleChange}
                                placeholder="Iten Name"
                                className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                            />

                            {errors.billItemName && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.billItemName}
                                </p>
                            )}

                        </div>


                        {/* HSN */}
                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                HSN Code
                                <span className="ml-1 text-red-500">
                                        *
                                    </span>
                            </label>

                            <Input
                                name="billHSNCode"
                                value={formData.billHSNCode}
                                onChange={handleChange}
                                placeholder="HSN Code"
                                className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                            />

                            {errors.billHSNCode && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.billHSNCode}
                                </p>
                            )}

                        </div>


                        {/* QUANTITY */}
                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Quantity / Weight
                                <span className="ml-1 text-red-500">
                                        *
                                    </span>
                            </label>

                            <Input
                                name="billQuantity"
                                value={formData.billQuantity}
                                onChange={handleChange}
                                placeholder="0.000"
                                className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                            />

                            {errors.billQuantity && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.billQuantity}
                                </p>
                            )}

                        </div>


                        {/* RATE */}
                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Rate
                                <span className="ml-1 text-red-500">
                                        *
                                    </span>
                            </label>

                            <Input
                                name="billRate"
                                value={formData.billRate}
                                onChange={handleChange}
                                placeholder="₹ 0.00"
                                className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                            />

                            {errors.billRate && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.billRate}
                                </p>
                            )}

                        </div>



                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                CGST (%)
                                <span className="ml-1 text-red-500">
                                        *
                                    </span>
                            </label>

                            <div className="relative">

                                <Input
                                    name="billCGST"
                                    value={formData.billCGST}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="rounded-lg border-slate-300 bg-white pr-10 focus:border-blue-500 focus:ring-blue-500"
                                />

                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                                        %
                                    </span>

                            </div>

                            {errors.billCGST && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.billCGST}
                                </p>
                            )}

                        </div>


                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                SGST (%)
                                <span className="ml-1 text-red-500">
                                        *
                                    </span>
                            </label>

                            <Input
                                name="billSGST"
                                value={formData.billSGST}
                                onChange={handleChange}
                                placeholder="₹ 0.00"
                                className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                            />

                            {errors.billSGST && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.billSGST}
                                </p>
                            )}

                        </div>

                    </div>


                    {/* ITEM ACTIONS */}
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">

                        <Button
                            className="rounded-lg bg-blue-600 px-5 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            variant="primary"
                            onClick={handleAddItem}
                        >
                            {editIndex !== null
                                ? "Update Item"
                                : "+ Add Item"}
                        </Button>

                        {editIndex !== null && (
                            <Button
                                className="rounded-lg border border-slate-300 bg-white px-5 text-slate-700 hover:bg-slate-50"
                                variant="outline"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </Button>
                        )}

                    </div>

                </ComponentCard>

            </div>


            {/* =================================================
                    BILL ITEMS
                ================================================== */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <ComponentCard title="Bill Items">

                    {items.length === 0 ? (

                        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 text-center">

                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.7}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6"
                                    />
                                </svg>
                            </div>

                            <p className="text-sm font-medium text-slate-700">
                                No items added
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Add products using the form above.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto rounded-lg border border-slate-200">

                            <Table>

                                <TableHeader className="bg-slate-100">

                                    <TableRow>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            #
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Item
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            HSN
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Qty
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Rate
                                        </TableCell>



                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            CGST
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            SGST
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Amount
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Action
                                        </TableCell>

                                    </TableRow>

                                </TableHeader>


                                <TableBody className="divide-y divide-slate-100 bg-white">

                                    {items.map((item, index) => (

                                        <TableRow
                                            key={index}
                                            className="transition-colors hover:bg-slate-50"
                                        >

                                            <TableCell className="px-4 py-3 text-sm text-slate-500">
                                                {index + 1}
                                            </TableCell>

                                            <TableCell className="px-4 py-3 text-sm font-medium text-slate-800">
                                                {item.itemName}
                                            </TableCell>

                                            <TableCell className="px-4 py-3 text-sm text-slate-500">
                                                {item.hsnCode}
                                            </TableCell>

                                            <TableCell className="px-4 py-3 text-right text-sm text-slate-600">
                                                {item.quantity}
                                            </TableCell>

                                            <TableCell className="px-4 py-3 text-right text-sm text-slate-600">
                                                ₹ {item.rate.toLocaleString()}
                                            </TableCell>



                                            <TableCell className="px-4 py-3 text-right text-sm text-slate-600">
                                                ₹ {item.cgst.toLocaleString()}
                                            </TableCell>

                                            <TableCell className="px-4 py-3 text-right text-sm text-slate-600">
                                                ₹ {item.sgst.toLocaleString()}
                                            </TableCell>

                                            <TableCell className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                                                ₹ {item.totalAmount.toLocaleString()}
                                            </TableCell>

                                            <TableCell className="px-4 py-3">

                                                <div className="flex justify-center gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEditItem(index)
                                                        }
                                                        className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteItem(index)
                                                        }
                                                        className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </TableCell>

                                        </TableRow>

                                    ))}

                                </TableBody>

                            </Table>

                        </div>

                    )}


                    {/* GRAND TOTAL */}
                    <div className="mt-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Grand Total
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Including applicable taxes
                            </p>

                        </div>

                        <p className="text-3xl font-bold tracking-tight text-slate-900">
                            ₹ {total_amount.toLocaleString()}
                        </p>

                    </div>

                </ComponentCard>

            </div>


            {/* =================================================
                    PAYMENT DETAILS
                ================================================== */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <ComponentCard title="Payment Details">

                    {/* ID NOTICE */}
                    {isIdMandatory && (

                        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4">

                            <div className="flex gap-3">

                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">

                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v3m0 4h.01M10.29 3.86l-7.36 12.73A2 2 0 004.66 20h14.68a2 2 0 001.73-3.01L13.71 3.86a2 2 0 00-3.42 0z"
                                        />
                                    </svg>

                                </div>

                                <div>

                                    <p className="text-sm font-semibold text-amber-800">
                                        Customer identification required
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-amber-700">
                                        Transactions above ₹2,00,000 require a valid PAN or Aadhaar number.
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}


                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* ID TYPE */}
                        {isIdMandatory && (

                            <div>

                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    ID Type
                                    <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                </label>

                                <Select
                                    options={idOptions}
                                    value={formData.idType}
                                    onChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            idType: value,
                                        }))
                                    }
                                    placeholder="Select ID Type"
                                />

                                {errors.idType && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {errors.idType}
                                    </p>
                                )}

                            </div>

                        )}


                        {/* ID NUMBER */}
                        {isIdMandatory && (

                            <div>

                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    ID Number
                                    <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                </label>

                                <Input
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                    placeholder="Enter PAN / Aadhaar number"
                                    className="rounded-lg border-slate-300 bg-white uppercase focus:border-blue-500 focus:ring-blue-500"
                                />

                                {errors.idNumber && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {errors.idNumber}
                                    </p>
                                )}

                            </div>

                        )}


                        {/* PAYMENT MODE */}
                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Payment Mode
                                <span className="ml-1 text-red-500">
                                        *
                                    </span>
                            </label>

                            <Select
                                options={paymentOptions}
                                value={formData.billPaymentMode}
                                onChange={handleSelectChange}
                                placeholder="Select payment mode"
                            />

                        </div>


                        {/* PAID AMOUNT */}
                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Paid Amount
                            </label>

                            <Input
                                name="billPaidAmount"
                                value={formData.billPaidAmount}
                                onChange={handleChange}
                                placeholder="₹ 0.00"
                                className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                            />

                            {errors.billPaidAmount && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.billPaidAmount}
                                </p>
                            )}

                        </div>

                    </div>


                    {/* PAYMENT SUMMARY */}
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* TOTAL */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Bill Total
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                ₹ {total_amount.toLocaleString()}
                            </p>

                        </div>


                        {/* PAID */}
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                                Paid Amount
                            </p>

                            <p className="mt-2 text-2xl font-bold text-emerald-700">
                                ₹ {paidAmount.toLocaleString()}
                            </p>

                        </div>


                        {/* BALANCE */}
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">

                            <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
                                Balance Due
                            </p>

                            <p className="mt-2 text-2xl font-bold text-amber-700">
                                ₹ {balance_amount.toLocaleString()}
                            </p>

                        </div>

                    </div>

                </ComponentCard>

            </div>


            {/* =================================================
                    FINAL ACTION
                ================================================== */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-end">

                <Button
                    className="rounded-lg border border-slate-300 bg-white px-6 text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    variant="outline"
                    onClick={() => navigate("/home")}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    className="rounded-lg bg-blue-600 px-7 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    onClick={handleGenerateBill}
                    disabled={isGenerateDisabled}
                >
                    {loading
                        ? "Generating..."
                        : "Generate Bill & Print"}
                </Button>

            </div>


            {/* =================================================
                    PRINT COMPONENT
                ================================================== */}
            {bill && (

                <div style={{ display: "none" }}>
                    <PrintSalesBill
                        ref={printRef}
                        bill={bill}
                    />
                </div>

            )}

        </div>

    </div>
);
}

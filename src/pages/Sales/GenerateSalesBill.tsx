    import PageMeta from "../../components/common/PageMeta";
    import Button from "../../components/ui/button/Button";
    import {SHOP_NAME} from "../../common/constants";
    import {useRef, useState, useEffect} from "react";
    import ComponentCard from "../../components/common/ComponentCard";
    import Input from "../../components/form/input/InputField";
    import Select from "../../components/form/Select";
    import api from "../../common/axiosConfig";
    import {useReactToPrint} from "react-to-print";
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
        weight: number;
        rate: number;
        wastage: number;
        makingCharge: number;
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
            billWeight: "",
            billRate: "",
            billWastage: "",
            billMakingCharge: "",
            billSGST: "",
            billCGST: "",
            idType: "",
            idNumber: "",
        });

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

            if (!formData.billWeight.trim()) {
                newErrors.billWeight = "Weight is required";
            } else if (Number(formData.billWeight) <= 0) {
                newErrors.billWeight = "Weight must be greater than 0";
            }

            if (!formData.billRate.trim()) {
                newErrors.billRate = "Rate is required";
            } else if (Number(formData.billRate) <= 0) {
                newErrors.billRate = "Rate must be greater than 0";
            }

            if (!formData.billWastage.trim()) {
                newErrors.billWastage = "Wastage is required";
            } else if (Number(formData.billWastage) < 0) {
                newErrors.billWastage = "Invalid amount";
            }

            if (!formData.billMakingCharge.trim()) {
                newErrors.billMakingCharge = "Making Charge is required";
            } else if (Number(formData.billMakingCharge) < 0) {
                newErrors.billMakingCharge = "Invalid amount";
            }

            if (!formData.billSGST.trim()) {
                newErrors.billSGST = "SGST is required";
            } else if (Number(formData.billMakingCharge) < 0) {
                newErrors.billSGST = "Invalid amount";
            }
            if (!formData.billCGST.trim()) {
                newErrors.billCGST = "CGST is required";
            } else if (Number(formData.billCGST) < 0) {
                newErrors.billCGST = "Invalid amount";
            }




            setErrors(newErrors);

            return Object.keys(newErrors).length === 0;
        };

        const [formData, setFormData] = useState({
            billName: "",
            billPhone: "",
            billAddress: "",
            referred_by: "",
            idType: "",
            idNumber: "",
            billItemName: "",
            billHSNCode: "",
            billWeight: "",
            billWastage: "",
            billRate: "",
            billMakingCharge: "",
            billSGST: "",
            billCGST: "",
            billPaymentMode: "",
            billPaidAmount: "",
            billBalanceDue: "",
        });



        const [loading, setLoading] = useState(false);
        const [bill, setBill] = useState<Bill | null>(null);
        const [items, setItems] = useState<BillItem[]>([]);

        const handleChange = (e: any) => {
            const { name, value } = e.target;

            if (name === "billPhone") {
                if (!/^\d*$/.test(value)) return; // Allow only digits
            }

            // Fields that should accept only numbers and decimals
            const decimalFields = [
                "billWeight",
                "billRate",
                "billWastage",
                "billMakingCharge",
                "billSGST",
                "billCGST",
                "billPaidAmount",
            ];

            // Allow only digits and one decimal point
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

        const [editIndex, setEditIndex] = useState<number | null>(null);

        const handleCancelEdit = () => {
            setEditIndex(null);

            setFormData((prev) => ({
                ...prev,
                billItemName: "",
                billHSNCode: "",
                billWeight: "",
                billRate: "",
                billWastage: "",
                billMakingCharge: "",
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
                billWeight: item.weight.toString(),
                billRate: item.rate.toString(),
                billWastage: item.wastage.toString(),
                billMakingCharge: item.makingCharge.toString(),
                billSGST: item.sgst.toString(),
                billCGST: item.cgst.toString(),
            }));

            setEditIndex(index);
        };

        const handleAddItem = () => {

            if (!validateItemField()) return;


            const totalAmount =
                Number(formData.billWeight || 0) *
                Number(formData.billRate || 0) +
                Number(formData.billMakingCharge || 0) +
                Number(formData.billWastage || 0) +
                Number(formData.billSGST || 0) +
                Number(formData.billCGST || 0);

            const newItem: BillItem = {
                itemName: formData.billItemName,
                hsnCode: formData.billHSNCode,
                weight: Number(formData.billWeight || 0),
                rate: Number(formData.billRate || 0),
                wastage: Number(formData.billWastage || 0),
                makingCharge: Number(formData.billMakingCharge || 0),
                sgst: Number(formData.billSGST || 0),
                cgst: Number(formData.billCGST || 0),
                totalAmount,
            };

            if (editIndex !== null) {
                const updatedItems = [...items];
                updatedItems[editIndex] = newItem;
                setItems(updatedItems);
                setEditIndex(null);
            } else {
                setItems([...items, newItem]);
            }

            setFormData((prev) => ({
                ...prev,
                billItemName: "",
                billHSNCode: "",
                billWeight: "",
                billRate: "",
                billWastage: "",
                billMakingCharge: "",
                billSGST: "",
                billCGST: "",
            }));
        };

        const handleDeleteItem = (index: number) => {
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);

            if (editIndex === index) {
                setEditIndex(null);
            }
        };

        /* const total_amount =
             Number(formData.billWeight || 0) * Number(formData.billRate || 0) +
             Number(formData.billMakingCharge || 0) +
             Number(formData.billWastage || 0) +
             Number(formData.billSGST || 0) +
             Number(formData.billCGST || 0);*/

        const total_amount = items.reduce(
            (sum, item) => sum + item.totalAmount,
            0
        );

        const balance_amount =
            total_amount - Number(formData.billPaidAmount || 0);
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
        const options = [
            {value: "Cash", label: "Cash"},
            {value: "Card", label: "Card"},
            {value: "UPI", label: "UPI"},
        ];

        const idOptions = [
            { value: "PAN", label: "PAN Card" },
            { value: "AADHAR", label: "Aadhaar Card" },
        ];

        const handleSelectChange = (value: string) => {
            setFormData({
                ...formData,
                billPaymentMode: value
            });
        };

        const printRef = useRef<HTMLDivElement>(null);

        const handlePrint = useReactToPrint({
            contentRef: printRef
        });

        const sendWhatsApp = (data: any) => {
            const message =
                SHOP_NAME + "\n\n" +
                "Bill No: " + data.billNumber + "\n" +
                "Name: " + data.billName + "\n" +
                "Total: ₹ " + data.billTotalAmount + "\n" +
                "Paid: ₹ " + data.billPaidAmount + "\n" +
                "Balance: ₹ " + data.billBalance;

            const url = `https://wa.me/91${data.billPhone}?text=${encodeURIComponent(message)}`;
            window.open(url, "_blank");
        };
        const isIdMandatory = total_amount > ID_REQUIRED_LIMIT;
        const isGenerateDisabled =
            loading ||
            items.length === 0 ||
            total_amount <= 0 ||
            !formData.billName.trim() ||
            !formData.billPhone.trim() ||
            !formData.billPaymentMode ||
            (isIdMandatory && (!formData.idType || !formData.idNumber.trim())) ||
            Number(formData.billPaidAmount) <= 0;

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
                    billPaymentMode: formData.billPaymentMode,
                    billPaidAmount: Number(formData.billPaidAmount || 0),
                    billBilledBy: "Admin",
                    billTotalAmount: total_amount,
                    billBalance: balance_amount,
                    items: items
                };

                const response = await api.post("/api/bills", payload);

                setBill(response.data);

                setTimeout(() => {
                    handlePrint();
                }, 500);

                sendWhatsApp(response.data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="
min-h-screen
bg-gradient-to-b
from-[#FFFDF7]
via-[#FFF8E6]
to-[#FFF2CC]
">
                <PageMeta title={SHOP_NAME} description={SHOP_NAME}/>
{/*
                <PageBreadcrumb pageTitle="Generate Sales Bill"/>
*/}

                <div className="mb-8 rounded-3xl bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-600 p-8 shadow-xl">
                    <h2 className="text-3xl font-bold text-white">
                        📋 Generate Bill
                    </h2>

                    <p className="text-yellow-100 mt-1">
                        Generate & Print Bill
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">

                 <div className="
                    rounded-3xl
                    border
                    border-yellow-300
                    bg-gradient-to-br
                    from-yellow-50
                    via-white
                    to-yellow-100
                    shadow-lg
                    p-6
                    ">

                    {/* CUSTOMER */}
                    <ComponentCard title="👤 Customer Details">
                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white" name="billName" value={formData.billName} onChange={handleChange} placeholder="Name"/>
                        {errors.billName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.billName}
                            </p>
                        )}
                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white" name="billPhone" value={formData.billPhone} onChange={handleChange} placeholder="Phone" maxLength={10}/>
                        {errors.billPhone && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.billPhone}
                            </p>
                        )}
                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white" name="billAddress" value={formData.billAddress} onChange={handleChange}
                               placeholder="Address"/>
                    </ComponentCard>
                 </div>
                {/* ITEM */}
                    <div className="
                    rounded-3xl
                    border
                    border-yellow-300
                    bg-gradient-to-br
                    from-yellow-50
                    via-white
                    to-yellow-100
                    shadow-lg
                    p-6
                    ">

                    <ComponentCard title="💍 Jewellery Details">
                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white" name="billItemName" value={formData.billItemName} onChange={handleChange}
                               placeholder="Item Name"/>
                        {errors.billItemName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.billItemName}
                            </p>
                        )}
                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white" name="billHSNCode" value={formData.billHSNCode} onChange={handleChange}
                               placeholder="HSN Code"/>
                        {errors.billHSNCode && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.billHSNCode}
                            </p>
                        )}
                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white" name="billWeight" value={formData.billWeight} onChange={handleChange} placeholder="Weight"/>
                        {errors.billWeight && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.billWeight}
                            </p>
                        )}
                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white" name="billRate" value={formData.billRate} onChange={handleChange} placeholder="Rate"/>
                        {errors.billRate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.billRate}
                            </p>
                        )}
                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white" name="billWastage" value={formData.billWastage} onChange={handleChange}
                               placeholder="Wastage"/>
                        {errors.billWastage && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.billWastage}
                            </p>
                        )}
                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white" name="billMakingCharge" value={formData.billMakingCharge} onChange={handleChange}
                               placeholder="Making Charge"/>
                        {errors.billMakingCharge && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.billMakingCharge}
                            </p>
                        )}
                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white" name="billSGST" value={formData.billSGST} onChange={handleChange} placeholder="SGST"/>
                        {errors.billSGST && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.billSGST}
                            </p>
                        )}
                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white" name="billCGST" value={formData.billCGST} onChange={handleChange} placeholder="CGST"/>
                        {errors.billCGST && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.billCGST}
                            </p>
                        )}
                    </ComponentCard>
                    </div>
                    <div className="flex gap-2">
                        <Button className="rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg hover:scale-105 transition-all" variant="outline" onClick={handleAddItem}>
                            {editIndex !== null ? "Update Item" : "+ Add Item"}
                        </Button>

                        {editIndex !== null && (
                            <Button className="rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg hover:scale-105 transition-all" variant="primary" onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                        )}
                    </div>
                   {/* <div className="mt-4">*/}
                    <div className="
                    rounded-3xl
                    border
                    border-yellow-300
                    bg-gradient-to-br
                    from-yellow-50
                    via-white
                    to-yellow-100
                    shadow-lg
                    p-6
                    ">

                    <ComponentCard title="📋 Purchased Jewellery">
                           <div className="max-w-full overflow-x-auto">
                                <Table>
                                    <TableHeader className="
bg-gradient-to-r
from-yellow-600
to-yellow-500
text-white">
                                        <TableRow>
                                            <TableCell isHeader className="px-5 py-4 sm:px-6 text-start text-theme-sm">#</TableCell>
                                            <TableCell isHeader className="px-5 py-4 sm:px-6 text-start text-theme-sm">Item</TableCell>
                                            <TableCell isHeader className="px-5 py-4 sm:px-6 text-start text-theme-sm">HCN Code</TableCell>
                                            <TableCell isHeader className="px-5 py-4 sm:px-6 text-start text-theme-sm">Weight</TableCell>
                                            <TableCell isHeader className="px-5 py-4 sm:px-6 text-start text-theme-sm">Rate</TableCell>
                                            <TableCell isHeader className="px-5 py-4 sm:px-6 text-start text-theme-sm">Wastage</TableCell>
                                            <TableCell isHeader className="px-5 py-4 sm:px-6 text-start text-theme-sm">Making Charge</TableCell>
                                            <TableCell isHeader className="px-5 py-4 sm:px-6 text-start text-theme-sm">SGST</TableCell>
                                            <TableCell isHeader className="px-5 py-4 sm:px-6 text-start text-theme-sm">CGST</TableCell>
                                            <TableCell isHeader className="px-5 py-4 sm:px-6 text-start text-theme-sm">Total</TableCell>
                                            <TableCell isHeader>Action</TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="hover:bg-yellow-50 odd:bg-white even:bg-yellow-50 divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {items.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">{index + 1}  </TableCell>
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">{item.itemName}</TableCell>
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">{item.hsnCode}</TableCell>
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">{item.weight}</TableCell>
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">{item.rate}</TableCell>
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">{item.wastage}</TableCell>
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">{item.makingCharge}</TableCell>
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">{item.sgst}</TableCell>
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">{item.cgst}</TableCell>
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">
                                                    ₹{item.totalAmount}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button className="rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg hover:scale-105 transition-all"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEditItem(index)}
                                                        >
                                                            Edit
                                                        </Button>

                                                        <Button className="rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg hover:scale-105 transition-all"
                                                            size="sm"
                                                            variant="primary"
                                                            onClick={() => handleDeleteItem(index)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                          {/*  <div>Grand Total: ₹ {total_amount}</div>*/}
                        <div className="
mt-6
rounded-2xl
bg-gradient-to-r
from-yellow-500
to-amber-600
p-6
text-white
shadow-xl
">

                            <h2 className="text-lg">
                                Grand Total
                            </h2>

                            <h1 className="text-4xl font-bold">
                                ₹ {total_amount.toLocaleString()}
                            </h1>

                        </div>

                        </ComponentCard>

                   </div>

                    {/* PAYMENT */}
                    <div className="
                    rounded-3xl
                    border
                    border-yellow-300
                    bg-gradient-to-br
                    from-yellow-50
                    via-white
                    to-yellow-100
                    shadow-lg
                    p-6
                    ">

                    <ComponentCard title="💰 Payment Details">

                        {isIdMandatory && (
                            <>
{/*
                                <div className="mb-3 rounded-md border border-red-300 bg-red-50 p-3">
*/}
                                    <div className="
rounded-xl
border-l-4
border-red-600
bg-red-50
p-5
">
                                    <p className="text-red-600 font-medium">
                                        Transactions above ₹2,00,000 require a valid PAN or Aadhaar number.
                                    </p>
                                </div>

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
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.idType}
                                    </p>
                                )}

                                <Input
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                    placeholder="ID Number"
                                />

                                {errors.idNumber && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.idNumber}
                                    </p>
                                )}
                            </>
                        )}






                        <Select className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white"
                            options={options}
                            onChange={handleSelectChange}
                            placeholder="Payment Mode"
                        />

                        <Input className="rounded-xl border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 bg-white"
                            name="billPaidAmount"
                            value={formData.billPaidAmount}
                            onChange={handleChange}
                            placeholder="Paid Amount"
                        />


                        <div className="
mt-6
rounded-2xl
bg-gradient-to-r
from-yellow-500
to-amber-600
p-6
text-white
shadow-xl
">

                            <h2 className="text-lg">
                                Balance
                            </h2>

                            <h1 className="text-4xl font-bold">
                                ₹ {balance_amount.toLocaleString()}
                            </h1>

                        </div>


                    </ComponentCard>
                    </div>
                    <div className="flex gap-2">
                    <Button className="rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg hover:scale-105 transition-all"
                        onClick={handleGenerateBill}
                        disabled={isGenerateDisabled}
                    >
                        {loading ? "Generating..." : "Generate Bill & Print"}
                    </Button>
    </div>
                    {/* PRINT */}
                    {bill && (
                        <div style={{display: "none"}}>
                            <PrintSalesBill ref={printRef} bill={bill}/>
                        </div>
                    )}

                </div>
            </div>
        );
    }
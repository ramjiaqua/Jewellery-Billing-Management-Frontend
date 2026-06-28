import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import {SHOP_NAME} from "../../common/constants";
import {useRef, useState} from "react";
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

    const [formData, setFormData] = useState({
        billName: "",
        billPhone: "",
        billAddress: "",
        referred_by: "",

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
 /*   const handleAddItem = () => {

        const totalAmount =
            Number(formData.billWeight) * Number(formData.billRate) +
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

        setItems([...items, newItem]);

        // Clear item fields
        setFormData({
            ...formData,
            billItemName: "",
            billHSNCode: "",
            billWeight: "",
            billRate: "",
            billWastage: "",
            billMakingCharge: "",
            billSGST: "",
            billCGST: "",
        });
    };*/
    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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

    const options = [
        {value: "Cash", label: "Cash"},
        {value: "Card", label: "Card"},
        {value: "UPI", label: "UPI"},
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

    const handleGenerateBill = async () => {
        try {
            setLoading(true);

            const payload = {
                billName: formData.billName,
                billPhone: formData.billPhone,
                billAddress: formData.billAddress,
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
        <div>
            <PageMeta title={SHOP_NAME} description={SHOP_NAME}/>
            <PageBreadcrumb pageTitle="Generate Sales Bill"/>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">

                {/* CUSTOMER */}
                <ComponentCard title="Customer Details">
                    <Input name="billName" value={formData.billName} onChange={handleChange} placeholder="Name"/>
                    <Input name="billPhone" value={formData.billPhone} onChange={handleChange} placeholder="Phone"/>
                    <Input name="billAddress" value={formData.billAddress} onChange={handleChange}
                           placeholder="Address"/>
                </ComponentCard>

                {/* ITEM */}
                <ComponentCard title="Item Details">
                    <Input name="billItemName" value={formData.billItemName} onChange={handleChange}
                           placeholder="Item Name"/>
                    <Input name="billHSNCode" value={formData.billHSNCode} onChange={handleChange}
                           placeholder="HSN Code"/>
                    <Input name="billWeight" value={formData.billWeight} onChange={handleChange} placeholder="Weight"/>
                    <Input name="billRate" value={formData.billRate} onChange={handleChange} placeholder="Rate"/>
                    <Input name="billWastage" value={formData.billWastage} onChange={handleChange}
                           placeholder="Wastage"/>
                    <Input name="billMakingCharge" value={formData.billMakingCharge} onChange={handleChange}
                           placeholder="Making Charge"/>
                    <Input name="billSGST" value={formData.billSGST} onChange={handleChange} placeholder="SGST"/>
                    <Input name="billCGST" value={formData.billCGST} onChange={handleChange} placeholder="CGST"/>
                </ComponentCard>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleAddItem}>
                        {editIndex !== null ? "Update Item" : "+ Add Item"}
                    </Button>

                    {editIndex !== null && (
                        <Button variant="primary" onClick={handleCancelEdit}>
                            Cancel
                        </Button>
                    )}
                </div>
               {/* <div className="mt-4">*/}
                    <ComponentCard title="All Purchased Items">
                       <div className="max-w-full overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
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

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
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
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditItem(index)}
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
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
                        <div>Grand Total: ₹ {total_amount}</div>
                    </ComponentCard>
               {/* </div>*/}

                {/* PAYMENT */}
                <ComponentCard title="Payment Details">

                    <Select
                        options={options}
                        onChange={handleSelectChange}
                        placeholder="Payment Mode"
                    />

                    <Input
                        name="billPaidAmount"
                        value={formData.billPaidAmount}
                        onChange={handleChange}
                        placeholder="Paid Amount"
                    />

                    <div>Balance: ₹ {balance_amount}</div>
                </ComponentCard>

                <Button
                    onClick={handleGenerateBill}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Bill & Print"}
                </Button>

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
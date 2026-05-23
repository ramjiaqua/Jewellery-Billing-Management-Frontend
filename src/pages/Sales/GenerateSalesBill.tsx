import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import {API_URL} from "../../common/constants";
import {SHOP_NAME} from "../../common/constants";

import  {useRef, useState} from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import PrintSalesBill from '../../components/sales/PrintSalesBill';

export default function GenerateSalesBill() {
    const [formData, setFormData] = useState({
        billName: "",
        billPhone: "",
        billAddress: "",
        referred_by: "",

        billItemName: "",
        billWeight: "",
        billRate: "",
        billMakingCharge: "",

        billPaymentMode: "",
        billPaidAmount: "",
        billBalanceDue: "",
        billBilledBy: ""
    });
    const handleChange = (e:any) => {
        setFormData({
            ...(formData || {}),
            [e.target.name]: e.target.value
        });
    };

    const total_amount =
        Number(formData?.billWeight || 0) * Number(formData?.billRate || 0) +
        Number(formData?.billMakingCharge || 0);

    const balance_amount =
        total_amount - Number(formData?.billPaidAmount || 0);

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
    const [loading, setLoading] = useState(false);


    const handleGenerateBill = async () => {
        try {
            setLoading(true);
        const finalFormData = {
            ...formData,

            billTotalAmount: total_amount,
            billBalance: balance_amount,
            billBilledBy: "Admin"
        };
        console.log(finalFormData);

    /*    const response = await axios.post(
            "http://localhost:8080/api/bills",
            finalFormData
        );*/
            const response = await axios.post(`${API_URL}/api/bills`,finalFormData);

            console.log(response);
            // ✅ Store generated bill
            setBill(response.data);

            setTimeout(() => {
                handlePrint();
            }, 500);

            // auto open WhatsApp
            sendWhatsApp(response.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    };
    const [bill, setBill] = useState(null);
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef
    });

    const sendWhatsApp = (finalFormData:any) => {

        if (!finalFormData) return; // safety

        const message =
            SHOP_NAME + "\n\n" +
            "ரசீது எண்: " + finalFormData.billNumber + "\n" +
            "பெயர்: " + finalFormData.billName + "\n" +
            "மொத்தம்: ₹ " + finalFormData.billTotalAmount + "\n" +
            "செலுத்தியது: ₹ " + finalFormData.billPaidAmount + "\n" +
            "மீதம்: ₹ " + finalFormData.billBalance + "\n\n" +
            "நன்றி! மீண்டும் வருக";

        const phone = finalFormData.billPhone;

        const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}&lang=en`;
        console.log(url);
        window.open(url, "_blank");
    };

    return (


        <div>
            <PageMeta
                title={SHOP_NAME}
                description={SHOP_NAME}
            />
            <PageBreadcrumb pageTitle="Generate Sales Bill"/>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                <div className="space-y-6">
                    <ComponentCard title="Customer Details">
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="customer_name">Name</Label>
                                <Input type="text" id="customer_name" name="billName" value={formData.billName || ""}
                                       onChange={handleChange}/>
                            </div>
                            <div>
                                <Label htmlFor="customer_address">Address</Label>
                                <Input type="text" id="customer_address" name="billAddress"
                                       value={formData.billAddress || ""} onChange={handleChange}/>
                            </div>
                            <div>
                                <Label htmlFor="customer_phone">Phone Number</Label>
                                <Input type="text" id="customer_phone" name="billPhone"
                                       value={formData.billPhone || ""} onChange={handleChange}/>
                            </div>
                            <div>
                                <Label htmlFor="referred_by">Referred By</Label>
                                <Input type="text" id="referred_by" name="referred_by"
                                       value={formData.referred_by || ""} onChange={handleChange}/>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
                <div className="space-y-6">
                    <ComponentCard title="Item Details">
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="item_name">Item</Label>
                                <Input type="text" id="item_name" name="billItemName" onChange={handleChange}
                                       placeholder="Enter Items"/>
                            </div>
                            <div>
                                <Label htmlFor="item_weight">Weight</Label>
                                <Input type="text" id="item_weight" name="billWeight" onChange={handleChange}
                                       placeholder="Enter Weight"/>
                            </div>
                            <div>
                                <Label htmlFor="item_rate">Rate</Label>
                                <Input type="text" id="item_rate" name="billRate" onChange={handleChange}
                                       placeholder="Enter Rate"/>
                            </div>
                            <div>
                                <Label htmlFor="item_making_charge">Making Charge</Label>
                                <Input type="text" id="item_making_charge" name="billMakingCharge"
                                       onChange={handleChange} placeholder="Enter Making Charge"/>
                            </div>
                            <div>
                                <Label htmlFor="totalAmount">Total Amount</Label>
                                <Input type="text" id="totalAmount" value={total_amount} readOnly
                                       placeholder="Total Amount"/>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
                <div className="space-y-6">
                    <ComponentCard title="Payment Details">
                        <div className="space-y-6">

                            <div>

                                <Label htmlFor="payment_type">Select Input</Label>
                                <Select  id="payment_type"
                                    options={options}
                                    placeholder="Select an option"
                                    onChange={handleSelectChange}
                                    className="dark:bg-dark-900"
                                />
                            </div>
                            <div>
                                <Label htmlFor="amount_paid">Amount Paid</Label>
                                <Input type="text" id="amount_paid" name="billPaidAmount"
                                       value={formData.billPaidAmount || ""} onChange={handleChange}/>
                            </div>
                            <div>
                                <Label htmlFor="amount_balance">Amount Balance</Label>
                                <Input type="text" id="amount_balance" name="amountBalance" value={balance_amount} readOnly/>
                            </div>
                            <div>
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input type="text" id="due_date" name="due_date" value={formData.billBalanceDue || ""}
                                       onChange={handleChange}/>
                            </div>


                        </div>
                    </ComponentCard>
                </div>
                <div>
                    <Button className="flex items-center gap-5" size="sm" type="submit" disabled={loading}
                            onClick={handleGenerateBill}>
                        {loading ? "Generating..." : "Generate Bill & Print"}
                    </Button>

                   {bill && (
                        <>
                          {/*  <button
                                onClick={handlePrint}
                                className="bg-yellow-500 text-white px-4 py-2 ml-3 rounded"
                            >
                                Print Bill
                            </button>*/}

                            <div style={{ display: "none" }}>
                                <PrintSalesBill ref={printRef} bill={bill} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

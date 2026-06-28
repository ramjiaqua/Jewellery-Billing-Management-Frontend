import {forwardRef} from "react";
import {SHOP_NAME, SHOP_ADDRESS, SHOP_CITYZIP, SHOP_PHONE, GST_NUMBER} from "../../common/constants";


interface BillProps {
    bill: {
        billNumber: string;
        billDate: string;
        billName: string;
        billPhone: string;
        billAddress: string;
        items: {
            itemName: string;
            hsnCode: string;
            weight: number;
            wastage: number;
            rate: number;
            makingCharge: number;
            sgst: number;
            cgst: number;
            totalAmount?: number;
        }[];
        billTotalAmount: number;
        billPaidAmount: number;
        billBalance: number;
        billBalanceDue: string;
    };
}

const amountStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "280px",
    marginLeft: "auto",
    padding: "4px 0"
};

const PrintSalesBill = forwardRef<HTMLDivElement, BillProps>(

    ({bill}, ref) => {
        if (!bill?.billNumber) return null;
        return (
            <div ref={ref} style={{padding: "20px", fontFamily: "Arial"}}>
                {/* HEADER */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "2px solid #d4af37",
                    paddingBottom: "10px",
                    marginBottom: "10px"
                }}>

                    {/* LOGO */}
                    <img src="/logo.png" alt="logo" style={{width: "80px"}}/>

                    {/* SHOP DETAILS */}
                    <div style={{textAlign: "center"}}>
                        <h2 style={{margin: 0, color: "#d4af37"}}>
                            {SHOP_NAME}
                        </h2>
                        <p style={{margin: 0}}>{SHOP_ADDRESS}</p>
                        <p style={{margin: 0}}>{SHOP_CITYZIP}</p>
                        <p style={{margin: 0}}>{SHOP_PHONE}</p>
                        <p style={{margin: 0, fontWeight: "bold"}}>{GST_NUMBER}</p>
                    </div>

                    {/* BILL INFO */}
                    <div style={{textAlign: "right"}}>
                        <p><b>Bill No:</b> {bill.billNumber}</p>
                        <p><b>Invoice Date:</b> {bill.billDate}</p>
                    </div>

                </div>

                {/* CUSTOMER */}
                <div style={{marginBottom: "10px"}}>
                    <p><b>Customer:</b> {bill.billName}</p>
                    <p><b>Phone:</b> {bill.billPhone}</p>
                    <p><b>Address:</b> {bill.billAddress}</p>
                </div>

                {/* TABLE */}
                <table style={{width: "100%", borderCollapse: "collapse"}}>
                    <thead>
                    <tr>
                        <th style={th}>Particulars</th>
                        <th style={th}>HSN Code</th>
                        <th style={th}>Weight</th>
                        <th style={th}>Wastage</th>
                        <th style={th}>Rate</th>
                        <th style={th}>Making Charge</th>
                        <th style={th}>SGST</th>
                        <th style={th}>CGST</th>
                        <th style={th}>Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bill.items?.map((item, index) => (
                        <tr key={index}>
                            <td style={td}>{item.itemName}</td>
                            <td style={td}>{item.hsnCode}</td>
                            <td style={td}>{item.weight}</td>
                            <td style={td}>₹{Number(item.wastage ?? 0).toLocaleString()}</td>
                            <td style={td}>₹{Number(item.rate ?? 0).toLocaleString()}</td>
                            <td style={td}>₹{Number(item.makingCharge ?? 0).toLocaleString()}</td>
                            <td style={td}>₹{Number(item.sgst ?? 0).toLocaleString()}</td>
                            <td style={td}>₹{Number(item.cgst ?? 0).toLocaleString()}</td>
                            <td style={td}>
                                ₹{Number(item.totalAmount ?? 0).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>


                <div style={amountStyle}>
                    <span>Grand Total</span>
                    <span>₹{Number(bill.billTotalAmount ?? 0).toLocaleString()}</span>
                </div>

                <div style={amountStyle}>
                    <span>Paid Amount</span>
                    <span>₹{Number(bill.billPaidAmount ?? 0).toLocaleString()}</span>
                </div>

                <div style={amountStyle}>
                    <span>Balance Amount</span>
                    <span>₹{Number(bill.billBalance ?? 0).toLocaleString()}</span>
                </div>

                <h3 style={{textAlign: "right", marginTop: "10px"}}>
                    Due Date: {bill.billBalanceDue}
                </h3>

                {/* FOOTER */}
                <div style={{marginTop: "20px", textAlign: "center"}}>
                    <p>Thank you for choosing {SHOP_NAME}.</p>
                    <p>We value your trust and look forward to serving you again.</p>
                </div>

            </div>
        );
    });

const th = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f5f5f5"
};

const td = {
    border: "1px solid #ccc",
    padding: "8px"

};
export default PrintSalesBill;

import { forwardRef } from "react";
import {SHOP_NAME, SHOP_ADDRESS, SHOP_PHONE, GST_NUMBER} from "../../common/constants";


interface BillProps {
    bill: {
        billNumber: string;
        billDate: string;
        billName: string;
        billPhone: string;
        billAddress: string;
        billItemName: string;
        billWeight: number;
        billRate: number;
        billMakingCharge: number;
        billTotalAmount: number;
    };
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-GB");
};

const PrintSalesBill = forwardRef<HTMLDivElement, BillProps>(
    ({ bill }, ref) => {    return (
        <div ref={ref} style={{ padding: "20px", fontFamily: "Arial" }}>
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
                <img src="/logo.png" alt="logo" style={{ width: "80px" }} />

                {/* SHOP DETAILS */}
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ margin: 0, color: "#d4af37" }}>
                         {SHOP_NAME}
                    </h2>
                    <p style={{ margin: 0 }}>{SHOP_ADDRESS}</p>
                    <p style={{ margin: 0 }}>{SHOP_PHONE}</p>
                    <p style={{ margin: 0, fontWeight: "bold" }}>{GST_NUMBER}</p>
                </div>

                {/* BILL INFO */}
                <div style={{ textAlign: "right" }}>
                    <p><b>Bill No:</b> {bill.billNumber}</p>
                    <p><b>Date:</b> {formatDate(bill.billDate)}</p>
                </div>

            </div>

            {/* CUSTOMER */}
            <div style={{ marginBottom: "10px" }}>
                <p><b>Customer:</b> {bill.billName}</p>
                <p><b>Phone:</b> {bill.billPhone}</p>
                <p><b>Address:</b> {bill.billAddress}</p>
            </div>

            {/* TABLE */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={th}>Item</th>
                    <th style={th}>Weight</th>
                    <th style={th}>Rate</th>
                    <th style={th}>Making</th>
                    <th style={th}>Total</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style={td}>{bill.billItemName}</td>
                    <td style={td}>{bill.billWeight}</td>
                    <td style={td}>{bill.billRate}</td>
                    <td style={td}>{bill.billMakingCharge}</td>
                    <td style={td}>{bill.billTotalAmount}</td>
                </tr>
                </tbody>
            </table>

            {/* TOTAL */}
            <h3 style={{ textAlign: "right", marginTop: "10px" }}>
                Grand Total: ₹ {bill.billTotalAmount}
            </h3>

            {/* FOOTER */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <p>Thank you for your business 💎</p>
                <p>Visit Again!</p>
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

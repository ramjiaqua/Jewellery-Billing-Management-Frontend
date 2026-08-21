import { forwardRef } from "react";
import {
  SHOP_NAME,
  SHOP_ADDRESS,
  SHOP_CITYZIP,
  SHOP_PHONE,
  GST_NUMBER,
} from "../../common/constants";

interface BillProps {
  bill: {
    billNumber: string;
    billDate: string;
    billName: string;
    billPhone: string;
    billAddress: string;

    // Payment and ID details

    billPaymentMode?: string;
    idType?: string;
    idNumber?: string;

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

/* ================= AMOUNT FORMAT ================= */

const formatAmount = (amount: number | undefined) =>
  `₹${Number(amount ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})}`;

/* ================= AMOUNT IN WORDS ================= */

const numberToWords = (num: number): string => {
  if (num === 0) return "Zero Rupees Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convertBelowThousand = (n: number): string => {
    let result = "";

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }

    if (n > 0) {
      result += ones[n] + " ";
    }

    return result.trim();
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let result = "";

  const crore = Math.floor(rupees / 10000000);
  const lakh = Math.floor((rupees % 10000000) / 100000);
  const thousand = Math.floor((rupees % 100000) / 1000);
  const remainder = rupees % 1000;

  if (crore > 0) {
    result += convertBelowThousand(crore) + " Crore ";
  }

  if (lakh > 0) {
    result += convertBelowThousand(lakh) + " Lakh ";
  }

  if (thousand > 0) {
    result += convertBelowThousand(thousand) + " Thousand ";
  }

  if (remainder > 0) {
    result += convertBelowThousand(remainder);
  }

  result = result.trim();

  if (paise > 0) {
    result += ` and ${convertBelowThousand(paise)} Paise`;
  }

  return `${result} Rupees Only`;
};

/* ================= LAST 4 DIGITS ================= */

const formatIdNumber = (
    idNumber?: string
): string => {
  if (!idNumber) return "";

  const cleanNumber = idNumber.replace(/\s/g, "");

  if (cleanNumber.length <= 4) {
    return cleanNumber;
  }

  return `XXXX${cleanNumber.slice(-4)}`;
};

/* ================= COMPONENT ================= */

const PrintSalesBill = forwardRef<HTMLDivElement, BillProps>(
  ({ bill }, ref) => {
    if (!bill?.billNumber) return null;

    const hasBalance = Number(bill.billBalance ?? 0) > 0;

    const amountInWords = numberToWords(
      Number(bill.billTotalAmount ?? 0)
    );

    const maskedIdNumber = formatIdNumber(
        bill.idNumber
    );

    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          padding: "30px",
          backgroundColor: "#ffffff",
          color: "#2d2d2d",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "13px",
          boxSizing: "border-box",
        }}
      >
        {/* ================= HEADER ================= */}

        <div
          style={{
            border: "1px solid #d8bd72",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "4px",
              backgroundColor: "#c9a227",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              borderRadius: "8px 8px 0 0",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* LOGO */}

            <div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img src="/images/logo/logo.jpeg"
                alt={SHOP_NAME}
                style={{
                  width: "100px",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* SHOP DETAILS */}

            <div
              style={{
                flex: 1,
                textAlign: "center",
              }}
            >
              <h1
                style={{
                  margin: "0 0 6px",
                  color: "#8b6f2d",
                  fontSize: "24px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                }}
              >
                {SHOP_NAME}
              </h1>

              <div
                style={{
                  height: "1px",
                  width: "70%",
                  margin: "8px auto",
                  backgroundColor: "#d8bd72",
                }}
              />

              <p style={{ margin: "3px 0", color: "#555" }}>
                {SHOP_ADDRESS}
              </p>

              <p style={{ margin: "3px 0", color: "#555" }}>
                {SHOP_CITYZIP}
              </p>

              <p style={{ margin: "3px 0", color: "#555" }}>
                Phone: {SHOP_PHONE}
              </p>

              <p
                style={{
                  margin: "6px 0 0",
                  fontWeight: "bold",
                  color: "#6b4f1d",
                }}
              >
                GSTIN: {GST_NUMBER}
              </p>
            </div>

            {/* INVOICE DETAILS */}

            <div
              style={{
                width: "150px",
                border: "1px solid #e0d2ad",
                borderRadius: "6px",
                padding: "12px",
                backgroundColor: "#fcfaf4",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px",
                  textAlign: "center",
                  color: "#8b6f2d",
                  fontSize: "15px",
                  letterSpacing: "1px",
                }}
              >
                INVOICE
              </h3>

              <div style={invoiceInfoRow}>
                <span>Bill No</span>
                <strong>{bill.billNumber}</strong>
              </div>

              <div style={invoiceInfoRow}>
                <span>Date</span>
                <strong>{bill.billDate}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CUSTOMER DETAILS ================= */}

        <div
          style={{
            border: "1px solid #e0d2ad",
            borderRadius: "6px",
            marginBottom: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#f8f1df",
              padding: "8px 12px",
              color: "#6b4f1d",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            CUSTOMER DETAILS
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 30px",
              padding: "12px",
            }}
          >
            <div>
              <strong>Customer Name:</strong>{" "}
              {bill.billName}
            </div>

            <div>
              <strong>Phone:</strong>{" "}
              {bill.billPhone}
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <strong>Address:</strong>{" "}
              {bill.billAddress || "-"}
            </div>

            {/* ID DETAILS */}

            {bill.idType && bill.idNumber && (
              <div>
                <strong>{bill.idType}:</strong>{" "}
                {maskedIdNumber}
              </div>
            )}
          </div>
        </div>

        {/* ================= ITEMS TABLE ================= */}

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={th}>#</th>

              <th style={{ ...th, textAlign: "left" }}>
                Particulars
              </th>

              <th style={th}>HSN</th>
              <th style={th}>Weight</th>
              <th style={th}>Wastage</th>
              <th style={th}>Rate</th>
              <th style={th}>Making</th>
              <th style={th}>SGST</th>
              <th style={th}>CGST</th>
              <th style={th}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {bill.items?.map((item, index) => (
              <tr key={index}>
                <td style={tdCenter}>
                  {index + 1}
                </td>

                <td style={tdLeft}>
                  <strong>{item.itemName}</strong>
                </td>

                <td style={tdCenter}>
                  {item.hsnCode}
                </td>

                <td style={tdRight}>
                  {Number(item.weight ?? 0).toFixed(3)}
                </td>

                <td style={tdRight}>
                  {formatAmount(item.wastage)}
                </td>

                <td style={tdRight}>
                  {formatAmount(item.rate)}
                </td>

                <td style={tdRight}>
                  {formatAmount(item.makingCharge)}
                </td>

                <td style={tdRight}>
                  {formatAmount(item.sgst)}
                </td>

                <td style={tdRight}>
                  {formatAmount(item.cgst)}
                </td>

                <td
                  style={{
                    ...tdRight,
                    fontWeight: "bold",
                    color: "#6b4f1d",
                  }}
                >
                  {formatAmount(item.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= BOTTOM SECTION ================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "30px",
          }}
        >
          {/* LEFT SECTION */}

          <div
            style={{
              flex: 1,
              paddingTop: "10px",
            }}
          >
            {/* AMOUNT IN WORDS */}

            <div
              style={{
                border: "1px solid #e0d2ad",
                borderRadius: "6px",
                padding: "10px 12px",
                backgroundColor: "#fcfaf4",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  color: "#6b4f1d",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                Amount in Words
              </div>

              <div
                style={{
                  fontStyle: "italic",
                  color: "#555",
                  lineHeight: "1.5",
                }}
              >
                {amountInWords}
              </div>
            </div>

            {/* THANK YOU */}

            <p
              style={{
                margin: "0 0 8px",
                color: "#8b6f2d",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Thank You!
            </p>

            <p
              style={{
                margin: "0",
                color: "#666",
                lineHeight: "1.5",
              }}
            >
              Thank you for choosing {SHOP_NAME}.
              <br />
              We value your trust and look forward to
              serving you again.
            </p>
          </div>

          {/* RIGHT - PAYMENT SUMMARY */}

          <div
            style={{
              width: "320px",
              border: "1px solid #d8bd72",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "#f8f1df",
                padding: "8px 12px",
                color: "#6b4f1d",
                fontWeight: "bold",
              }}
            >
              PAYMENT SUMMARY
            </div>

            <div style={{ padding: "10px 14px" }}>
              <div style={summaryRow}>
                <span>Payment Mode</span>

                <strong
                  style={{
                    color: "#6b4f1d",
                    textTransform: "uppercase",
                  }}
                >
                  {bill.billPaymentMode || "-"}
                </strong>
              </div>

              <div style={summaryRow}>
                <span>Grand Total</span>

                <strong>
                  {formatAmount(bill.billTotalAmount)}
                </strong>
              </div>

              <div style={summaryRow}>
                <span>Paid Amount</span>

                <strong>
                  {formatAmount(bill.billPaidAmount)}
                </strong>
              </div>

              {/* SHOW BALANCE ONLY IF > 0 */}

              {hasBalance && (
                <>
                  <div
                    style={{
                      borderTop: "1px solid #ddd",
                      marginTop: "6px",
                      paddingTop: "8px",
                    }}
                  >
                    <div style={summaryRow}>
                      <span
                        style={{
                          color: "#8b6f2d",
                          fontWeight: "bold",
                        }}
                      >
                        Balance Due
                      </span>

                      <strong
                        style={{
                          color: "#b02a37",
                          fontSize: "16px",
                        }}
                      >
                        {formatAmount(bill.billBalance)}
                      </strong>
                    </div>
                  </div>

                  {/* DUE DATE ONLY WHEN BALANCE EXISTS */}

                  <div
                    style={{
                      marginTop: "8px",
                      padding: "7px",
                      backgroundColor: "#fff5f5",
                      borderRadius: "4px",
                      textAlign: "right",
                      fontSize: "12px",
                      color: "#7a2525",
                    }}
                  >
                    Due Date:{" "}
                    <strong>{bill.billBalanceDue}</strong>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}

        <div
          style={{
            marginTop: "30px",
            paddingTop: "12px",
            borderTop: "1px solid #d8bd72",
            textAlign: "center",
            color: "#777",
            fontSize: "11px",
          }}
        >
          <p style={{ margin: "3px 0" }}>
            This is a computer-generated invoice.
          </p>

          <p
            style={{
              margin: "3px 0",
              color: "#8b6f2d",
              fontWeight: "bold",
            }}
          >
            Thank you for shopping with {SHOP_NAME}
          </p>
        </div>
      </div>
    );
  }
);

/* ================= STYLES ================= */

const th = {
  border: "1px solid #d8bd72",
  padding: "9px 6px",
  backgroundColor: "#f8f1df",
  color: "#6b4f1d",
  fontWeight: "bold",
  fontSize: "11px",
  textAlign: "center" as const,
};

const td = {
  border: "1px solid #ddd",
  padding: "8px 6px",
  fontSize: "11px",
};

const tdCenter = {
  ...td,
  textAlign: "center" as const,
};

const tdLeft = {
  ...td,
  textAlign: "left" as const,
};

const tdRight = {
  ...td,
  textAlign: "right" as const,
};

const invoiceInfoRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "8px",
  padding: "4px 0",
  fontSize: "11px",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "5px 0",
  fontSize: "13px",
};

export default PrintSalesBill;

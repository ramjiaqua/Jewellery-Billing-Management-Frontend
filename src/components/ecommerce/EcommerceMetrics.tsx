import {
  BoxIconLine,
  GroupIcon,
  TableIcon,
} from "../../icons";
import { useEffect, useState } from "react";
import api from "../../common/axiosConfig";

export default function EcommerceMetrics() {
  const [todaySalesCount, setTodaySalesCount] = useState(0);
  const [todayAmount, setTodayAmount] = useState(0);
  const [todayPaidAmount, setTodayPaidAmount] = useState(0);
  const [todayDueAmount, setTodayDueAmount] = useState(0);

  const [summary, setSummary] = useState({
    cash: 0,
    upi: 0,
    card: 0,
    others: 0,
  });

  useEffect(() => {
    fetchTodaySales();
  }, []);

  useEffect(() => {
    fetchTodayAmount();
  }, []);

  useEffect(() => {
    fetchTodayPaidAmount();
  }, []);

  useEffect(() => {
    fetchTodayDueAmount();
  }, []);

  useEffect(() => {
    fetchPaymentSummary();
  }, []);

  const fetchTodaySales = async () => {
    try {
      const response = await api.get("/api/bills/today-sales-count");
      setTodaySalesCount(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodayAmount = async () => {
    try {
      const response = await api.get("/api/bills/today-total-amount");
      setTodayAmount(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodayPaidAmount = async () => {
    try {
      const response = await api.get(
          "/api/bills/today-total-paid-amount"
      );
      setTodayPaidAmount(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodayDueAmount = async () => {
    try {
      const response = await api.get(
          "/api/bills/today-total-balance-due-amount"
      );
      setTodayDueAmount(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPaymentSummary = async () => {
    try {
      const response = await api.get(
          "/api/bills/today-payment-summary"
      );
      setSummary(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const MetricCard = ({
                        icon,
                        title,
                        value,
                        valueClassName = "text-slate-800",
                      }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    valueClassName?: string;
  }) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </div>

          <div className="mt-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </span>

            <h4
                className={`mt-2 text-2xl font-semibold ${valueClassName}`}
            >
              {value}
            </h4>
          </div>
        </div>
    );
  };

  return (
      <>
        {/* Date */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">
              Today's Overview
            </p>

            <p className="mt-0.5 text-sm text-slate-500">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
          <MetricCard
              icon={<GroupIcon className="size-6" />}
              title="No. of Sales"
              value={todaySalesCount}
          />

          <MetricCard
              icon={<BoxIconLine className="size-6" />}
              title="Total Sales Amount"
              value={`₹${todayAmount.toLocaleString("en-IN")}`}
          />

          <MetricCard
              icon={<BoxIconLine className="size-6" />}
              title="Total Sales Amount Paid"
              value={`₹${todayPaidAmount.toLocaleString("en-IN")}`}
              valueClassName="text-blue-700"
          />

          <MetricCard
              icon={<BoxIconLine className="size-6" />}
              title="Total Balance Due Amount"
              value={`₹${todayDueAmount.toLocaleString("en-IN")}`}
              valueClassName="text-red-700"
          />
        </div>

        {/* Payment Summary */}
        <div className="mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Today's Payment Summary
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Payment collection breakdown by mode
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
            <MetricCard
                icon={<TableIcon className="size-6" />}
                title="Cash Payment"
                value={`₹${summary.cash.toLocaleString("en-IN")}`}
            />

            <MetricCard
                icon={<TableIcon className="size-6" />}
                title="UPI Payment"
                value={`₹${summary.upi.toLocaleString("en-IN")}`}
            />

            <MetricCard
                icon={<TableIcon className="size-6" />}
                title="Card Payment"
                value={`₹${summary.card.toLocaleString("en-IN")}`}
            />

            <MetricCard
                icon={<TableIcon className="size-6" />}
                title="Other Payments"
                value={`₹${summary.others.toLocaleString("en-IN")}`}
            />
          </div>
        </div>
      </>
  );
}
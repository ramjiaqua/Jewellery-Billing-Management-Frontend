import {
  BoxIconLine,
  GroupIcon,TableIcon
} from "../../icons";
import {useEffect, useState} from "react";
import api from "../../common/axiosConfig";



export default function EcommerceMetrics() {
  const [todaySalesCount, setTodaySalesCount] = useState(0);
  const [todayAmount, setTodayAmount] = useState(0);
  const [todayPaidAmount, setTodayPaidAmount] = useState(0);
  const [todayDueAmount, setTodayDueAmount] = useState(0);


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
      const response = await api.get("/api/bills/today-total-paid-amount");

      setTodayPaidAmount(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodayDueAmount = async () => {
    try {
      const response = await api.get("/api/bills/today-total-balance-due-amount");

      setTodayDueAmount(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const [summary, setSummary] = useState({
    cash: 0,
    upi: 0,
    card: 0,
    others: 0
  });

  useEffect(() => {
    api.get("/api/bills/today-payment-summary")
        .then((res) => setSummary(res.data));
  }, []);


  return (

      <>

        <div className="mb-6 text-left text-gray-500">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-3xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border border-yellow-300 shadow-lg
hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
{/*
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
*/}
{/*
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
*/}
        <div className="
flex
items-center
justify-center
w-14
h-14
rounded-full
bg-gradient-to-br
from-yellow-400
to-yellow-600
shadow-md
">
          <GroupIcon className="text-white size-7"/>
{/*
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
*/}
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm uppercase tracking-wider text-yellow-700 font-semibold">

{/*
                className="text-sm text-gray-500 dark:text-gray-400">
*/}

              No. of Sales
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {todaySalesCount}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-3xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border border-yellow-300 shadow-lg
hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="
flex
items-center
justify-center
w-14
h-14
rounded-full
bg-gradient-to-br
from-yellow-400
to-yellow-600
shadow-md
">
          <BoxIconLine className="text-white size-7" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
             <span className="text-sm uppercase tracking-wider text-yellow-700 font-semibold">
              Total Sales Amount
            </span>
            <h4 className="mt-2 text-3xl font-bold text-gray-900">
              ₹{todayAmount.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-3xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border border-yellow-300 shadow-lg
hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="
flex
items-center
justify-center
w-14
h-14
rounded-full
bg-gradient-to-br
from-yellow-400
to-yellow-600
shadow-md
">          <BoxIconLine className="text-white size-7" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
              <span className="text-sm uppercase tracking-wider text-yellow-700 font-semibold">
              Total Sales Amount Paid
            </span>
            <h4 className="mt-2 font-bold text-blue-800 text-title-sm dark:text-white/90">
              ₹{todayPaidAmount.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-3xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border border-yellow-300 shadow-lg
hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="
flex
items-center
justify-center
w-14
h-14
rounded-full
bg-gradient-to-br
from-yellow-400
to-yellow-600
shadow-md
">          <BoxIconLine className="text-white size-7" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm uppercase tracking-wider text-yellow-700 font-semibold">
              Total Balance Due Amount
            </span>
            <h4 className="mt-2 font-bold text-red-800 text-title-sm dark:text-white/90">
              ₹{todayDueAmount.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>


  {/*<div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">*/}
        <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    <div className="rounded-3xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border border-yellow-300 shadow-lg
hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="
flex
items-center
justify-center
w-14
h-14
rounded-full
bg-gradient-to-br
from-yellow-400
to-yellow-600
shadow-md
">        <TableIcon className="text-white size-7" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
            <span className="text-sm uppercase tracking-wider text-yellow-700 font-semibold">
             Cash Payment
            </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            ₹{summary.cash.toLocaleString()}
          </h4>
        </div>
      </div>
    </div>

    <div className="rounded-3xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border border-yellow-300 shadow-lg
hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="
flex
items-center
justify-center
w-14
h-14
rounded-full
bg-gradient-to-br
from-yellow-400
to-yellow-600
shadow-md
">        <TableIcon className="text-white size-7" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
              <span className="text-sm uppercase tracking-wider text-yellow-700 font-semibold">
              UPI Payment
            </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            ₹{summary.upi.toLocaleString()}
          </h4>
        </div>
      </div>
    </div>

    <div className="rounded-3xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border border-yellow-300 shadow-lg
hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="
flex
items-center
justify-center
w-14
h-14
rounded-full
bg-gradient-to-br
from-yellow-400
to-yellow-600
shadow-md
">        <TableIcon className="text-white size-7" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
              <span className="text-sm uppercase tracking-wider text-yellow-700 font-semibold">
              Card Payment
            </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            ₹{summary.card.toLocaleString()}
          </h4>
        </div>
      </div>
    </div>

    <div className="rounded-3xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border border-yellow-300 shadow-lg
hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="
flex
items-center
justify-center
w-14
h-14
rounded-full
bg-gradient-to-br
from-yellow-400
to-yellow-600
shadow-md
">        <TableIcon className="text-white size-7" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
              <span className="text-sm uppercasetracking-wider text-yellow-700 font-semibold">
              Other Payments
            </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            ₹{summary.others.toLocaleString()}
          </h4>
        </div>
      </div>
    </div>
  </div>
      </>

  );
}

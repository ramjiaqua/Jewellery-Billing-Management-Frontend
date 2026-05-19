import {
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import {useEffect, useState} from "react";
import {API_URL} from "../../common/constants.tsx";
import axios from "axios";


export default function EcommerceMetrics() {
  const [todaySalesCount, setTodaySalesCount] = useState(0);
  const [todayAmount, setTodayAmount] = useState(0);
  const [todayDueAmount, setTodayDueAmount] = useState(0);


  useEffect(() => {
    fetchTodaySales();
  }, []);

  useEffect(() => {
    fetchTodayAmount();
  }, []);

  useEffect(() => {
    fetchTodayDueAmount();
  }, []);


  const fetchTodaySales = async () => {
    try {
      const response = await axios.get(
          `${API_URL}/api/bills/today-sales-count`
      );

      setTodaySalesCount(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodayAmount = async () => {
    try {
      const response = await axios.get(
          `${API_URL}/api/bills/today-total-amount`
      );

      setTodayAmount(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodayDueAmount = async () => {
    try {
      const response = await axios.get(
          `${API_URL}/api/bills/today-total-balance-due-amount`
      );

      setTodayDueAmount(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
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
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Sales Amount
            </span>
            <h4 className="mt-2 font-bold text-green-800 text-title-sm dark:text-white/90">
              ₹{todayAmount.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
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
  );
}

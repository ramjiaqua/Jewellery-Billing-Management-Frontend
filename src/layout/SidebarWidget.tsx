
import {useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../common/constants.tsx";

export default function SidebarWidget() {

    const [todayRate, setTodayRate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchViewRate();
    }, []);

    const fetchViewRate = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/rate/latest`);

            console.log(response);
            setTodayRate(response.data);

        } catch (error) {
            console.error("Error fetching Bills:", error);
        } finally {
            setLoading(false);
        }
    };
        if (loading) {
            return (
                <div className="p-4 text-gray-500">
                    Loading rate...
                </div>
            );
        }

  return (
      <div className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]">

          <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
              As of Date: {todayRate?.rateDate}
          </h3>

          <p className="mb-3 rounded-lg bg-yellow-100 px-3 py-2 text-base font-bold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300">
              Gold : ₹ {todayRate?.goldRate}/Gram
          </p>

          <p className="rounded-lg bg-gray-200 px-3 py-2 text-base font-bold text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              Silver : ₹ {todayRate?.silverRate}/Gram
          </p>

      </div>
  );
}

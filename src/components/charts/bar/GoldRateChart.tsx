import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import api from "../../../common/axiosConfig";

export default function GoldRateChart() {
  const [categories, setCategories] = useState<string[]>([]);
  const [seriesData, setSeriesData] = useState<number[]>([]);

  useEffect(() => {
    fetchGoldRates();
  }, []);

  const fetchGoldRates = async () => {
    try {
      const response = await api.get("/api/rate/daily-rate");
      const data = response.data;

      const dates = data.map((item: any) => item.rateDate);
      const rates = data.map((item: any) => item.goldRate);

      setCategories(dates);
      setSeriesData(rates);
    } catch (error) {
      console.error("Error loading gold rates:", error);
    }
  };

  const options: ApexOptions = {
    // Jewellery gold theme
    colors: ["#C9A227"],

    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 250,
      toolbar: {
        show: false,
      },
      background: "transparent",
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },

    xaxis: {
      categories: categories,

      labels: {
        style: {
          fontFamily: "Outfit, sans-serif",
          fontSize: "12px",
          colors: "#6B5B3E",
        },
      },

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      labels: {
        style: {
          fontFamily: "Outfit, sans-serif",
          fontSize: "12px",
          colors: "#6B5B3E",
        },

        formatter: (value: number) => {
          return `₹${value.toLocaleString("en-IN")}`;
        },
      },

      title: {
        text: "Gold Rate (₹)",
        style: {
          color: "#8B6F2D",
          fontFamily: "Outfit, sans-serif",
          fontWeight: 500,
        },
      },
    },

    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",

      fontFamily: "Outfit, sans-serif",
      fontSize: "13px",

      labels: {
        colors: "#6B5B3E",
      },
    },

    grid: {
      borderColor: "#E8D9B5",
      strokeDashArray: 4,

      yaxis: {
        lines: {
          show: true,
        },
      },

      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    fill: {
      opacity: 1,
    },

    tooltip: {
      theme: "light",

      x: {
        show: true,
      },

      y: {
        formatter: (val: number) =>
            `₹${val.toLocaleString("en-IN")}`,
      },
    },
  };

  const series = [
    {
      name: "Gold Rate",
      data: seriesData,
    },
  ];

  return (
      <div
          className="
        rounded-2xl
        border
        border-[#E8D9B5]
        bg-white
        p-5
        shadow-sm
      "
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#6B4F1D]">
              Gold Rate Trend
            </h3>

            <p className="mt-1 text-sm text-[#8B7A5A]">
              Daily gold rate history
            </p>
          </div>

          {/* Gold Icon */}
          <div
              className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-[#F8F1DF]
            text-xl
          "
          >
            🪙
          </div>
        </div>

        {/* Chart */}
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div
              id="goldRateChart"
              className="min-w-[700px]"
          >
            <Chart
                options={options}
                series={series}
                type="bar"
                height={250}
            />
          </div>
        </div>
      </div>
  );
}
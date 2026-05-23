import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import {SHOP_NAME} from "../../common/constants";

export default function Home() {
  return (
    <>
      <PageMeta
         title={SHOP_NAME}
         description={SHOP_NAME}
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-8">
          <EcommerceMetrics />

         {/* <MonthlySalesChart />*/}
        </div>

      {/*  <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>*/}



        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}

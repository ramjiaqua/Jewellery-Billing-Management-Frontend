import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import GoldRateChart from "../../components/charts/bar/GoldRateChart";
import SilverRateChart from "../../components/charts/bar/SilverRateChart";
import PageMeta from "../../components/common/PageMeta";

export default function BarChart() {
  return (
    <div>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Gold Rate">
          <GoldRateChart />
        </ComponentCard>
      </div>

        <div className="space-y-6">
            <ComponentCard title="Silver Rate">
                <SilverRateChart />
            </ComponentCard>
        </div>
    </div>
  );
}

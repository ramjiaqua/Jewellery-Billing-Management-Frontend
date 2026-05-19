import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ViewSalesBillTable from "../../components/sales/ViewSalesBillTable";
import {SHOP_NAME} from "../../common/constants";

export default function ViewSalesBill() {
  return (
    <>
      <PageMeta
        title={SHOP_NAME}
        description={SHOP_NAME}
      />
      <PageBreadcrumb pageTitle="View Sales Bill" />
          <div className="space-y-6">
            <ComponentCard title="Sales Bill">
                <ViewSalesBillTable />
            </ComponentCard>
        </div>
    </>
  );
}

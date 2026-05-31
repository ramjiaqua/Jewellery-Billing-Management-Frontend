import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ViewChitSchemeTable from "../../components/Chit/ViewChitSchemeTable";

export default function ViewChitCustomers() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="View Chit Scheme" />
      <div className="space-y-6">
        <ComponentCard title="Chit Scheme">
          <ViewChitSchemeTable />
        </ComponentCard>
      </div>
    </>
  );
}

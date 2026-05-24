import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ViewUsersProfile from "../../components/UserProfile/ViewUsersProfile";
import {SHOP_NAME} from "../../common/constants";

export default function ViewUsers() {
  return (
    <>
      <PageMeta
        title={SHOP_NAME}
        description={SHOP_NAME}
      />
      <PageBreadcrumb pageTitle="View Users Profile" />
          <div className="space-y-6">
            <ComponentCard title="Users Profile">
                <ViewUsersProfile />
            </ComponentCard>
        </div>
    </>
  );
}

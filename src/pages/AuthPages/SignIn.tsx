import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import {SHOP_NAME} from "../../common/constants";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title={SHOP_NAME}
        description={SHOP_NAME}
      />

      <AuthLayout>
        <SignInForm />
      </AuthLayout>

    </>

  );
}

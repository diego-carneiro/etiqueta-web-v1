import UserForms from "@/components/UserForms";
import BrandLogo from "@/components/BrandLogo";

export default function RecoverCodePage() {
  return (
    <div className="flex h-screen bg-brand-light">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <BrandLogo className="w-[min(560px,70%)] text-brand" />
      </div>
      <div className="w-full lg:w-1/3">
        <UserForms selector="recoverCode" />
      </div>
    </div>
  );
}

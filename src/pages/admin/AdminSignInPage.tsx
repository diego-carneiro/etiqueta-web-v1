import UserForms from "@/components/UserForms";

export default function AdminSignInPage() {
  return (
    <div className="flex h-screen bg-gray-200">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src="../img/etiquetalogolarge.png" alt="Sign In" />
      </div>

      <div className="w-full lg:w-1/3">
        <UserForms selector="sign-in" />
      </div>
    </div>
  );
}

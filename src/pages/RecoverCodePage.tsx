import UserForms from "@/components/UserForms";

export default function RecoverCodePage() {
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src="./img/etiquetalogolarge.png" />
      </div>
      <div className="w-full lg:w-1/3">
        <UserForms selector="recoverCode" />
      </div>
    </div>
  );
}

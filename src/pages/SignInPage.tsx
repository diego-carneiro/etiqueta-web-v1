import { useState } from "react";
import UserForms from "@/components/UserForms";
import WaitingApproval from "@/components/WaitingApproval";

export default function SignInPage() {
  const [isWaitingApproval, setIsWaitingApproval] = useState(false);

  if (isWaitingApproval) {
    return <WaitingApproval onBack={() => setIsWaitingApproval(false)} />;
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src="./img/etiquetalogolarge.png" alt="Sign In" />
      </div>

      <div className="w-full lg:w-1/3">
        <UserForms
          selector="sign-in"
          onWaitingApproval={() => setIsWaitingApproval(true)}
        />
      </div>
    </div>
  );
}

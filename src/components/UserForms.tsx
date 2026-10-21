import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmailInput } from "@/components/ui/input/email-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { X, Eye, EyeOff } from "lucide-react";
import { useCompanyLogin, useAdminLogin } from "@/api/hooks/useLoginAuth";
import WaitingApproval from "./WaitingApproval";
import BrandLogo from "./BrandLogo";

type LoginResponse = {
  id: string;
  username: string;
  email: string;
  token: string;
  sessionTimeout: number;
  isActive: boolean;
  approvalStatus: number;
  approvalStatusDescription: string;
};

type UserFormsProps = {
  selector: "sign-in" | "recoverPassword" | "recoverCode" | "redefinePassword";
  onWaitingApproval?: () => void;
};

export default function UserForms({
  selector,
  onWaitingApproval,
}: UserFormsProps) {
  const inputBaseClassName =
    "bg-white text-brand-black placeholder:text-gray-500 border-none focus:ring-2 focus:ring-brand-green focus:outline-none";
  const iconInputClassName = `${inputBaseClassName} pr-10`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdmin = pathname.startsWith("/admin");

  const adminLogin = useAdminLogin();
  const companyLogin = useCompanyLogin();
  const loginMutation = isAdmin ? adminLogin : companyLogin;

  if (isWaitingApproval) {
    return <WaitingApproval onBack={() => setIsWaitingApproval(false)} />;
  }

  const handleLogin = () => {
    if (!email.trim() || !isEmailValid) {
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data: LoginResponse) => {
          if (
            data?.approvalStatus === 0 &&
            data?.approvalStatusDescription === "WaitingApproval"
          ) {
            onWaitingApproval?.();
            return;
          }

          if (!isAdmin && data?.id) {
            localStorage.setItem("companyId", data.id);
          }

          navigate(isAdmin ? "/admin/app/dashboard" : "/app/dashboard");
        },
        onError: () => setIsErrorDialogOpen(true),
      },
    );
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-brand">
      {selector === "sign-in" && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center justify-center mb-72">
          <BrandLogo variant="symbol" className="w-24 text-brand-light" />
        </div>
      )}

      <div className="w-full max-w-[420px] px-6">
        {selector === "sign-in" && (
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="flex flex-col gap-4 p-0">
              <p className="font-display text-white mt-30 mb-6 text-center text-xl font-bold">
                {isAdmin
                  ? "Entre com sua conta de administrador"
                  : "Acesse sua loja"}
              </p>
              <div>
                <Label htmlFor="email" className="text-white mb-2">
                  E-mail
                </Label>
                <EmailInput
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={setEmail}
                  onValidityChange={setIsEmailValid}
                  className={`${inputBaseClassName} mt-0`}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white mb-2">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={iconInputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleLogin}
                disabled={loginMutation.isPending}
                className="bg-brand-green hover:bg-brand-green-hover text-brand-black font-bold rounded-full mt-2"
              >
                {loginMutation.isPending ? "Entrando..." : "Entrar"}
              </Button>

              {!isAdmin && (
                <Button
                  onClick={() => navigate("/sign-up")}
                  className="bg-transparent border-2 border-brand-light text-brand-light hover:bg-white/10 font-bold rounded-full"
                >
                  Cadastrar
                </Button>
              )}

              <div className="text-center mt-1 font-bold">
                <Link
                  to="/recover-password"
                  className="text-white text-sm hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {selector === "recoverPassword" && (
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="flex flex-col gap-4 p-0">
              <p className="text-center text-white text-sm">
                Insira o e-mail utilizado para acessar a conta
              </p>
              <div>
                <Label htmlFor="email" className="text-white mb-2">
                  E-mail
                </Label>
                <EmailInput
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={setEmail}
                  onValidityChange={setIsEmailValid}
                  className={`${inputBaseClassName} mt-0`}
                  required
                />
              </div>
              <Button
                onClick={() => {
                  if (!email.trim() || !isEmailValid) {
                    return;
                  }

                  navigate("/recover-code");
                }}
                className="bg-brand-green hover:bg-brand-green-hover text-brand-black font-bold rounded-full"
              >
                Recuperar
              </Button>
              <Button
                onClick={() => navigate("/sign-in")}
                className="bg-transparent border-2 border-brand-light text-brand-light hover:bg-white/10 font-bold rounded-full"
              >
                Voltar para o login
              </Button>
            </CardContent>
          </Card>
        )}

        {selector === "recoverCode" && (
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="flex flex-col gap-4 p-0">
              <p className="text-center text-white text-sm">
                Insira o código que foi enviado ao e-mail digitado anteriormente
              </p>
              <div>
                <Label htmlFor="code" className="text-white mb-2">
                  Código
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Digite o código"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={inputBaseClassName}
                />
              </div>
              <Button
                onClick={() => navigate("/redefine-password")}
                className="bg-brand-green hover:bg-brand-green-hover text-brand-black font-bold rounded-full"
              >
                Avançar
              </Button>
            </CardContent>
          </Card>
        )}

        {selector === "redefinePassword" && (
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="flex flex-col gap-4 p-0">
              <div>
                <Label htmlFor="password" className="text-white mb-2">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={iconInputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-white mb-2">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite sua senha novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={iconInputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
              <Button
                onClick={() => alert("Senha alterada com sucesso!")}
                className="bg-brand-green hover:bg-brand-green-hover text-brand-black font-bold rounded-full"
              >
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-destructive">
                Erro ao fazer login
              </DialogTitle>
              <DialogClose asChild>
                <button className="text-destructive hover:text-red-600">
                  <X className="h-5 w-5" />
                </button>
              </DialogClose>
            </div>
            <DialogDescription>
              Verifique seu e-mail e senha e tente novamente.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

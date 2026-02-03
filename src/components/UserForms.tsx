import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useEmployeeLogin, useAdminLogin } from "@/api/hooks/loginAuth";

type Props = {
  selector: "sign-in" | "recoverPassword" | "recoverCode" | "redefinePassword";
  setRecoverStage?: (stage: string) => void;
  userType?: "employee" | "admin";
};

export default function UserForms({ selector, userType = "employee" }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const adminLogin = useAdminLogin();
  const employeeLogin = useEmployeeLogin();
  const loginMutation = userType === "admin" ? adminLogin : employeeLogin;

  const handleLogin = () => {
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem(
            userType === "admin" ? "adminToken" : "token",
            data.token
          );
          navigate(
            userType === "admin" ? "/admin/app/dashboard" : "/app/dashboard"
          );
        },
        onError: () => setIsErrorDialogOpen(true),
      }
    );
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-[#3358A5]">
      {selector === "sign-in" && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center justify-center mb-72">
          <img src="../img/etiquetalogomedium.png" alt="Logo" />
        </div>
      )}

      <div className="w-full max-w-[420px] px-6">
        {selector === "sign-in" && (
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="flex flex-col gap-4 p-0">
            <p className="text-white mt-30 mb-6 text-center text-lg font-bold">Entre com sua conta de funcionário</p>
              <div>
                <Label htmlFor="email" className="text-white mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-gray-800 placeholder:text-gray-500"
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
                    className="bg-white text-gray-800 placeholder:text-gray-500 pr-10"
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
                className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full mt-2"
              >
                {loginMutation.isPending ? "Entrando..." : "Entrar"}
              </Button>

              {userType === "employee" && (
                <Button
                  onClick={() => navigate("/sign-up")}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full"
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
                Insira o Email utilizado para acessar a conta
              </p>
              <div>
                <Label htmlFor="email" className="text-white mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-gray-800 placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={() => navigate("/recover-code")}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full"
              >
                Recuperar
              </Button>
            </CardContent>
          </Card>
        )}

        {selector === "recoverCode" && (
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="flex flex-col gap-4 p-0">
              <p className="text-center text-white text-sm">
                Insira o código que foi enviado ao Email digitado anteriormente
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
                  className="bg-white text-gray-800 placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={() => navigate("/redefine-password")}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full"
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
                    className="bg-white text-gray-800 placeholder:text-gray-500 pr-10"
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
                    className="bg-white text-gray-800 placeholder:text-gray-500 pr-10"
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
                className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full"
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateEmployee } from "@/api/hooks/useEmployee";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EmployeeRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    taxId: "",
    serviceCenterId: "",
  });

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { mutate, isPending } = useCreateEmployee();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        setFormData({
          name: "",
          email: "",
          password: "",
          taxId: "",
          serviceCenterId: "",
        });
        navigate("/app/employees");
      },
      onError: () => {
        setShowErrorDialog(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          taxId: "",
          serviceCenterId: "",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-8 mt-16">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-100 mx-auto mt-30"
      >
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Nome</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite um nome"
            className="bg-white border-none shadow-sm"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemplo@exemplo.com"
            className="bg-white border-none shadow-sm"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Senha</label>
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Sua senha"
            className="bg-white border-none shadow-sm"
          />
        </div>

        <div className="flex flex-col space-y-1 mt-16">
          <label className="text-sm font-medium text-gray-700">CPF</label>
          <Input
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            placeholder="000.000.000-00"
            className="bg-white border-none shadow-sm"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Código da Loja
          </label>
          <Input
            name="serviceCenterId"
            value={formData.serviceCenterId}
            onChange={handleChange}
            placeholder="Digite o código da loja"
            className="bg-white border-none shadow-sm"
          />
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-green-500 text-white hover:bg-green-600 w-full"
          >
            {isPending ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </div>
      </form>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erro ao cadastrar funcionário</DialogTitle>
            <p>
              Houve um problema ao tentar cadastrar o funcionário. Tente
              novamente.
            </p>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

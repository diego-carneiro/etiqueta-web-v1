import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UsersRound } from "lucide-react";
import { useEmployees, useDeleteEmployee } from "@/api/hooks/useEmployee";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function EmployeesPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useEmployees();
  const deleteEmployee = useDeleteEmployee();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editStep, setEditStep] = useState<"choose" | "email" | "password">(
    "choose",
  );
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    name: string;
    email?: string;
  } | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleConfirmDelete = () => {
    if (selectedEmployee) {
      deleteEmployee.mutate(selectedEmployee.id);
      setDialogOpen(false);
    }
  };

  const handleEditClick = (employee: {
    id: string;
    name: string;
    email: string;
  }) => {
    setSelectedEmployee(employee);
    setEditStep("choose");
    setEditDialogOpen(true);
  };

  const handleSubmitEdit = () => {
    if (!selectedEmployee) return;
    if (editStep === "email") {
      console.log("Atualizando e-mail:", newEmail);
    } else if (editStep === "password") {
      console.log("Atualizando senha:", newPassword);
    }
    setEditDialogOpen(false);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <Card className="flex-row items-center bg-white border-none shadow-sm pr-10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <UsersRound className="text-green-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {data?.data?.length ?? 0}
              </p>
              <p className="text-sm text-gray-500">Funcionários</p>
            </div>
          </CardContent>
          <Button
            className="bg-green-500 text-white hover:bg-green-600 px-6 py-2 text-sm font-semibold rounded-md"
            onClick={() => navigate("/app/employee-register")}
          >
            Cadastrar
          </Button>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-gray-600 font-semibold text-left">
                Nome
              </TableHead>
              <TableHead className="text-gray-600 font-semibold text-left">
                E-mail
              </TableHead>
              <TableHead className="text-gray-600 font-semibold text-center w-24">
                Editar
              </TableHead>
              <TableHead className="text-gray-600 font-semibold text-center w-24">
                Remover
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-gray-400"
                >
                  Carregando funcionários...
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map(
                (employee: { id: string; name: string; email: string }) => (
                  <TableRow
                    key={employee.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <TableCell className="py-4">{employee.name}</TableCell>
                    <TableCell className="py-4">{employee.email}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(employee)}
                      >
                        <Pencil className="h-4 w-4 text-gray-500 hover:text-blue-500 transition-colors" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedEmployee({
                            id: employee.id,
                            name: employee.name,
                          });
                          setDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end pt-6 text-sm text-gray-500 space-x-2">
        <span className="cursor-pointer hover:text-blue-600 font-medium">
          1
        </span>
        <span className="cursor-pointer hover:text-blue-600 font-medium">
          2
        </span>
        <span className="cursor-pointer hover:text-blue-600 font-medium">
          Próx
        </span>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-none shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Remover Funcionário
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Deseja remover o funcionário:{" "}
              <strong>{selectedEmployee?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={!selectedEmployee}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Sim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-white border-none shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-600 mb-10">
              Editando dados de: {selectedEmployee?.name}
            </DialogTitle>
            <div className="flex justify-center">
              {editStep === "choose" && (
                <DialogDescription className="text-gray-600 text-lg font-semibold">
                  Deseja editar e-mail ou senha?
                </DialogDescription>
              )}
            </div>
          </DialogHeader>

          {editStep === "choose" && (
            <div className="flex justify-center gap-4 mt-4">
              <Button
                className="bg-green-500 text-white hover:bg-green-600 px-6 py-2"
                onClick={() => setEditStep("email")}
              >
                E-mail
              </Button>
              <Button
                className="bg-green-500 text-white hover:bg-green-600 px-6 py-2"
                onClick={() => setEditStep("password")}
              >
                Senha
              </Button>
            </div>
          )}

          {editStep === "email" && (
            <div className="mt-4 space-y-3">
              <label className="text-gray-700 font-medium">Novo e-mail</label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Digite o novo e-mail"
                className="border-none focus:ring-2 focus:ring-gray-200 focus:outline-none mt-4"
              />
            </div>
          )}

          {editStep === "password" && (
            <div className="mt-4 space-y-3">
              <label className="text-gray-700 font-medium">Nova senha</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                className="border-none focus:ring-2 focus:ring-gray-200 focus:outline-none mt-4"
              />
              <label className="text-gray-700 font-medium">
                Confirme a nova senha
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                className="border-none focus:ring-2 focus:ring-gray-200 focus:outline-none mt-4"
              />
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              variant="ghost"
              onClick={() => setEditDialogOpen(false)}
              className="text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            {editStep !== "choose" && (
              <Button
                onClick={handleSubmitEdit}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Salvar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

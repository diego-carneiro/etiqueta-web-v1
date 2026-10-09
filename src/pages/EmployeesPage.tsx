import { useMemo, useState } from "react";
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
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
  UsersRound,
} from "lucide-react";
import {
  useDeleteEmployee,
  useEmployees,
  useUpdateEmployee,
} from "@/api/hooks/useEmployee";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EmailInput } from "@/components/ui/input/email-input";

export default function EmployeesPage() {
  const navigate = useNavigate();
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useEmployees({
    paginationHeaders: {
      page: currentPage,
      pageSize: PAGE_SIZE,
    },
  });
  const deleteEmployee = useDeleteEmployee();
  const updateEmployee = useUpdateEmployee();

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
  const [editError, setEditError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const employees = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const visiblePages = useMemo(
    () =>
      Array.from({ length: totalPages }, (_, i) => i + 1).filter(
        (page) =>
          page === 1 ||
          page === totalPages ||
          Math.abs(page - currentPage) <= 1,
      ),
    [currentPage, totalPages],
  );

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
    setEditError("");
    setNewEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setIsEmailValid(true);
    setEditDialogOpen(true);
  };

  const handleSubmitEdit = () => {
    if (!selectedEmployee) return;

    if (editStep === "email") {
      const emailValue = newEmail.trim();

      if (!emailValue) {
        setEditError("Informe o novo e-mail.");
        return;
      }

      if (!isEmailValid) {
        return;
      }

      updateEmployee.mutate(
        {
          id: selectedEmployee.id,
          data: { email: emailValue, password: "" },
        },
        {
          onSuccess: () => {
            setEditDialogOpen(false);
            setEditError("");
          },
        },
      );
    } else if (editStep === "password") {
      if (!newPassword) {
        setEditError("Informe a nova senha.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setEditError("As senhas não coincidem.");
        return;
      }

      updateEmployee.mutate(
        {
          id: selectedEmployee.id,
          data: { email: "", password: newPassword },
        },
        {
          onSuccess: () => {
            setEditDialogOpen(false);
            setEditError("");
          },
        },
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <Card className="flex-row items-center bg-white border-none shadow-sm pr-10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <UsersRound className="text-green-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {isLoading ? "..." : totalCount}
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto p-4">
          <Table className="w-full border-separate [border-spacing:0_14px]">
            <TableHeader className="[&_tr]:border-0">
              <TableRow className="border-0">
                <TableHead>#</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Editar</TableHead>
                <TableHead>Remover</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-400 py-8 border-0"
                  >
                    Carregando funcionários...
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-400 py-8 border-0"
                  >
                    Nenhum funcionário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee, index) => (
                  <TableRow
                    key={employee.id}
                    className="cursor-pointer border-0 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(employee)}
                      >
                        <Pencil className="h-4 w-4 text-gray-500 hover:text-blue-500 transition-colors" />
                      </Button>
                    </TableCell>
                    <TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Página {currentPage} de {totalPages} &mdash; {totalCount}{" "}
              funcionários no total
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {visiblePages
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (
                    idx > 0 &&
                    typeof arr[idx - 1] === "number" &&
                    p - (arr[idx - 1] as number) > 1
                  ) {
                    acc.push("...");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="w-8 text-center text-gray-400 text-sm"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item as number)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === item
                          ? "bg-gray-800 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
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
              disabled={!selectedEmployee || deleteEmployee.isPending}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {deleteEmployee.isPending ? "Removendo..." : "Sim"}
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
              <EmailInput
                value={newEmail}
                onChange={(value) => {
                  setNewEmail(value);
                  if (editError) {
                    setEditError("");
                  }
                }}
                onValidityChange={setIsEmailValid}
                placeholder="Digite o novo e-mail"
                required
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

          {editError && (
            <p className="text-sm text-red-500 text-center">{editError}</p>
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
                disabled={updateEmployee.isPending}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {updateEmployee.isPending ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  "Salvar"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

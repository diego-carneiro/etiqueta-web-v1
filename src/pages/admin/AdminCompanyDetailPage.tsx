import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { UsersRound } from "lucide-react";
import { useCompanies } from "@/api/hooks/useCompanies";

export default function AdminCompanyDetailPage() {
  const { data, isLoading, isError } = useCompanies();
  const [view, setView] = useState<"verified" | "pending">("verified");

  const companies = data?.data ?? [];

  const verifiedCompanies = useMemo(
    () => companies.filter((c) => c.approvalStatus === 1),
    [companies],
  );

  const pendingCompanies = useMemo(
    () => companies.filter((c) => c.approvalStatus === 0),
    [companies],
  );

  const currentCompanies =
    view === "verified" ? verifiedCompanies : pendingCompanies;

  if (isLoading) return <div className="p-12">Carregando...</div>;
  if (isError) return <div className="p-12">Erro ao carregar empresas</div>;

  return (
    <div className="flex flex-col h-screen overflow-hidden p-12">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <Card
            onClick={() => setView("verified")}
            className={`cursor-pointer bg-white border-none shadow-sm transition-all hover:shadow-md ${
              view === "verified" ? "ring-2 ring-brand" : ""
            }`}
          >
            <CardContent className="flex items-center gap-3 px-5 py-3">
              <div className="flex items-center justify-center w-9 h-9 bg-brand-light rounded-lg">
                <UsersRound className="text-brand h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-base font-extrabold text-brand-black">
                  {verifiedCompanies.length}
                </p>
                <p className="text-sm text-gray-500">Lojas verificadas</p>
              </div>
            </CardContent>
          </Card>

          <Card
            onClick={() => setView("pending")}
            className={`cursor-pointer bg-white border-none shadow-sm transition-all hover:shadow-md ${
              view === "pending" ? "ring-2 ring-yellow-400" : ""
            }`}
          >
            <CardContent className="flex items-center gap-3 px-5 py-3">
              <div className="flex items-center justify-center w-9 h-9 bg-yellow-100 rounded-lg">
                <UsersRound className="text-yellow-600 h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-base font-extrabold text-brand-black">
                  {pendingCompanies.length}
                </p>
                <p className="text-sm text-gray-500">Lojas pendentes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead>Nome da loja</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    {company.tradeName || company.legalName}
                  </TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        company.approvalStatus === 1
                          ? "bg-brand-light text-brand"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {company.approvalStatus === 1 ? "Verificado" : "Pendente"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

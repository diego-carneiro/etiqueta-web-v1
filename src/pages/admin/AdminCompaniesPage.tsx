import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2, UsersRound } from "lucide-react";
import { useApproveCompany, useCompanies } from "@/api/hooks/useCompanies";

const PAGE_SIZE = 10;

export default function AdminCompaniesPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<"verified" | "pending">("verified");
  const [page, setPage] = useState(1);
  const [approvingCompanyId, setApprovingCompanyId] = useState<string | null>(
    null,
  );

  const { data, isLoading, isError } = useCompanies(page, PAGE_SIZE);
  const approveCompanyMutation = useApproveCompany();

  const verifiedCount = data?.verifiedCount ?? 0;
  const pendingCount = data?.pendingCount ?? 0;
  const totalItems = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const filteredCompanies = useMemo(() => {
    const companies = data?.data ?? [];
    return companies.filter((company) =>
      view === "verified"
        ? company.approvalStatus === 1
        : company.approvalStatus === 0,
    );
  }, [data?.data, view]);

  const handleViewChange = (newView: "verified" | "pending") => {
    setView(newView);
    setPage(1);
  };

  const handleCompanyClick = (companyId: string | number) => {
    navigate(`/company-detail/${companyId}`);
  };

  const handleApproveCompany = (companyId: string) => {
    setApprovingCompanyId(companyId);
    approveCompanyMutation.mutate(companyId, {
      onSettled: () => setApprovingCompanyId(null),
    });
  };

  if (isLoading) return <div className="p-12">Carregando...</div>;
  if (isError) return <div className="p-12">Erro ao carregar empresas</div>;

  return (
    <div className="flex flex-col h-screen overflow-hidden p-12">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <Card
            onClick={() => handleViewChange("verified")}
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
                  {verifiedCount}
                </p>
                <p className="text-sm text-gray-500">Lojas verificadas</p>
              </div>
            </CardContent>
          </Card>

          <Card
            onClick={() => handleViewChange("pending")}
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
                  {pendingCount}
                </p>
                <p className="text-sm text-gray-500">Lojas pendentes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <Table className="w-full border-separate [border-spacing:0_14px]">
            <TableHeader className="[&_tr]:border-0">
              <TableRow className="border-0">
                <TableHead>Nome da loja</TableHead>
                <TableHead>E-mail</TableHead>
                {view === "pending" && <TableHead>Ação</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow
                  key={company.id}
                  onClick={() => handleCompanyClick(company.id)}
                  className="cursor-pointer border-0 hover:bg-brand-light/60 transition-colors"
                >
                  <TableCell>
                    {company.tradeName || company.legalName}
                  </TableCell>
                  <TableCell>{company.email}</TableCell>
                  {view === "pending" && (
                    <TableCell>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleApproveCompany(company.id);
                        }}
                        disabled={
                          approveCompanyMutation.isPending &&
                          approvingCompanyId === company.id
                        }
                        className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {approveCompanyMutation.isPending &&
                        approvingCompanyId === company.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Aprovar"
                        )}
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))}

              {filteredCompanies.length === 0 && (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={view === "pending" ? 3 : 2}
                    className="text-center text-gray-400 py-8 border-0"
                  >
                    {view === "verified"
                      ? "Nenhuma loja verificada encontrada."
                      : "Nenhuma loja pendente encontrada."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Página {page} de {totalPages} &mdash; {totalItems} empresas no
              total
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (
                    idx > 0 &&
                    typeof arr[idx - 1] === "number" &&
                    (p as number) - (arr[idx - 1] as number) > 1
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
                      onClick={() => setPage(item as number)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === item
                          ? "bg-brand text-white"
                          : "text-gray-600 hover:bg-brand-light"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

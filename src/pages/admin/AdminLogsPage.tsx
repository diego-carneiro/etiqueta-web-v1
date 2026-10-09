import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2, UsersRound } from "lucide-react";
import { useLabels } from "@/api/hooks/useLabels";

export default function AdminLogsPage() {
  const PAGE_SIZE = 10;
  const [employeeNameInput, setEmployeeNameInput] = useState("");
  const [vehiclePlateInput, setVehiclePlateInput] = useState("");
  const [employeeNameFilter, setEmployeeNameFilter] = useState("");
  const [vehiclePlateFilter, setVehiclePlateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // UI is 1-based

  const {
    data: labelsResponse,
    isLoading,
    isError,
    error,
  } = useLabels({
    params: {
      limit: PAGE_SIZE,
      employeeName: employeeNameFilter || undefined,
      vehicleLicensePlate: vehiclePlateFilter || undefined,
    },
    paginationHeaders: {
      page: currentPage,
      pageSize: PAGE_SIZE,
    },
  });
  const logs = labelsResponse?.data ?? [];
  const totalPages = labelsResponse?.totalPages ?? 0;
  const totalCount = labelsResponse?.totalCount ?? 0;

  const handleSearch = () => {
    setEmployeeNameFilter(employeeNameInput.trim());
    setVehiclePlateFilter(vehiclePlateInput.trim());
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMileage = (mileage: number) => {
    if (!Number.isFinite(mileage)) {
      return "-";
    }

    return String(Math.trunc(mileage));
  };

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

  if (isError) {
    return (
      <div className="flex flex-col h-screen bg-gray-100 p-12 overflow-hidden">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erro ao carregar logs: {error?.message || "Erro desconhecido"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <Card className="bg-white border-none shadow-sm w-46 h-24 flex-shrink-0 flex items-center justify-center ">
          <CardContent className="flex items-center justify-center gap-4 p-5">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <UsersRound className="text-green-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
              <p className="text-sm text-gray-500">Registros</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              placeholder="Digite o nome do funcionário"
              value={employeeNameInput}
              onChange={(e) => setEmployeeNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-64 bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placa
            </label>
            <input
              type="text"
              placeholder="Digite a placa do veículo"
              value={vehiclePlateInput}
              onChange={(e) => setVehiclePlateInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-64 bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="mt-6 bg-green-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </span>
            ) : (
              "Buscar"
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto p-4">
          <Table className="w-full border-separate [border-spacing:0_14px]">
            <TableHeader className="[&_tr]:border-0">
              <TableRow className="border-0">
                <TableHead>Nome</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>KM</TableHead>
                <TableHead>Itens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-400 py-8 border-0"
                  >
                    Carregando logs...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-400 py-8 border-0"
                  >
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log, index) => (
                  <TableRow
                    key={`${log.id}-${index}`}
                    className="cursor-pointer border-0 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>{log.employeeName}</TableCell>
                    <TableCell>{log.vehicleLicensePlate}</TableCell>
                    <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                    <TableCell>{formatMileage(log.mileage)}</TableCell>
                    <TableCell>{log.itemsApplied?.length ?? 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Página {currentPage} de {totalPages} &mdash; {totalCount} registros
              no total
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                      onClick={() => handlePageChange(item as number)}
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
                  handlePageChange(Math.min(totalPages, currentPage + 1))
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
    </div>
  );
}

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLabelsHistory } from "@/api/hooks/useLabels";

export default function LogsPage() {
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [vehiclePlateInput, setVehiclePlateInput] = useState("");
  const [employeeIdFilter, setEmployeeIdFilter] = useState("");
  const [vehiclePlateFilter, setVehiclePlateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: historyData = [],
    isLoading,
    isError,
    error,
  } = useLabelsHistory();

  const sortedData = useMemo(() => {
    return [...historyData].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [historyData]);

  const filteredData = useMemo(() => {
    return sortedData.filter((log) => {
      const matchesEmployee =
        !employeeIdFilter.trim() ||
        (log.employeeId &&
          log.employeeId
            .toLowerCase()
            .includes(employeeIdFilter.toLowerCase()));
      const matchesVehicle =
        !vehiclePlateFilter.trim() ||
        (log.vehicleLicensePlate &&
          log.vehicleLicensePlate
            .toLowerCase()
            .includes(vehiclePlateFilter.toLowerCase()));
      return matchesEmployee && matchesVehicle;
    });
  }, [sortedData, employeeIdFilter, vehiclePlateFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleFilter = () => {
    setEmployeeIdFilter(employeeIdInput.trim());
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

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <span
          key={i}
          className={`cursor-pointer hover:text-blue-600 font-medium ${
            i === currentPage ? "text-blue-600 font-semibold" : "text-gray-500"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }
    return (
      <div className="flex justify-end pt-6 text-sm text-gray-500 space-x-2">
        {pages}
        {currentPage < totalPages && (
          <span
            className="cursor-pointer hover:text-blue-600 font-medium"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Próx
          </span>
        )}
      </div>
    );
  };

  if (isError) {
    return (
      <div className="p-10 bg-gray-100 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erro ao carregar histórico: {error?.message || "Erro desconhecido"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-end gap-4 w-140">
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">
            ID do Funcionário
          </label>
          <Input
            placeholder="Digite o ID"
            className="bg-white border-none focus:ring-2 focus:ring-gray-200 focus:outline-none"
            value={employeeIdInput}
            onChange={(e) => setEmployeeIdInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">
            Placa do veículo
          </label>
          <Input
            placeholder="Digite a placa"
            className="bg-white border-none focus:ring-2 focus:ring-gray-200 focus:outline-none"
            value={vehiclePlateInput}
            onChange={(e) => setVehiclePlateInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          />
        </div>

        <Button
          className="bg-green-500 text-white hover:bg-green-600 font-semibold px-6 py-2 rounded-md"
          onClick={handleFilter}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </>
          ) : (
            "Buscar"
          )}
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-gray-600 font-semibold text-left">
                Funcionário
              </TableHead>
              <TableHead className="text-gray-600 font-semibold text-left">
                Placa do Veículo
              </TableHead>
              <TableHead className="text-gray-600 font-semibold text-left">
                Data e Hora
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-6 text-gray-400"
                >
                  Carregando histórico...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-6 text-gray-500"
                >
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((log, index) => (
                <TableRow
                  key={`${log.employeeId}-${log.vehicleId}-${index}`}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <TableCell className="py-4">{log.employeeName}</TableCell>
                  <TableCell className="py-4">
                    {log.vehicleLicensePlate}
                  </TableCell>
                  <TableCell className="py-4">
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredData.length > 0 && renderPagination()}

      {filteredData.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Mostrando {paginatedData.length} de {filteredData.length} registros
        </div>
      )}
    </div>
  );
}

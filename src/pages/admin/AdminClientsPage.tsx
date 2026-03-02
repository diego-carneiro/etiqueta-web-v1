import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { UsersRound, ChevronLeft, ChevronRight } from "lucide-react";

import { getCustomerData } from "@/api/services/customerService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  isMain: boolean;
}

interface Customer {
  id: string;
  name: string;
  approvalStatus: number;
  approvalStatusDescription: string;
  vehicles: Vehicle[];
}

interface CustomerApiResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  data: Customer[];
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

function getMainVehicle(vehicles: Vehicle[]) {
  return vehicles?.find((v) => v.isMain) ?? vehicles?.[0] ?? null;
}

export default function AdminClientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery<CustomerApiResponse>({
    queryKey: ["customers", page],
    queryFn: () => getCustomerData({ page, pageSize: 25 }),
    placeholderData: (prev) => prev,
  });

  // Counts come from the API — no local filtering needed
  const approvedCount = data?.approvedCount ?? 0;
  const pendingCount = data?.pendingCount ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const filteredClients = useMemo(() => {
    const clients = data?.data ?? [];
    if (!search.trim()) return clients;
    const lower = search.toLowerCase();
    return clients.filter((c) => c.name.toLowerCase().includes(lower));
  }, [data, search]);

  function handlePageChange(next: number) {
    if (next < 1 || next > totalPages) return;
    setPage(next);
  }

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] p-12 overflow-hidden gap-10">
      <div className="flex justify-start gap-6">
        <Card className="w-60 bg-white shadow-sm border-none">
          <CardContent className="px-5 py-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
              <UsersRound className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">
                {isLoading ? "..." : approvedCount}
              </p>
              <p className="text-sm text-gray-500">Clientes cadastrados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-60 bg-white shadow-sm border-none">
          <CardContent className="px-5 py-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-xl">
              <UsersRound className="text-yellow-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">
                {isLoading ? "..." : pendingCount}
              </p>
              <p className="text-sm text-gray-500">Clientes pendentes</p>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="flex flex-col ml-auto">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Buscar cliente
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Digite o nome"
            className="w-56 bg-white border border-gray-200 rounded-lg px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto max-h-[calc(100vh-320px)] p-6">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-600 font-semibold">
                  Nome
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  Carro Principal
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  Placa
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-gray-500"
                  >
                    Carregando clientes...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-red-500"
                  >
                    Erro ao carregar clientes. Tente novamente.
                  </TableCell>
                </TableRow>
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-gray-500"
                  >
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((customer) => {
                  const vehicle = getMainVehicle(customer.vehicles);
                  return (
                    <TableRow
                      key={customer.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="py-3">{customer.name}</TableCell>
                      <TableCell className="py-3">
                        {vehicle ? `${vehicle.brand} ${vehicle.model}` : "-"}
                      </TableCell>
                      <TableCell className="py-3">
                        {vehicle?.licensePlate ?? "-"}
                      </TableCell>
                      <TableCell className="py-3">
                        <StatusBadge
                          description={customer.approvalStatusDescription}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center h-12 px-6 border-t border-gray-100 text-sm text-gray-500">
          <span>
            {!isLoading && data && (
              <>
                {(page - 1) * (data.pageSize || 25) + 1}–
                {Math.min(page * (data.pageSize || 25), data.totalCount)} de{" "}
                {data.totalCount} clientes
              </>
            )}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => handlePageChange(n)}
                className={`w-7 h-7 rounded text-sm transition-colors ${
                  n === page
                    ? "bg-yellow-400 text-white font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ description }: { description: string }) {
  const isApproved =
    description?.toLowerCase().includes("aprovado") ||
    description?.toLowerCase().includes("verificado");
  const isPending = description?.toLowerCase().includes("pendente");

  const style = isApproved
    ? "bg-green-50 text-green-600"
    : isPending
      ? "bg-yellow-50 text-yellow-600"
      : "bg-gray-100 text-gray-500";

  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${style}`}>
      {description ?? "—"}
    </span>
  );
}

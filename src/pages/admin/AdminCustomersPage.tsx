import { useMemo, useState } from "react";
import { UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomer } from "@/api/hooks/useCustomer";
import { listCustomers, type Customer } from "@/api/services/customerService";
import { SearchRouteInput } from "@/components/ui/input/search-route-input";

const PAGE_SIZE = 10;

type ClientsView = "approved" | "pending";

function getMainVehicle(vehicles: Customer["vehicles"]) {
  return vehicles?.find((vehicle) => vehicle.isMain) ?? vehicles?.[0] ?? null;
}

function isPendingCustomer(customer: Customer) {
  return (
    customer.approvalStatus === 0 ||
    customer.approvalStatusDescription?.toLowerCase().includes("pend")
  );
}

function isApprovedCustomer(customer: Customer) {
  return !isPendingCustomer(customer);
}

export default function AdminCustomersPage() {
  const [view, setView] = useState<ClientsView>("approved");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedCustomers, setSearchedCustomers] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: customersResponse,
    isLoading,
    isError,
    error,
  } = useCustomer({
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const approvedCount = customersResponse?.approvedCount ?? 0;
  const pendingCount = customersResponse?.pendingCount ?? 0;
  const totalPages = customersResponse?.totalPages ?? 0;

  const customersSource = searchTerm
    ? searchedCustomers
    : (customersResponse?.data ?? []);

  const clientsByView = useMemo(() => {
    return customersSource.filter((customer) =>
      view === "approved"
        ? isApprovedCustomer(customer)
        : isPendingCustomer(customer),
    );
  }, [customersSource, view]);
  const visibleClients = searchTerm ? clientsByView : clientsByView.slice(0, PAGE_SIZE);
  const isPageLoading = isLoading || isSearching;

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

  const handleViewChange = (nextView: ClientsView) => {
    if (nextView === view) {
      return;
    }

    setView(nextView);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  if (isError) {
    return (
      <div className="flex flex-col h-screen bg-brand-light p-12 overflow-hidden">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erro ao carregar clientes: {error?.message || "Erro desconhecido"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-brand-light p-8 gap-6 overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <Card
            onClick={() => handleViewChange("approved")}
            className={`cursor-pointer bg-white border-none shadow-sm transition-all hover:shadow-md ${
              view === "approved" ? "ring-2 ring-brand" : ""
            }`}
          >
            <CardContent className="flex items-center gap-4 px-5 py-4">
              <div className="flex items-center justify-center w-10 h-10 bg-brand-light rounded-full">
                <UsersRound className="text-brand h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xl font-extrabold text-brand-black">
                  {isLoading ? "..." : approvedCount}
                </p>
                <p className="text-sm text-gray-500">Clientes cadastrados</p>
              </div>
            </CardContent>
          </Card>

          <Card
            onClick={() => handleViewChange("pending")}
            className={`cursor-pointer bg-white border-none shadow-sm transition-all hover:shadow-md ${
              view === "pending" ? "ring-2 ring-yellow-400" : ""
            }`}
          >
            <CardContent className="flex items-center gap-4 px-5 py-4">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                <UsersRound className="text-yellow-600 h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xl font-extrabold text-brand-black">
                  {isLoading ? "..." : pendingCount}
                </p>
                <p className="text-sm text-gray-500">Clientes pendentes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-end gap-3">
          <SearchRouteInput<Customer>
            label="Buscar cliente"
            placeholder="Digite o nome"
            minLength={1}
            debounceMs={250}
            fetcher={(query) => listCustomers({ query })}
            onLoadingChange={setIsSearching}
            onResults={(results, query) => {
              setSearchTerm(query);
              setSearchedCustomers(results);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 pt-5 pb-2 border-b border-gray-100">
          <h2 className="text-sm font-bold text-brand-black">
            {view === "approved"
              ? "Clientes Cadastrados"
              : "Clientes Pendentes"}
          </h2>
        </div>

        <div className="flex-1 min-h-0 p-4 overflow-hidden">
          <Table className="w-full text-[15px]">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-600 font-semibold">
                  Nome
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  Carro principal
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  Placa
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPageLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-gray-500"
                  >
                    Carregando clientes...
                  </TableCell>
                </TableRow>
              ) : visibleClients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-gray-500"
                  >
                    {searchTerm
                      ? "Nenhum cliente encontrado para esta busca."
                      : view === "approved"
                        ? "Nenhum cliente cadastrado encontrado."
                        : "Nenhum cliente pendente encontrado."}
                  </TableCell>
                </TableRow>
              ) : (
                visibleClients.map((customer) => {
                  const mainVehicle = getMainVehicle(customer.vehicles);

                  return (
                    <TableRow
                      key={customer.id}
                      className="border-b border-gray-100 hover:bg-brand-light/60 transition-colors"
                    >
                      <TableCell className="py-4">{customer.name}</TableCell>
                      <TableCell className="py-4">
                        {mainVehicle
                          ? `${mainVehicle.brand} ${mainVehicle.model}`
                          : "-"}
                      </TableCell>
                      <TableCell className="py-4">
                        {mainVehicle?.licensePlate ?? "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {!searchTerm && totalPages > 1 && (
          <div className="flex justify-end items-center h-12 px-6 border-t border-gray-100 text-sm text-gray-500 space-x-2">
            {visiblePages
              .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                  acc.push("...");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className="text-gray-400 px-1">
                    ...
                  </span>
                ) : (
                  <span
                    key={item}
                    className={`cursor-pointer hover:text-brand ${
                      item === currentPage ? "text-brand font-semibold" : ""
                    }`}
                    onClick={() => handlePageChange(item as number)}
                  >
                    {item}
                  </span>
                ),
              )}

            {currentPage < totalPages && (
              <span
                className="cursor-pointer hover:text-brand"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Próx
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

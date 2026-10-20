import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEmployees } from "@/api/hooks/useEmployee";
import {
  listEmployees,
  type Employee,
} from "@/api/services/employeeService";
import { SearchRouteInput } from "@/components/ui/input/search-route-input";

const PAGE_SIZE = 10;

export default function AdminEmployeesPage() {
  const [searchNameFilter, setSearchNameFilter] = useState("");
  const [searchStoreFilter, setSearchStoreFilter] = useState("");
  const [searchedEmployees, setSearchedEmployees] = useState<Employee[]>([]);
  const [isSearchingByName, setIsSearchingByName] = useState(false);
  const [isSearchingByStore, setIsSearchingByStore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useEmployees({
    paginationHeaders: {
      page: currentPage,
      pageSize: PAGE_SIZE,
    },
  });

  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const hasActiveSearch =
    searchNameFilter.trim().length > 0 || searchStoreFilter.trim().length > 0;

  const filteredEmployees = useMemo(
    () => (hasActiveSearch ? searchedEmployees : (data?.data ?? [])),
    [data?.data, hasActiveSearch, searchedEmployees],
  );
  const isPageLoading = isLoading || isSearchingByName || isSearchingByStore;

  const visibleEmployees = hasActiveSearch
    ? filteredEmployees
    : filteredEmployees.slice(0, PAGE_SIZE);

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

  const fetchEmployeesByFilters = (name: string, store: string) => {
    const trimmedName = name.trim();
    const trimmedStore = store.trim();

    if (!trimmedName && !trimmedStore) {
      return Promise.resolve<Employee[]>([]);
    }

    return listEmployees({
      name: trimmedName || undefined,
    });
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
          Erro ao carregar funcionários: {error?.message || "Erro desconhecido"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-scree p-8 gap-6 overflow-hidden">
      <div className="flex justify-between items-start">
        <Card className="bg-white border-none shadow-sm w-46 h-24 flex-shrink-0 flex items-center justify-center">
          <CardContent className="flex items-center justify-center gap-4 p-5">
            <div className="flex items-center justify-center w-10 h-10 bg-brand-light rounded-full">
              <UsersRound className="text-brand h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-brand-black">
                {isLoading ? "..." : totalCount}
              </p>
              <p className="text-sm text-gray-500">Funcionários</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-end gap-3">
          <SearchRouteInput<Employee>
            label="Nome"
            placeholder="Digite o nome"
            minLength={0}
            debounceMs={250}
            fetcher={(query) => fetchEmployeesByFilters(query, searchStoreFilter)}
            onLoadingChange={setIsSearchingByName}
            onResults={(results, query) => {
              setSearchNameFilter(query);
              setSearchedEmployees(results);
              setCurrentPage(1);
            }}
          />

          <SearchRouteInput<Employee>
            label="Loja"
            placeholder="Digite a loja"
            minLength={0}
            debounceMs={250}
            fetcher={(query) => fetchEmployeesByFilters(searchNameFilter, query)}
            onLoadingChange={setIsSearchingByStore}
            onResults={(results, query) => {
              setSearchStoreFilter(query);
              setSearchedEmployees(results);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 pt-5 pb-2 border-b border-gray-100">
          <h2 className="text-sm font-bold text-brand-black">Funcionários</h2>
        </div>

        <div className="overflow-y-auto p-4">
          <Table className="w-full border-separate [border-spacing:0_14px]">
            <TableHeader className="[&_tr]:border-0">
              <TableRow className="border-0">
                <TableHead>#</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Loja</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPageLoading ? (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={4}
                    className="text-center text-gray-400 py-8 border-0"
                  >
                    Carregando funcionários...
                  </TableCell>
                </TableRow>
              ) : visibleEmployees.length === 0 ? (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={4}
                    className="text-center text-gray-400 py-8 border-0"
                  >
                    Nenhum funcionário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                visibleEmployees.map((employee, index) => (
                  <TableRow
                    key={employee.id}
                    className="cursor-pointer border-0 hover:bg-brand-light/60 transition-colors"
                  >
                    <TableCell>
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.companyName || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!hasActiveSearch && totalPages > 1 && (
          <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Página {currentPage} de {totalPages} &mdash; {totalCount}{" "}
              funcionários no total
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                          ? "bg-brand text-white"
                          : "text-gray-600 hover:bg-brand-light"
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

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsersRound } from "lucide-react";

export default function AdminEmployeesPage() {
  const [searchName, setSearchName] = useState("");
  const [searchStore, setSearchStore] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const employees = [
    {
      id: "46512354",
      name: "Murilo Barbosa de Almeida",
      email: "murilo.barbosa2609@gmail.com",
      store: "Barracão do óleo",
    },
    {
      id: "46512355",
      name: "Caio Santana",
      email: "caiosantana0809@gmail.com",
      store: "Max lub",
    },
    {
      id: "46512356",
      name: "Pedro Henrique",
      email: "pedrohenrique2025@gmail.com",
      store: "General do óleo",
    },
  ];

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchName.toLowerCase()) &&
      emp.store.toLowerCase().includes(searchStore.toLowerCase())
  );

  const handleSearch = () => {
    setHasSearched(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-12 overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <Card className="bg-white border-none shadow-sm w-46 h-24 flex-shrink-0 flex items-center justify-center ">
          <CardContent className="flex items-center justify-center gap-4 p-5">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <UsersRound className="text-green-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">125</p>
              <p className="text-sm text-gray-500">Funcionários</p>
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
              placeholder="Digite seu nome"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-64 bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loja
            </label>
            <select
              value={searchStore}
              onChange={(e) => setSearchStore(e.target.value)}
              className="w-64 bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Selecione uma loja</option>
              <option value="Barracão do óleo">Barracão do óleo</option>
              <option value="Max lub">Max lub</option>
              <option value="General do óleo">General do óleo</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="mt-6 bg-green-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
        {hasSearched ? (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-gray-600 font-semibold">
                      ID
                    </TableHead>
                    <TableHead className="text-gray-600 font-semibold">
                      Nome
                    </TableHead>
                    <TableHead className="text-gray-600 font-semibold">
                      Email
                    </TableHead>
                    <TableHead className="text-gray-600 font-semibold">
                      Loja
                    </TableHead>
                    <TableHead className="text-gray-600 font-semibold text-right">
                      Editar
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((emp) => (
                    <TableRow
                      key={emp.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>{emp.id}</TableCell>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.store}</TableCell>
                      <TableCell className="text-right text-gray-400">
                        ...
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end items-center h-12 px-6 border-t border-gray-100 text-sm text-gray-500 space-x-2">
              <span className="cursor-pointer hover:text-gray-800">1</span>
              <span className="cursor-pointer hover:text-gray-800">2</span>
              <span className="cursor-pointer hover:text-gray-800">Próx</span>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-lg font-medium">
            Busque através de funcionários ou lojas para visualizar os
            resultados.
          </div>
        )}
      </div>
    </div>
  );
}

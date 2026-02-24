import React, { useState, useEffect } from "react";
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

import { getCustomerData } from "@/api/services/customerService";

interface Client {
  id: string;
  name: string;
  mainCar: string;
  plate: string;
  status: string;
  store: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<"registered" | "pending">("registered");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await getCustomerData();
        setClients(data);
      } catch (error) {
        console.error("Erro ao carregar os clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const registeredClients = clients.filter(
    (client) => client.status === "Verificado", // Ajuste a string conforme o padrão da API
  );

  const pendingClients = clients.filter(
    (client) => client.status === "Pendente", // Ajuste a string conforme o padrão da API
  );

  const currentClients =
    view === "registered" ? registeredClients : pendingClients;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] p-12 overflow-hidden gap-10">
      <div className="flex justify-start gap-6">
        <Card
          onClick={() => setView("registered")}
          className={`cursor-pointer w-60 bg-white shadow-sm border-none hover:shadow-md transition-all ${
            view === "registered" ? "ring-2 ring-green-400" : ""
          }`}
        >
          <CardContent className="px-5 py-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
              <UsersRound className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">
                {loading ? "..." : registeredClients.length}
              </p>
              <p className="text-sm text-gray-500">Clientes cadastrados</p>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setView("pending")}
          className={`cursor-pointer w-60 bg-white shadow-sm border-none hover:shadow-md transition-all ${
            view === "pending" ? "ring-2 ring-yellow-400" : ""
          }`}
        >
          <CardContent className="px-5 py-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-xl">
              <UsersRound className="text-yellow-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">
                {loading ? "..." : pendingClients.length}
              </p>
              <p className="text-sm text-gray-500">Clientes pendentes</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col ml-auto">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Buscar cliente
          </label>
          <input
            type="text"
            placeholder="Digite o nome"
            className="w-56 bg-white border border-gray-200 rounded-lg px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-600 font-semibold">
                  Identificação
                </TableHead>
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
                <TableHead className="text-gray-600 font-semibold">
                  Loja
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    Carregando clientes...
                  </TableCell>
                </TableRow>
              ) : currentClients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                currentClients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="py-3">{client.id}</TableCell>
                    <TableCell className="py-3">{client.name}</TableCell>
                    <TableCell className="py-3">{client.mainCar}</TableCell>
                    <TableCell className="py-3">{client.plate}</TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          client.status === "Verificado"
                            ? "bg-green-50 text-green-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">{client.store}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end items-center h-12 px-6 border-t border-gray-100 text-sm text-gray-500 space-x-2">
          <span className="cursor-pointer hover:text-gray-800">1</span>
          <span className="cursor-pointer hover:text-gray-800">2</span>
          <span className="cursor-pointer hover:text-gray-800">3</span>
          <span className="cursor-pointer hover:text-gray-800">4</span>
          <span className="cursor-pointer hover:text-gray-800">5</span>
          <span className="cursor-pointer hover:text-gray-800">Próx</span>
        </div>
      </div>
    </div>
  );
}

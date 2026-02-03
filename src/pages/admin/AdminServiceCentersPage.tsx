import React, { useState } from "react";
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

export default function AdminServiceCentersPage() {
  const verifiedStores = [
    {
      id: "46512354",
      name: "Rei da troca",
      registrationDate: "04/09/2025",
      status: "Verificado",
      reviewedAt: "05/09/2025",
    },
    {
      id: "46512355",
      name: "Max lub",
      registrationDate: "05/08/2025",
      status: "Verificado",
      reviewedAt: "06/08/2025",
    },
    {
      id: "46512356",
      name: "General do óleo",
      registrationDate: "25/07/2025",
      status: "Verificado",
      reviewedAt: "25/07/2025",
    },
  ];

  const pendingStores = [
    {
      id: "111222",
      name: "Auto Lub Center",
      registrationDate: "01/10/2025",
      status: "Pendente",
      reviewedAt: "-",
    },
    {
      id: "333444",
      name: "Oficina Nova",
      registrationDate: "28/09/2025",
      status: "Pendente",
      reviewedAt: "-",
    },
  ];

  const [view, setView] = useState<"verified" | "pending">("verified");
  const currentStores = view === "verified" ? verifiedStores : pendingStores;

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden p-12">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <Card
            onClick={() => setView("verified")}
            className={`cursor-pointer bg-white border-none shadow-sm transition-all hover:shadow-md ${
              view === "verified" ? "ring-2 ring-green-400" : ""
            }`}
          >
            <CardContent className="flex items-center gap-3 px-5 py-3">
              <div className="flex items-center justify-center w-9 h-9 bg-green-100 rounded-lg">
                <UsersRound className="text-green-600 h-4 w-4" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">
                  {verifiedStores.length}
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
                <p className="text-base font-bold text-gray-800">
                  {pendingStores.length}
                </p>
                <p className="text-sm text-gray-500">Lojas pendentes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar loja
          </label>
          <input
            type="text"
            placeholder="ABCD 123"
            className="w-56 bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-600 font-semibold text-left">
                  Identificação
                </TableHead>
                <TableHead className="text-gray-600 font-semibold text-left">
                  Nome da loja
                </TableHead>
                <TableHead className="text-gray-600 font-semibold text-left">
                  Data de cadastro
                </TableHead>
                <TableHead className="text-gray-600 font-semibold text-left">
                  Status
                </TableHead>
                <TableHead className="text-gray-600 font-semibold text-left">
                  Revisado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStores.map((store) => (
                <TableRow
                  key={store.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <TableCell className="py-3">{store.id}</TableCell>
                  <TableCell className="py-3">{store.name}</TableCell>
                  <TableCell className="py-3">
                    {store.registrationDate}
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        store.status === "Verificado"
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {store.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">{store.reviewedAt}</TableCell>
                </TableRow>
              ))}
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

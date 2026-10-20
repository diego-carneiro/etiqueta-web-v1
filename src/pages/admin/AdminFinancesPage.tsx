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
import { WalletMinimal, WalletCards, BadgeDollarSign } from "lucide-react";

export default function AdminFinancesPage() {
  const paidStores = [
    {
      id: "46512354",
      name: "Barracão do óleo",
      paymentDate: "05/08/2025",
      status: "Pago",
    },
    {
      id: "46512355",
      name: "Max lub",
      paymentDate: "25/08/2025",
      status: "Pago",
    },
    {
      id: "46512356",
      name: "General do óleo",
      paymentDate: "24/08/2025",
      status: "Pago",
    },
  ];

  const pendingStores = [
    {
      id: "999111",
      name: "Troca Rápida",
      paymentDate: "--/--/----",
      status: "Pendente",
    },
    {
      id: "999112",
      name: "Auto Center Brasil",
      paymentDate: "--/--/----",
      status: "Pendente",
    },
  ];

  const [view, setView] = useState<"paid" | "pending">("paid");
  const stores = view === "paid" ? paidStores : pendingStores;

  return (
    <div className="flex flex-col h-screen bg-brand-light p-12 overflow-hidden">
      {/* CARDS + BUSCA */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-6">
          {/* CARD PAGAS */}
          <Card
            onClick={() => setView("paid")}
            className={`cursor-pointer bg-white border-none shadow-sm hover:shadow-md transition-all ${
              view === "paid" ? "ring-2 ring-brand" : ""
            }`}
          >
            <CardContent className="flex items-center gap-3 px-5 py-3">
              <div className="flex items-center justify-center w-9 h-9 bg-brand-light rounded-lg">
                <WalletMinimal className="text-brand h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-base font-extrabold text-brand-black">
                  {paidStores.length}
                </p>
                <p className="text-sm text-gray-500">Lojas faturas pagas</p>
              </div>
            </CardContent>
          </Card>

          {/* CARD PENDENTES */}
          <Card
            onClick={() => setView("pending")}
            className={`cursor-pointer bg-white border-none shadow-sm hover:shadow-md transition-all ${
              view === "pending" ? "ring-2 ring-red-300" : ""
            }`}
          >
            <CardContent className="flex items-center gap-3 px-5 py-3">
              <div className="flex items-center justify-center w-9 h-9 bg-red-100 rounded-lg">
                <WalletCards className="text-red-600 h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-base font-extrabold text-brand-black">
                  {pendingStores.length}
                </p>
                <p className="text-sm text-gray-500">Lojas faturas pendentes</p>
              </div>
            </CardContent>
          </Card>

          {/* CARD BAIXA */}
          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardContent className="flex items-center gap-3 px-5 py-3">
              <div className="flex items-center justify-center w-9 h-9 bg-yellow-100 rounded-lg">
                <BadgeDollarSign className="text-yellow-600 h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-base font-extrabold text-brand-black">Baixa</p>
                <p className="text-sm text-gray-500">De pagamentos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* BUSCA */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Loja</label>
          <input
            type="text"
            placeholder="Digite o nome da loja"
            className="w-64 bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/40"
          />

          <label className="text-sm font-medium text-gray-700 mt-4 mb-1">
            Status
          </label>
          <select className="w-64 bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/40">
            <option>Selecione</option>
            <option>Pagos</option>
            <option>Pendentes</option>
          </select>
        </div>
      </div>

      {/* CONTAINER DA TABLE */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
        {/* ÁREA DA TABLE que deve ocupar o máximo possível */}
        <div className="flex-1 overflow-y-auto p-6">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-600 font-semibold">
                  Identificação
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  Nome da loja
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  Data de pagamento
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">
                  Status de pagamento
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stores.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-brand-light/60 text-gray-700"
                >
                  <TableCell className="py-3">{item.id}</TableCell>
                  <TableCell className="py-3">{item.name}</TableCell>
                  <TableCell className="py-3">{item.paymentDate}</TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Pago"
                          ? "bg-brand-light text-brand"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* PAGINAÇÃO */}
        <div className="h-12 border-t border-gray-100 flex items-center justify-end px-6 text-sm text-gray-500 space-x-2">
          <span className="cursor-pointer hover:text-brand">1</span>
          <span className="cursor-pointer hover:text-brand">2</span>
          <span className="cursor-pointer hover:text-brand">3</span>
          <span className="cursor-pointer hover:text-brand">4</span>
          <span className="cursor-pointer hover:text-brand">5</span>
          <span className="cursor-pointer hover:text-brand">12</span>
          <span className="cursor-pointer hover:text-brand">Prox</span>
        </div>
      </div>
    </div>
  );
}

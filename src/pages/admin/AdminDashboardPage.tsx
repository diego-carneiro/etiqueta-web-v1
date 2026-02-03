import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useCustomer } from "@/api/hooks/useCustomer";

export interface Customer {
  id: string | number;
  name: string;
  approvalStatus: 0 | 1;
  additionalSlots?: number | null;
  mainCar?: string | null;
  plate?: string | null;
}

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useCustomer();

  const customers = useMemo(() => data?.data ?? [], [data]);

  const { verifiedCount, pendingCount, slotsCount } = useMemo(() => {
    let verified = 0;
    let pending = 0;
    let slots = 0;
    for (const c of customers) {
      if (c.approvalStatus === 1) verified += 1;
      else if (c.approvalStatus === 0) pending += 1;
      slots += typeof c.additionalSlots === "number" ? c.additionalSlots : 0;
    }
    return {
      verifiedCount: verified,
      pendingCount: pending,
      slotsCount: slots,
    };
  }, [customers]);

  const dashboardStats = [
    {
      label: "Clientes Verificados",
      value: verifiedCount,
      color: "text-green-600",
      icon: "🟢",
    },
    {
      label: "Clientes Pendentes",
      value: pendingCount,
      color: "text-orange-600",
      icon: "🟠",
    },
    {
      label: "Slots Adicionais",
      value: slotsCount,
      color: "text-blue-600",
      icon: "➕",
    },
  ];

  if (isLoading) return <div className="p-8">Carregando...</div>;
  if (error)
    return <div className="p-8 text-red-500">Erro ao carregar os dados.</div>;

  return (
    <div className="p-20 space-y-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="bg-white border-none">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className={`text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 rounded-lg flex flex-wrap gap-4">
        <Input
          placeholder="Placa"
          className="max-w-[200px] bg-white border-none"
        />
        <Input
          placeholder="ID"
          className="max-w-[200px] bg-white border-none"
        />
        <Select>
          <SelectTrigger className="w-[200px] bg-white border-none">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="verificado">Verificado</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>
        <Button>Filtrar</Button>
      </div>

      <div className="bg-white rounded-lg p-4">
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Carro Principal</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Revisar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((client: Customer) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.mainCar ?? ""}</TableCell>
                <TableCell>{client.plate ?? ""}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      client.approvalStatus === 1
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-orange-50 text-orange-700 border-orange-200"
                    }
                  >
                    {client.approvalStatus === 1 ? "Verificado" : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

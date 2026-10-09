/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

export default function CustomerInfos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicle, owner } = location.state || {};
  console.log(vehicle);

  const formatInteger = (value: number | null | undefined) => {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return "-";
    }

    return Math.trunc(value);
  };

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600">Nenhum dado encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="mb-4 flex justify-end">
        <Button
          variant="ghost"
          onClick={() => navigate("/app/customer")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Voltar
        </Button>
      </div>

      <Card className="w-full shadow-none rounded-none border-none">
        <CardContent className="space-y-6 px-2 py-4 md:px-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Informações do Veículo
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
            <p>
              <span className="font-semibold">Proprietário:</span> {owner}
            </p>
            <p>
              <span className="font-semibold">Placa:</span>{" "}
              {vehicle.licensePlate}
            </p>
            <p>
              <span className="font-semibold">Marca:</span> {vehicle.brand}
            </p>
            <p>
              <span className="font-semibold">Modelo:</span> {vehicle.model}
            </p>
            <p>
              <span className="font-semibold">Ano:</span> {vehicle.year}
            </p>
            <p>
              <span className="font-semibold">KM Atual:</span>{" "}
              {vehicle.currentMileage}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {vehicle.approvalStatusDescription}
            </p>
            <p>
              <span className="font-semibold">Principal:</span>{" "}
              {vehicle.isMain ? "Sim" : "Não"}
            </p>
            <p>
              <span className="font-semibold">Criado em:</span>{" "}
              {new Date(vehicle.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Última Avaliação:</span>{" "}
              {new Date(vehicle.lastEvaluationDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">KM na Última Avaliação:</span>{" "}
              {formatInteger(vehicle.lastEvaluationMileage)}
            </p>
          </div>

          {vehicle.labels?.length > 0 && (
            <div className="flex flex-col">
              <div className="flex items-center justify-between mt-6 mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  Itens Aplicados
                </h2>
                <Button
                  onClick={() =>
                    navigate("/app/add-label", {
                      state: {
                        vehicleId: vehicle.id,
                        currentMileage: vehicle.currentMileage,
                      },
                    })
                  }
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus size={16} />
                  Adicionar novo item
                </Button>
              </div>

              <div className="overflow-y-auto pr-2 space-y-4 max-h-[40vh]">
                {vehicle.labels.map((label: any, idx: number) => (
                  <Card
                    key={idx}
                    className="border border-gray-200 shadow-sm rounded-xl"
                  >
                    <CardContent className="p-4 space-y-2">
                      <p>
                        <span className="font-semibold">Funcionário:</span>{" "}
                        {label.employeeName}
                      </p>
                      <p>
                        <span className="font-semibold">Criado em:</span>{" "}
                        {new Date(label.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-semibold">KM:</span>{" "}
                        {label.mileage}
                      </p>

                      {label.itemsApplied?.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {label.itemsApplied.map((item: any, i: number) => (
                            <div
                              key={i}
                              className="p-3 border rounded-lg bg-gray-50"
                            >
                              <p>
                                <span className="font-semibold">Tipo:</span>{" "}
                                {item.typeDescription}
                              </p>
                              <p>
                                <span className="font-semibold">Marca:</span>{" "}
                                {item.brand}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Especificação:
                                </span>{" "}
                                {item.specification}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Próxima Troca (KM):
                                </span>{" "}
                                {item.nextChangeInKm}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Próxima Troca (Data):
                                </span>{" "}
                                {new Date(
                                  item.nextChangeDate,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

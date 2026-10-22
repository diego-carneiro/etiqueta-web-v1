/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import axios from "axios";

export default function AddLabel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicleId, currentMileage } = location.state || {};

  const [type, setType] = useState<number>(1);
  const [brand, setBrand] = useState<string>("");
  const [specification, setSpecification] = useState<string>("");
  const [nextChangeInKm, setNextChangeInKm] = useState<number>(0);
  const [nextChangeDate, setNextChangeDate] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) {
      alert("Veículo não encontrado!");
      return;
    }

    const payload = {
      mileage: currentMileage,
      itemsApplied: [
        {
          type,
          brand,
          specification,
          nextChangeInKm,
          nextChangeDate: new Date(nextChangeDate).toISOString(),
        },
      ],
    };

    try {
      setLoading(true);
      await axios.post("/labels", payload, {
        headers: { vehicleId },
      });
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      alert("Erro ao salvar etiqueta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-brand-light flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Voltar
        </Button>

        <Card className="w-full shadow-none border-none bg-white">
          <CardContent className="p-2 space-y-6">
            <h1 className="text-2xl font-extrabold text-brand text-center">
              Adicionar Novo Item
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  KM Atual:
                </span>
                <p className="mt-1 text-brand-black">{currentMileage}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <Input
                  type="number"
                  value={type}
                  onChange={(e) => setType(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marca
                </label>
                <Input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Especificação
                </label>
                <Input
                  type="text"
                  value={specification}
                  onChange={(e) => setSpecification(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Próxima Troca (KM)
                </label>
                <Input
                  type="number"
                  value={nextChangeInKm}
                  onChange={(e) => setNextChangeInKm(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Próxima Troca (Data)
                </label>
                <Input
                  type="date"
                  value={nextChangeDate}
                  onChange={(e) => setNextChangeDate(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white"
              >
                <Save size={18} />
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

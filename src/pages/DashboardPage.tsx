import { Card, CardContent } from "@/components/ui/card";
import { Tags } from "lucide-react";
import { useCompaniesDashboard } from "@/api/hooks/useCompanies";

export default function UserDashboard() {
  const { data, isLoading, isError } = useCompaniesDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-light px-6">
        <p className="text-gray-500 text-lg">Carregando dados do painel...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-light px-6">
        <p className="text-red-500 text-lg">
          Erro ao carregar dados do painel.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-light px-6">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <Card className="flex-row items-center bg-white border-none shadow-sm pr-10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex items-center justify-center w-10 h-10 bg-brand-light rounded-full">
              <Tags className="text-brand h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-brand-black">
                {data?.totalLabelsInSystem ?? 0}
              </p>
              <p className="text-sm text-gray-500">Total de etiquetas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-row items-center bg-white border-none shadow-sm pr-10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex items-center justify-center w-10 h-10 bg-brand rounded-full">
              <Tags className="text-white h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-brand-black">
                {data?.labelsGeneratedThisMonth ?? 0}
              </p>
              <p className="text-sm text-gray-500">Etiquetas geradas no mês</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

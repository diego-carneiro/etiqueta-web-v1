import { Card, CardContent } from "@/components/ui/card";
import { Tags } from "lucide-react";
import { useCompaniesDashboard } from "@/api/hooks/useCompanies";

export default function UserDashboard() {
  const { data, isLoading, isError } = useCompaniesDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
        <p className="text-gray-500 text-lg">Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
        <p className="text-red-500 text-lg">
          Erro ao carregar dados do dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <Card className="flex-row items-center bg-white border-none shadow-sm pr-10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <Tags className="text-green-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {data?.totalLabelsInSystem ?? 0}
              </p>
              <p className="text-sm text-gray-500">Total de etiquetas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-row items-center bg-white border-none shadow-sm pr-10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <Tags className="text-blue-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
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

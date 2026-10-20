import { Card, CardContent } from "@/components/ui/card";
import { useCompanies } from "@/api/hooks/useCompanies";
import { useLabels } from "@/api/hooks/useLabels";

export default function AdminDashboardPage() {
  const {
    data: companiesData,
    isLoading: isLoadingCompanies,
    error: companiesError,
  } = useCompanies();

  const {
    data: labelsData,
    isLoading: isLoadingLabels,
    error: labelsError,
  } = useLabels();

  const isLoading = isLoadingCompanies || isLoadingLabels;
  const hasError = companiesError || labelsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-light">
        <p className="text-gray-500 text-lg">
          Carregando dados do dashboard...
        </p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-light">
        <p className="text-red-500 text-lg">
          Erro ao carregar os dados do dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-light">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        <Card className="w-80 shadow-md border-none bg-white">
          <CardContent className="flex flex-col items-center justify-center p-10">
            <p
              className="text-lg
             text-gray-500 tracking-wide font-medium"
            >
              Total de Lojas Cadastradas
            </p>
            <p className="font-display text-5xl font-extrabold text-brand mt-4">
              {companiesData?.totalCount ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card className="w-80 shadow-md border-none bg-white">
          <CardContent className="flex flex-col items-center justify-center p-10">
            <p
              className="text-lg
             text-gray-500 tracking-wide font-medium"
            >
              Total de Etiquetas Geradas
            </p>
            <p className="font-display text-5xl font-extrabold text-brand-black mt-4">
              {labelsData?.totalCount ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

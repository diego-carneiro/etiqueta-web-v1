import { Input } from "@/components/ui/input";

export default function AuditDetails() {
  return (
    <div className="w-full min-h-screen flex items-start justify-center bg-brand-light py-16">
      <div className="w-full max-w-5xl space-y-10">
        {/* Cabeçalho com dados principais */}
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Funcionário</label>
            <Input
              disabled
              value="Murilo Barbosa de Almeida"
              className="bg-white border border-gray-300 w-[230px]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Loja</label>
            <Input
              disabled
              value="Lorem Ipsum Dolor"
              className="bg-white border border-gray-300 w-[200px]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Cliente</label>
            <Input
              disabled
              value="exemplo@exemplo.com"
              className="bg-white border border-gray-300 w-[220px]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">ID</label>
            <Input
              disabled
              value="213"
              className="bg-white border border-gray-300 w-[80px]"
            />
          </div>
        </div>

        {/* Seção Antes e Depois */}
        <div className="flex gap-20">
          {/* Antes */}
          <div className="flex flex-col gap-2">
            <span className="text-md font-semibold text-gray-700">Antes</span>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">
                Data da última troca
              </label>
              <Input
                disabled
                value="26/05/2023"
                className="bg-white border border-gray-300 w-[160px]"
              />
            </div>
          </div>

          {/* Depois */}
          <div className="flex flex-col gap-2">
            <span className="text-md font-semibold text-gray-700">Depois</span>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">
                Data da última troca
              </label>
              <Input
                disabled
                value="26/07/2023"
                className="bg-white border border-gray-300 w-[160px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

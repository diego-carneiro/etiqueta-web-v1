import { Clock } from "lucide-react";

interface WaitingApprovalProps {
  onBack: () => void;
}

export default function WaitingApproval({ onBack }: WaitingApprovalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-light">
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        style={{ animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <div className="h-1.5 bg-brand-light w-full">
          <div
            className="h-full bg-brand"
            style={{
              width: "40%",
              animation: "barPulse 2.4s ease-in-out infinite",
            }}
          />
        </div>

        <div className="px-8 py-8 flex flex-col items-center text-center gap-4">
          <div className="relative flex items-center justify-center">
            <span
              className="absolute w-20 h-20 rounded-full bg-brand-light opacity-60"
              style={{ animation: "pulse 1.8s ease-in-out infinite" }}
            />
            <div className="relative w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-lg shadow-brand/25">
              <Clock className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-brand-black tracking-tight">
              Cadastro em análise
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Seu cadastro está aguardando a aprovação dos administradores do
              sistema.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5">
            <span className="flex gap-1 items-center">
              <span
                className="w-1.5 h-1.5 rounded-full bg-brand"
                style={{
                  animation: "dotPulse 1.4s infinite ease-in-out",
                  animationDelay: "0s",
                }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-brand"
                style={{
                  animation: "dotPulse 1.4s infinite ease-in-out",
                  animationDelay: "0.25s",
                }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-brand"
                style={{
                  animation: "dotPulse 1.4s infinite ease-in-out",
                  animationDelay: "0.5s",
                }}
              />
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Aguardando aprovação
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Dúvidas? Entre em contato com o suporte.
          </p>

          <button
            onClick={onBack}
            className="mt-1 w-full bg-brand hover:bg-brand-hover text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            Voltar para tela de login
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.35); opacity: 0.2; }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        @keyframes barPulse {
          0% { width: 20%; opacity: 1; }
          50% { width: 65%; opacity: 0.7; }
          100% { width: 20%; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

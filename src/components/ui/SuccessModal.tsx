import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  redirectSeconds?: number;
  onRedirect: () => void;
}

export default function SuccessModal({
  open,
  redirectSeconds = 4,
  onRedirect,
}: SuccessModalProps) {
  const [count, setCount] = useState(redirectSeconds);

  useEffect(() => {
    if (!open) {
      setCount(redirectSeconds);
      return;
    }

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, redirectSeconds, onRedirect]);

  if (!open) return null;

  const progress = ((redirectSeconds - count) / redirectSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.2s ease" }}
      />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        style={{ animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <div className="h-1.5 bg-brand-light w-full">
          <div
            className="h-full bg-brand transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-8 py-8 flex flex-col items-center text-center gap-4">
          <div className="relative flex items-center justify-center">
            <span
              className="absolute w-20 h-20 rounded-full bg-brand-light opacity-60"
              style={{ animation: "pulse 1.8s ease-in-out infinite" }}
            />
            <div className="relative w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-lg shadow-brand/25">
              <CheckCircle2 className="w-8 h-8 text-brand-green" strokeWidth={2.5} />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-brand-black tracking-tight">
              Cadastro realizado!
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Você será redirecionado para a tela de login.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5">
            <span className="w-5 h-5 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center leading-none">
              {count}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {count === 1 ? "segundo restante" : "segundos restantes"}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.35); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

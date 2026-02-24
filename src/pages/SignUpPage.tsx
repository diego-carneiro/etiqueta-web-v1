import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import TermsOfUse from "@/components/TermsOfUse";
import SuccessModal from "@/components/ui/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useRegisterCompany } from "@/api/hooks/useRegisterAuth";

// ─── Constants ────────────────────────────────────────────────────────────────

const ENABLE_VALIDATIONS = import.meta.env.VITE_ENABLE_VALIDATIONS !== "false";

const STEPS = [
  "Email e senha",
  "Informações loja",
  "Serviços",
  "Dias e Horários",
  "Termos de uso",
];

const SERVICOS = [
  "Óleo motor",
  "Óleo de freio",
  "Filtro cabine",
  "Óleo de câmbio manual",
  "Óleo de Direção",
  "Outros serviços",
  "Óleo de câmbio automático parcial",
  "Limpeza arrefecimento",
  "Filtro de óleo",
  "Óleo de câmbio automático comple.",
  "Filtro de Ar",
  "Filtro de combus",
];

const DIAS_DEFAULT = [
  { dia: "Segunda-feira", ativo: false, inicio: "08:00", fim: "18:00" },
  { dia: "Terça-feira", ativo: false, inicio: "08:00", fim: "18:00" },
  { dia: "Quarta-feira", ativo: false, inicio: "08:00", fim: "18:00" },
  { dia: "Quinta-feira", ativo: false, inicio: "08:00", fim: "18:00" },
  { dia: "Sexta-feira", ativo: false, inicio: "08:00", fim: "18:00" },
  { dia: "Sábado", ativo: false, inicio: "08:00", fim: "15:00" },
  { dia: "Domingo", ativo: false, inicio: "08:00", fim: "15:00" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
      );
    }
  }
  return slots;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Step2Data = {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  redesSociais: string;
  siteLoja: string;
};

type Horario = {
  dia: string;
  ativo: boolean;
  inicio: string;
  fim: string;
};

type ModalState = { open: boolean; title: string; message: string };

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const { mutateAsync: registerCompany } = useRegisterCompany();
  const navigate = useNavigate();

  // Memoized time slots — only computed once
  const horariosDisponiveis = useMemo(() => generateTimeSlots(), []);

  // Step state
  const [step, setStep] = useState(1);

  // Step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 2
  const [step2Data, setStep2Data] = useState<Step2Data>({
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    email: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    redesSociais: "",
    siteLoja: "",
  });
  const [step2Errors, setStep2Errors] = useState<
    Partial<Record<keyof Step2Data, boolean>>
  >({});

  // Step 3 — split into two distinct states
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>(
    [],
  );
  const [horarios, setHorarios] = useState<Horario[]>(DIAS_DEFAULT);

  // Step 5
  const [aceitouTermos, setAceitouTermos] = useState(false);

  // Modals
  const [errorModal, setErrorModal] = useState<ModalState>({
    open: false,
    title: "",
    message: "",
  });
  const [successModal, setSuccessModal] = useState(false);

  // ─── Modal helpers ──────────────────────────────────────────────────────────

  const showError = (title: string, message: string) =>
    setErrorModal({ open: true, title, message });

  // ─── Navigation ─────────────────────────────────────────────────────────────

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // ─── Step validators ────────────────────────────────────────────────────────

  const validateStep1 = (): boolean => {
    if (!email || !password || !confirm) {
      showError(
        "Campos obrigatórios",
        "Todos os campos devem ser preenchidos.",
      );
      return false;
    }
    if (password !== confirm) {
      showError(
        "Senhas não conferem",
        "As senhas digitadas não são iguais. Verifique e tente novamente.",
      );
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    const errors: Partial<Record<keyof Step2Data, boolean>> = {};
    let hasError = false;

    (Object.keys(step2Data) as (keyof Step2Data)[]).forEach((key) => {
      if (!step2Data[key].trim()) {
        errors[key] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setStep2Errors(errors);
      showError(
        "Campos obrigatórios",
        "Todos os campos devem ser preenchidos antes de avançar. Verifique os campos destacados em vermelho.",
      );
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (servicosSelecionados.length === 0) {
      showError(
        "Nenhum serviço selecionado",
        "Por favor, selecione pelo menos um serviço prestado antes de avançar.",
      );
      return false;
    }
    return true;
  };

  const validateStep4 = (): boolean => {
    if (!horarios.some((h) => h.ativo)) {
      showError(
        "Nenhum horário definido",
        "Por favor, ative e defina o horário de funcionamento para pelo menos um dia da semana.",
      );
      return false;
    }
    return true;
  };

  // ─── Step advance map ───────────────────────────────────────────────────────

  const VALIDATORS: Record<number, () => boolean> = {
    1: validateStep1,
    2: validateStep2,
    3: validateStep3,
    4: validateStep4,
  };

  const handleAdvance = () => {
    if (!ENABLE_VALIDATIONS || !VALIDATORS[step] || VALIDATORS[step]()) {
      nextStep();
    }
  };

  // ─── Step 2 field handler ───────────────────────────────────────────────────

  const handleStep2Change = (field: keyof Step2Data, value: string) => {
    setStep2Data((prev) => ({ ...prev, [field]: value }));
    if (value.trim()) {
      setStep2Errors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // ─── Step 3 handlers ────────────────────────────────────────────────────────

  const toggleServico = (servico: string) => {
    setServicosSelecionados((prev) =>
      prev.includes(servico)
        ? prev.filter((s) => s !== servico)
        : [...prev, servico],
    );
  };

  // ─── Step 4 handlers ────────────────────────────────────────────────────────

  const toggleDia = (index: number) => {
    setHorarios((prev) =>
      prev.map((h, i) => (i === index ? { ...h, ativo: !h.ativo } : h)),
    );
  };

  const updateHorarioDia = (
    index: number,
    field: "inicio" | "fim",
    value: string,
  ) => {
    setHorarios((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
    );
  };

  // ─── Final submit ────────────────────────────────────────────────────────────

  const handleFinalize = async () => {
    if (ENABLE_VALIDATIONS && !aceitouTermos) {
      showError(
        "Termos não aceitos",
        "Você deve aceitar os termos de uso antes de finalizar o cadastro.",
      );
      return;
    }

    try {
      await registerCompany({
        legalName: step2Data.razaoSocial,
        tradeName: step2Data.nomeFantasia,
        taxId: step2Data.cnpj,
        email: email,
        password: password,
        socialMedia: step2Data.redesSociais,
        websiteUrl: step2Data.siteLoja,
        address: {
          postalCode: step2Data.cep,
          street: step2Data.rua,
          number: Number(step2Data.numero),
          additionalInfo: "",
          neighborhood: step2Data.bairro,
          city: "",
          state: "",
        },
        phoneNumbers: [],
        providedServiceIds: servicosSelecionados.map((_, i) => i + 1),
        openingHours: horarios
          .filter((h) => h.ativo)
          .map((h, index) => ({
            day: index,
            start: h.inicio,
            end: h.fim,
            description: h.dia,
          })),
      });

      setSuccessModal(true);
    } catch (error: any) {
      showError(
        "Erro ao cadastrar",
        error?.response?.data?.message ??
          "Erro inesperado ao realizar cadastro.",
      );
    }
  };

  // ─── Input class helper ──────────────────────────────────────────────────────

  const inputClass = (hasError?: boolean) =>
    `bg-white text-gray-800 placeholder:text-gray-500 h-9 text-sm ${
      hasError
        ? "border-2 border-red-500 focus-visible:ring-red-500"
        : "border border-gray-300"
    }`;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="w-screen h-screen flex bg-[#E5E5E5] overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-1/4 bg-[#3358A5] flex items-center justify-center">
        <ul className="flex flex-col gap-10">
          {STEPS.map((label, i) => {
            const idx = i + 1;
            const active = idx === step;
            return (
              <li key={label} className="flex items-center gap-4">
                <span
                  className={`w-4 h-4 rounded-full ${
                    active
                      ? "bg-green-500 border-2 border-white"
                      : "bg-white/50"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    active ? "text-white" : "text-white/80"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col bg-[#E5E5E5]">
        <div className="flex-1 flex items-center justify-center overflow-y-auto px-4 py-8">
          <div className="w-full max-w-[900px]">
            {/* STEP 1 — Email e Senha */}
            {step === 1 && (
              <Card className="bg-transparent border-none shadow-none w-full max-w-[420px] mx-auto">
                <CardContent className="flex flex-col gap-4 p-0">
                  <div className="mb-2">
                    <Label htmlFor="email" className="text-[#3358A5] mb-2">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite seu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white text-gray-800 placeholder:text-gray-500 border-none focus-visible:ring-2 focus-visible:ring-green-500"
                    />
                  </div>

                  <div className="mb-2">
                    <Label htmlFor="password" className="text-[#3358A5] mb-2">
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white text-gray-800 placeholder:text-gray-500 pr-10 border-none focus-visible:ring-2 focus-visible:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <Label htmlFor="confirm" className="text-[#3358A5] mb-2">
                      Confirmar senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Digite sua senha novamente"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="bg-white text-gray-800 placeholder:text-gray-500 pr-10 border-none focus-visible:ring-2 focus-visible:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 2 — Informações da Loja */}
            {step === 2 && (
              <div className="w-full space-y-3">
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="px-4 py-3">
                    <h3 className="text-[#3358A5] font-semibold text-sm mb-2 flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Dados da Empresa
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          {
                            key: "cnpj",
                            label: "CNPJ",
                            placeholder: "00.000.000/0000-00",
                          },
                          {
                            key: "razaoSocial",
                            label: "Razão social",
                            placeholder: "Empresa LTDA",
                          },
                          {
                            key: "nomeFantasia",
                            label: "Nome fantasia",
                            placeholder: "Nome da loja",
                          },
                          {
                            key: "email",
                            label: "E-mail",
                            placeholder: "email@exemplo.com",
                          },
                        ] as const
                      ).map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <Label className="text-[#3358A5] mb-1 text-xs block">
                            {label}
                          </Label>
                          <Input
                            value={step2Data[key]}
                            onChange={(e) =>
                              handleStep2Change(key, e.target.value)
                            }
                            className={inputClass(step2Errors[key])}
                            placeholder={placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="px-4 py-3">
                    <h3 className="text-[#3358A5] font-semibold text-sm mb-2 flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Endereço
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          {
                            key: "cep",
                            label: "CEP",
                            placeholder: "00000-000",
                          },
                          {
                            key: "rua",
                            label: "Nome da rua",
                            placeholder: "Rua exemplo",
                          },
                          {
                            key: "numero",
                            label: "Número",
                            placeholder: "123",
                          },
                          {
                            key: "bairro",
                            label: "Bairro",
                            placeholder: "Centro",
                          },
                        ] as const
                      ).map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <Label className="text-[#3358A5] mb-1 text-xs block">
                            {label}
                          </Label>
                          <Input
                            value={step2Data[key]}
                            onChange={(e) =>
                              handleStep2Change(key, e.target.value)
                            }
                            className={inputClass(step2Errors[key])}
                            placeholder={placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="px-4 py-3">
                    <h3 className="text-[#3358A5] font-semibold text-sm mb-2 flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      Presença Digital
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          {
                            key: "redesSociais",
                            label: "Redes Sociais",
                            placeholder: "@loja",
                          },
                          {
                            key: "siteLoja",
                            label: "Site loja",
                            placeholder: "www.loja.com.br",
                          },
                        ] as const
                      ).map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <Label className="text-[#3358A5] mb-1 text-xs block">
                            {label}
                          </Label>
                          <Input
                            value={step2Data[key]}
                            onChange={(e) =>
                              handleStep2Change(key, e.target.value)
                            }
                            className={inputClass(step2Errors[key])}
                            placeholder={placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* STEP 3 — Serviços */}
            {step === 3 && (
              <div className="w-full space-y-6">
                <div>
                  <Label className="text-[#3358A5] mb-3 block text-base font-semibold">
                    Serviços prestados
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {SERVICOS.map((servico) => {
                      const isSelected = servicosSelecionados.includes(servico);
                      return (
                        <button
                          key={servico}
                          type="button"
                          onClick={() => toggleServico(servico)}
                          className="relative flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all border bg-white border-gray-300 text-gray-700"
                        >
                          <span className="text-left flex-1 pr-2">
                            {servico}
                          </span>
                          <div
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              isSelected ? "bg-gray-400" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform flex items-center justify-center ${
                                isSelected ? "translate-x-5" : "translate-x-0"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-gray-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 — Dias e Horários */}
            {step === 4 && (
              <div className="w-full space-y-6">
                <div>
                  <Label className="text-[#3358A5] mb-3 block text-base font-semibold">
                    Dias / Horários
                  </Label>
                  <div className="space-y-2">
                    {horarios.map((horario, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-white rounded-lg px-4 py-3 border border-gray-300"
                      >
                        <button
                          type="button"
                          onClick={() => toggleDia(index)}
                          className="flex items-center gap-3 min-w-[140px]"
                        >
                          <div
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              horario.ativo ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                                horario.ativo
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              horario.ativo ? "text-gray-700" : "text-gray-400"
                            }`}
                          >
                            {horario.dia}
                          </span>
                        </button>

                        <div className="flex items-center gap-2">
                          {(["inicio", "fim"] as const).map((field, fi) => (
                            <>
                              {fi === 1 && (
                                <span
                                  key="sep"
                                  className="text-sm text-gray-500"
                                >
                                  às
                                </span>
                              )}
                              <select
                                key={field}
                                value={horario[field]}
                                onChange={(e) =>
                                  updateHorarioDia(index, field, e.target.value)
                                }
                                disabled={!horario.ativo}
                                className={`px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                  !horario.ativo
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700"
                                }`}
                              >
                                {horariosDisponiveis.map((h) => (
                                  <option key={h} value={h}>
                                    {h}
                                  </option>
                                ))}
                              </select>
                            </>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 — Termos de Uso */}
            {step === 5 && (
              <Card className="bg-transparent border-none shadow-none w-full">
                <Label className="text-[#3358A5] mb-3 block text-base font-semibold">
                  Termos de uso
                </Label>
                <CardContent className="flex flex-col gap-4 p-0">
                  <div className="bg-white rounded-lg shadow-inner p-4 h-[400px] overflow-y-auto border border-gray-200">
                    <TermsOfUse />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="aceitar-termos"
                      checked={aceitouTermos}
                      onChange={(e) => setAceitouTermos(e.target.checked)}
                      className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="aceitar-termos"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Li e aceito os termos de uso
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex-shrink-0 border-gray-300 bg-[#E5E5E5] py-12">
          <div className="w-full max-w-[600px] mx-auto px-4 flex justify-between">
            <Button
              onClick={() => (step === 1 ? navigate("/sign-in") : prevStep())}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2"
            >
              Voltar
            </Button>

            {step < STEPS.length ? (
              <Button
                onClick={handleAdvance}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-2"
              >
                Avançar
              </Button>
            ) : (
              <Button
                onClick={handleFinalize}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-2"
              >
                Finalizar
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* MODALS */}
      <ErrorModal
        open={errorModal.open}
        onOpenChange={(open) => setErrorModal({ ...errorModal, open })}
        title={errorModal.title}
        message={errorModal.message}
      />

      <SuccessModal
        open={successModal}
        redirectSeconds={4}
        onRedirect={() => navigate("/sign-in")}
      />
    </div>
  );
}

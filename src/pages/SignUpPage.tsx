import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import TermsOfUse from "@/components/TermsOfUse";
import PrivacyPolicies from "@/components/PrivacyPolicies";
import SuccessModal from "@/components/ui/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EmailInput } from "@/components/ui/input/email-input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useRegisterCompany } from "@/api/hooks/useRegisterAuth";
import BrandLogo from "@/components/BrandLogo";

const ENABLE_VALIDATIONS = import.meta.env.VITE_ENABLE_VALIDATIONS !== "false";

const STEPS = [
  "E-mail e senha",
  "Informações loja",
  "Serviços",
  "Dias e horários",
  "Termos de uso",
];

const SERVICES = [
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

const DEFAULT_DAYS = [
  { day: "Segunda-feira", active: false, start: "08:00", end: "18:00" },
  { day: "Terça-feira", active: false, start: "08:00", end: "18:00" },
  { day: "Quarta-feira", active: false, start: "08:00", end: "18:00" },
  { day: "Quinta-feira", active: false, start: "08:00", end: "18:00" },
  { day: "Sexta-feira", active: false, start: "08:00", end: "18:00" },
  { day: "Sábado", active: false, start: "08:00", end: "15:00" },
  { day: "Domingo", active: false, start: "08:00", end: "15:00" },
];

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

type StoreFormData = {
  cnpj: string;
  legalName: string;
  tradeName: string;
  postalCode: string;
  street: string;
  number: string;
  neighborhood: string;
  socialMedia: string;
  websiteUrl: string;
};

type Schedule = {
  day: string;
  active: boolean;
  start: string;
  end: string;
};

type ModalState = { open: boolean; title: string; message: string };

export default function SignUpPage() {
  const { mutateAsync: registerCompany } = useRegisterCompany();
  const navigate = useNavigate();

  const availableTimeSlots = useMemo(() => generateTimeSlots(), []);

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [isPrimaryEmailValid, setIsPrimaryEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [storeFormData, setStoreFormData] = useState<StoreFormData>({
    cnpj: "",
    legalName: "",
    tradeName: "",
    postalCode: "",
    street: "",
    number: "",
    neighborhood: "",
    socialMedia: "",
    websiteUrl: "",
  });
  const [storeFormErrors, setStoreFormErrors] = useState<
    Partial<Record<keyof StoreFormData, boolean>>
  >({});

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>(DEFAULT_DAYS);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const [errorModal, setErrorModal] = useState<ModalState>({
    open: false,
    title: "",
    message: "",
  });
  const [successModal, setSuccessModal] = useState(false);

  const showError = (title: string, message: string) =>
    setErrorModal({ open: true, title, message });

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const validateStep1 = (): boolean => {
    if (!email || !password || !confirmPassword) {
      showError(
        "Campos obrigatórios",
        "Todos os campos devem ser preenchidos.",
      );
      return false;
    }
    if (!isPrimaryEmailValid) {
      showError(
        "Formato inválido",
        "O e-mail informado não respeita o formato padrão.",
      );
      return false;
    }
    if (password !== confirmPassword) {
      showError(
        "Senhas não conferem",
        "As senhas digitadas não são iguais. Verifique e tente novamente.",
      );
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    const errors: Partial<Record<keyof StoreFormData, boolean>> = {};
    let hasError = false;

    const optionalFields: (keyof StoreFormData)[] = ["socialMedia", "websiteUrl"];

    (Object.keys(storeFormData) as (keyof StoreFormData)[]).forEach((key) => {
      if (optionalFields.includes(key)) return;
      if (!storeFormData[key].trim()) {
        errors[key] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setStoreFormErrors(errors);
      showError(
        "Campos obrigatórios",
        "Todos os campos devem ser preenchidos antes de avançar. Verifique os campos destacados em vermelho.",
      );
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (selectedServices.length === 0) {
      showError(
        "Nenhum serviço selecionado",
        "Por favor, selecione pelo menos um serviço prestado antes de avançar.",
      );
      return false;
    }
    return true;
  };

  const validateStep4 = (): boolean => {
    if (!schedules.some((s) => s.active)) {
      showError(
        "Nenhum horário definido",
        "Por favor, ative e defina o horário de funcionamento para pelo menos um dia da semana.",
      );
      return false;
    }
    return true;
  };

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

  const handleStoreFormChange = (field: keyof StoreFormData, value: string) => {
    setStoreFormData((prev) => ({ ...prev, [field]: value }));
    if (value.trim()) {
      setStoreFormErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const toggleDay = (index: number) => {
    setSchedules((prev) =>
      prev.map((s, i) => (i === index ? { ...s, active: !s.active } : s)),
    );
  };

  const updateSchedule = (
    index: number,
    field: "start" | "end",
    value: string,
  ) => {
    setSchedules((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const handleFinalize = async () => {
    if (ENABLE_VALIDATIONS && (!acceptedTerms || !acceptedPrivacy)) {
      showError(
        "Acordos necessários",
        "Você deve aceitar os termos de uso e as políticas de privacidade antes de finalizar o cadastro.",
      );
      return;
    }

    try {
      await registerCompany({
        legalName: storeFormData.legalName,
        tradeName: storeFormData.tradeName,
        taxId: storeFormData.cnpj,
        email,
        password,
        socialMedia: storeFormData.socialMedia,
        websiteUrl: storeFormData.websiteUrl,
        address: {
          postalCode: storeFormData.postalCode,
          street: storeFormData.street,
          number: Number(storeFormData.number),
          additionalInfo: "",
          neighborhood: storeFormData.neighborhood,
          city: "",
          state: "",
        },
        phoneNumbers: [],
        providedServiceIds: selectedServices.map((_, i) => i + 1),
        openingHours: schedules
          .filter((s) => s.active)
          .map((s, index) => ({
            day: index,
            start: s.start,
            end: s.end,
            description: s.day,
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

  const inputClass = (hasError?: boolean) =>
    `bg-white text-brand-black placeholder:text-gray-500 h-9 text-sm ${
      hasError
        ? "border-2 border-red-500 focus-visible:ring-red-500"
        : "border border-gray-300"
    }`;

  return (
    <div className="w-screen h-screen flex bg-brand-light overflow-hidden">
      <aside className="relative w-1/4 bg-brand flex items-center justify-center">
        <BrandLogo className="absolute top-10 left-1/2 w-[min(192px,70%)] -translate-x-1/2 text-brand-light" />
        <ul className="flex flex-col gap-10">
          {STEPS.map((label, i) => {
            const idx = i + 1;
            const active = idx === step;
            return (
              <li key={label} className="flex items-center gap-4">
                <span
                  className={`w-4 h-4 rounded-full ${active ? "bg-brand-green border-2 border-brand-light" : "bg-white/50"}`}
                />
                <span
                  className={`text-sm font-medium ${active ? "text-white" : "text-white/80"}`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="flex-1 flex flex-col bg-brand-light">
        <div className="flex-1 flex items-center justify-center overflow-y-auto px-4 py-8">
          <div className="w-full max-w-[900px]">
            {step === 1 && (
              <Card className="bg-transparent border-none shadow-none w-full max-w-[420px] mx-auto">
                <CardContent className="flex flex-col gap-4 p-0">
                  <div className="mb-2">
                    <Label htmlFor="email" className="text-brand mb-2">
                      E-mail
                    </Label>
                    <EmailInput
                      placeholder="Digite seu e-mail"
                      value={email}
                      onChange={setEmail}
                      onValidityChange={setIsPrimaryEmailValid}
                      className="bg-white text-brand-black placeholder:text-gray-500 border-none focus-visible:ring-2 focus-visible:ring-brand mt-0"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <Label htmlFor="password" className="text-brand mb-2">
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white text-brand-black placeholder:text-gray-500 pr-10 border-none focus-visible:ring-2 focus-visible:ring-brand"
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
                    <Label
                      htmlFor="confirmPassword"
                      className="text-brand mb-2"
                    >
                      Confirmar senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Digite sua senha novamente"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white text-brand-black placeholder:text-gray-500 pr-10 border-none focus-visible:ring-2 focus-visible:ring-brand"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <div className="w-full space-y-3">
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="px-4 py-3">
                    <h3 className="text-brand font-bold text-sm mb-2 flex items-center gap-2">
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
                      Company Data
                    </h3>
                    <div className="flex flex-col gap-3">
                      {(
                        [
                          {
                            key: "cnpj",
                            label: "CNPJ",
                            placeholder: "00.000.000/0000-00",
                          },
                          {
                            key: "legalName",
                            label: "Razão social",
                            placeholder: "Empresa LTDA",
                          },
                          {
                            key: "tradeName",
                            label: "Nome fantasia",
                            placeholder: "Nome da loja",
                          },
                        ] as const
                      ).map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <Label className="text-brand mb-1 text-xs block">
                            {label}
                          </Label>
                          <Input
                            value={storeFormData[key]}
                            onChange={(e) =>
                              handleStoreFormChange(key, e.target.value)
                            }
                            className={inputClass(storeFormErrors[key])}
                            placeholder={placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="px-4 py-3">
                    <h3 className="text-brand font-bold text-sm mb-2 flex items-center gap-2">
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
                      Address
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          {
                            key: "postalCode",
                            label: "CEP",
                            placeholder: "00000-000",
                          },
                          {
                            key: "street",
                            label: "Nome da rua",
                            placeholder: "Rua exemplo",
                          },
                          {
                            key: "number",
                            label: "Número",
                            placeholder: "123",
                          },
                          {
                            key: "neighborhood",
                            label: "Bairro",
                            placeholder: "Centro",
                          },
                        ] as const
                      ).map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <Label className="text-brand mb-1 text-xs block">
                            {label}
                          </Label>
                          <Input
                            value={storeFormData[key]}
                            onChange={(e) =>
                              handleStoreFormChange(key, e.target.value)
                            }
                            className={inputClass(storeFormErrors[key])}
                            placeholder={placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="px-4 py-3">
                    <h3 className="text-brand font-bold text-sm mb-2 flex items-center gap-2">
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
                      Presença digital (opcional)
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          {
                            key: "socialMedia",
                            label: "Redes Sociais",
                            placeholder: "@loja",
                          },
                          {
                            key: "websiteUrl",
                            label: "Site loja",
                            placeholder: "www.loja.com.br",
                          },
                        ] as const
                      ).map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <Label className="text-brand mb-1 text-xs block">
                            {label}
                          </Label>
                          <Input
                            value={storeFormData[key]}
                            onChange={(e) =>
                              handleStoreFormChange(key, e.target.value)
                            }
                            className={inputClass(storeFormErrors[key])}
                            placeholder={placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && (
              <div className="w-full space-y-6">
                <div>
                  <Label className="text-brand mb-3 block text-base font-semibold">
                    Serviços prestados
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {SERVICES.map((service) => {
                      const isSelected = selectedServices.includes(service);
                      return (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          className="relative flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all border bg-white border-gray-300 text-gray-700"
                        >
                          <span className="text-left flex-1 pr-2">
                            {service}
                          </span>
                          <div
                            className={`relative w-11 h-6 rounded-full transition-colors ${isSelected ? "bg-brand" : "bg-gray-300"}`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform flex items-center justify-center ${isSelected ? "translate-x-5" : "translate-x-0"}`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-brand"
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

            {step === 4 && (
              <div className="w-full space-y-6">
                <div>
                  <Label className="text-brand mb-3 block text-base font-semibold">
                    Dias e horários
                  </Label>
                  <div className="space-y-2">
                    {schedules.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-white rounded-lg px-4 py-3 border border-gray-300"
                      >
                        <button
                          type="button"
                          onClick={() => toggleDay(index)}
                          className="flex items-center gap-3 min-w-[140px]"
                        >
                          <div
                            className={`relative w-11 h-6 rounded-full transition-colors ${schedule.active ? "bg-brand" : "bg-gray-300"}`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${schedule.active ? "translate-x-5" : "translate-x-0"}`}
                            />
                          </div>
                          <span
                            className={`text-sm font-medium ${schedule.active ? "text-gray-700" : "text-gray-400"}`}
                          >
                            {schedule.day}
                          </span>
                        </button>

                        <div className="flex items-center gap-2">
                          {(["start", "end"] as const).map((field, fi) => (
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
                                value={schedule[field]}
                                onChange={(e) =>
                                  updateSchedule(index, field, e.target.value)
                                }
                                disabled={!schedule.active}
                                className={`px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent ${!schedule.active ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700"}`}
                              >
                                {availableTimeSlots.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
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

            {step === 5 && (
              <Card className="bg-transparent border-none shadow-none w-full">
                <CardContent className="flex flex-col gap-6 p-0">
                  <div>
                    <Label className="text-brand mb-3 block text-base font-semibold">
                      Termos de uso
                    </Label>
                    <div className="bg-white rounded-lg shadow-inner p-4 h-[280px] overflow-y-auto border border-gray-200">
                      <TermsOfUse />
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <input
                        type="checkbox"
                        id="accept-terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="w-5 h-5 accent-brand border-gray-300 rounded focus:ring-brand"
                      />
                      <label
                        htmlFor="accept-terms"
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        Li e aceito os termos de uso
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-brand mb-3 block text-base font-semibold">
                      Políticas de Privacidade
                    </Label>
                    <div className="bg-white rounded-lg shadow-inner p-4 h-[280px] overflow-y-auto border border-gray-200">
                      <PrivacyPolicies />
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <input
                        type="checkbox"
                        id="accept-privacy"
                        checked={acceptedPrivacy}
                        onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                        className="w-5 h-5 accent-brand border-gray-300 rounded focus:ring-brand"
                      />
                      <label
                        htmlFor="accept-privacy"
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        Li e aceito as políticas de privacidade
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 border-gray-300 bg-brand-light py-12">
          <div className="w-full max-w-[600px] mx-auto px-4 flex justify-between">
            <Button
              onClick={() => (step === 1 ? navigate("/sign-in") : prevStep())}
              className="bg-brand hover:bg-brand-hover text-white px-8 py-2"
            >
              Voltar
            </Button>

            {step < STEPS.length ? (
              <Button
                onClick={handleAdvance}
                className="bg-brand hover:bg-brand-hover text-white px-8 py-2"
              >
                Avançar
              </Button>
            ) : (
              <Button
                onClick={handleFinalize}
                disabled={
                  ENABLE_VALIDATIONS && (!acceptedTerms || !acceptedPrivacy)
                }
                className="bg-brand hover:bg-brand-hover text-white px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Finalizar
              </Button>
            )}
          </div>
        </div>
      </main>

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

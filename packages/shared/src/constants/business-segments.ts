export const BUSINESS_SEGMENT_OPTIONS = [
  { value: "Desenvolvimento de software", label: "Desenvolvimento de software" },
  { value: "Design e UX/UI", label: "Design e UX/UI" },
  { value: "Marketing digital", label: "Marketing digital" },
  { value: "Publicidade e comunicacao", label: "Publicidade e comunicacao" },
  { value: "Consultoria empresarial", label: "Consultoria empresarial" },
  { value: "Contabilidade e financas", label: "Contabilidade e financas" },
  { value: "Advocacia e servicos juridicos", label: "Advocacia e servicos juridicos" },
  { value: "Arquitetura e engenharia", label: "Arquitetura e engenharia" },
  { value: "Construcao e reformas", label: "Construcao e reformas" },
  { value: "Saude, estetica e bem-estar", label: "Saude, estetica e bem-estar" },
  { value: "Educacao e treinamentos", label: "Educacao e treinamentos" },
  { value: "E-commerce e varejo", label: "E-commerce e varejo" },
  { value: "Imobiliario", label: "Imobiliario" },
  { value: "Audiovisual e producao de conteudo", label: "Audiovisual e producao de conteudo" },
  { value: "Tecnologia da informacao e infraestrutura", label: "Tecnologia da informacao e infraestrutura" },
  { value: "Recursos humanos e recrutamento", label: "Recursos humanos e recrutamento" },
  { value: "Eventos e experiencias", label: "Eventos e experiencias" },
  { value: "Alimentacao e gastronomia", label: "Alimentacao e gastronomia" },
  { value: "Logistica e transportes", label: "Logistica e transportes" },
  { value: "Servicos gerais e manutencao", label: "Servicos gerais e manutencao" },
] as const;

export type BusinessSegmentValue =
  (typeof BUSINESS_SEGMENT_OPTIONS)[number]["value"];

export const BUSINESS_SEGMENT_VALUES: BusinessSegmentValue[] =
  BUSINESS_SEGMENT_OPTIONS.map((option) => option.value);

const NORMALIZED_SEGMENT_LOOKUP = new Map<string, BusinessSegmentValue>(
  BUSINESS_SEGMENT_OPTIONS.flatMap((option) => [
    [normalizeSegmentKey(option.value), option.value],
    [normalizeSegmentKey(option.label), option.value],
  ]),
);

function normalizeSegmentKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function isValidBusinessSegment(value: string): boolean {
  return (BUSINESS_SEGMENT_VALUES as readonly string[]).includes(value);
}

export function isBusinessSegmentValue(
  value: string | null | undefined,
): value is BusinessSegmentValue {
  if (!value) return false;
  return BUSINESS_SEGMENT_VALUES.includes(value as BusinessSegmentValue);
}

/** Converte texto livre (ex.: resposta da IA) para um segmento da lista. */
export function resolveBusinessSegment(
  value: string | null | undefined,
): BusinessSegmentValue | "" {
  if (!value?.trim()) return "";

  const trimmed = value.trim();
  if (isBusinessSegmentValue(trimmed)) return trimmed;

  const normalized = normalizeSegmentKey(trimmed);
  const exact = NORMALIZED_SEGMENT_LOOKUP.get(normalized);
  if (exact) return exact;

  const partial = BUSINESS_SEGMENT_OPTIONS.find((option) => {
    const optionKey = normalizeSegmentKey(option.value);
    return optionKey.includes(normalized) || normalized.includes(optionKey);
  });

  return partial?.value ?? "";
}

export function getBusinessSegmentLabel(
  value: string | null | undefined,
): string {
  if (!value) return "Nao informado";
  return isBusinessSegmentValue(value) ? value : value;
}

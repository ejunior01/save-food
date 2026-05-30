import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? "";
const MODEL = "gpt-4.1-mini";
const ENDPOINT = "https://api.openai.com/v1/responses";

const ALLOWED_CATEGORIES = ["Frutas", "Legumes", "Vegetais"] as const;
const ALLOWED_UNITS = ["un", "kg", "g"] as const;

const PROMPT = `Analise esta imagem e identifique SOMENTE frutas, legumes e verduras frescas visíveis.
Agrupe itens iguais em um único resultado com quantidade estimada. Exemplos:
- um cacho de banana => um item "Banana" com qty estimada em unidades
- um cacho de uva => um item "Uva" com unit "g" ou "kg"
- vários tomates => um item "Tomate" com qty estimada em unidades

Ignore embalagens, carnes, laticínios, grãos, massas, pães, bebidas, objetos e alimentos processados.
Retorne APENAS um JSON array, sem markdown e sem explicação extra, com os campos:
- name: string (nome em português, ex: "Tomate", "Banana", "Uva")
- cat: string (uma de: Frutas | Legumes | Vegetais)
- emoji: string (emoji correspondente)
- conf: number (0.0 a 1.0, sua confiança na identificação)
- qty: number (quantidade estimada visível, mínimo 1)
- unit: string ("un" | "kg" | "g")
- validityDays: number (validade típica em dias: ex: tomate=7, banana=5, alface=4, cenoura=14, maçã=21)

Exemplo: [{"name":"Banana","cat":"Frutas","emoji":"🍌","conf":0.94,"qty":6,"unit":"un","validityDays":5}]
Se não houver alimentos visíveis, retorne [].`;

export interface IRecognizedFoodCandidate {
  name: string;
  cat: (typeof ALLOWED_CATEGORIES)[number];
  emoji: string;
  conf: number;
  qty: number;
  unit: (typeof ALLOWED_UNITS)[number];
  validityDays: number;
}

function extractJsonArray(text: string): unknown {
  const clean = text.replace(/```json?/gi, "").replace(/```/g, "").trim();
  const start = clean.indexOf("[");
  const end = clean.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("invalid_ai_json");
  }
  return JSON.parse(clean.slice(start, end + 1));
}

function normalizeFood(value: unknown): IRecognizedFoodCandidate | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const item = value as Partial<IRecognizedFoodCandidate>;
  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!name) {
    return null;
  }

  const cat = ALLOWED_CATEGORIES.includes(item.cat as any) ? item.cat as IRecognizedFoodCandidate["cat"] : "Vegetais";
  const unit = ALLOWED_UNITS.includes(item.unit as any) ? item.unit as IRecognizedFoodCandidate["unit"] : "un";
  const qty = Number.isFinite(item.qty) ? Math.max(1, Number(item.qty)) : 1;
  const conf = Number.isFinite(item.conf) ? Math.min(1, Math.max(0, Number(item.conf))) : 0.7;
  const validityDays = Number.isFinite(item.validityDays) ? Math.max(1, Math.round(Number(item.validityDays))) : 7;

  return {
    name,
    cat,
    emoji: typeof item.emoji === "string" && item.emoji.trim() ? item.emoji : "🥬",
    conf,
    qty,
    unit,
    validityDays,
  };
}

function extractOutputText(data: any): string {
  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  const content = data.output
    ?.flatMap((item: any) => item.content ?? [])
    ?.find((item: any) => item.type === "output_text" || item.type === "text");

  return typeof content?.text === "string" ? content.text : "[]";
}

async function recognizeFoods(base64Image: string): Promise<IRecognizedFoodCandidate[]> {
  if (!API_KEY) {
    throw new Error("missing_openai_api_key");
  }

  const { data } = await axios.post(
    ENDPOINT,
    {
      model: MODEL,
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: PROMPT },
          { type: "input_image", image_url: `data:image/jpeg;base64,${base64Image}` },
        ],
      }],
      temperature: 0.1,
      max_output_tokens: 512,
    },
    {
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  ).catch((error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error("openai_quota_exceeded");
      }
      if (error.response?.status === 400 || error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("openai_api_key_rejected");
      }
      if (error.code === "ECONNABORTED") {
        throw new Error("openai_timeout");
      }
      if (!error.response) {
        throw new Error("openai_network_error");
      }
    }
    throw error;
  });

  const parsed = extractJsonArray(extractOutputText(data));
  if (!Array.isArray(parsed)) {
    throw new Error("invalid_ai_json");
  }
  return parsed.map(normalizeFood).filter((item): item is IRecognizedFoodCandidate => Boolean(item));
}

export const VisionRecognitionService = {
  recognizeFoods,
};

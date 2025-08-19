
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'imagen-3.0-generate-002';

export const describeSketch = async (imageBase64: string): Promise<string> => {
  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: imageBase64,
    },
  };

  const textPart = {
    text: "You are an expert art critic. In a single, vivid sentence, describe this user's rough sketch. This description will be used as a prompt for an image generation AI. Be creative and detailed. For example, instead of 'a cat', say 'A whimsical line art sketch of a cat dreaming of fish'.",
  };
  
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ parts: [imagePart, textPart] }],
      config: {
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI không thể mô tả bản phác thảo. Vui lòng thử vẽ thứ gì đó khác.");
    }
    return text.trim();
  } catch (error) {
    console.error("Error describing sketch:", error);
    throw new Error("Không thể phân tích bản phác thảo. Có thể AI đang gặp trục trặc.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: `${prompt}, digital painting, beautiful lighting, high detail`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("Tạo ảnh thất bại. Không có ảnh nào được trả về.");
    }

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    if (!base64ImageBytes) {
      throw new Error("Tạo ảnh thất bại. Dữ liệu ảnh trả về bị trống.");
    }

    return base64ImageBytes;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Không thể tạo ảnh. Họa sĩ AI có lẽ đang nghỉ giải lao.");
  }
};

export const translateToVietnamese = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `"${text}"`,
      config: {
        systemInstruction: `You are an expert translator. You will receive English text. Your task is to translate it into Vietnamese, preserving the artistic and descriptive tone of the original. Respond ONLY with the raw translated Vietnamese text. Do not include any extra words, explanations, introductory phrases, or markdown formatting like quotes.`,
        temperature: 0.2,
      },
    });

    const translatedText = response.text;
    if (!translatedText) {
      console.warn("AI could not translate the prompt. Falling back to original text.");
      return text;
    }
    return translatedText.trim();
  } catch (error) {
    console.error("Error translating text:", error);
    // Fallback to original text if translation fails
    return text;
  }
};

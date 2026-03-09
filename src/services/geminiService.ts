import { GoogleGenAI, Type } from '@google/genai';
import { UserData, AIAdvice } from '../types';

export async function generateAIAdvice(userData: UserData): Promise<AIAdvice> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
    你是一位專業、溫暖且具備實證醫學精神的血液科醫師。
    請根據以下使用者的健康資料，生成「我需要輸血嗎？」互動式明智選擇小工具的內容。
    
    【使用者資料】
    - 年齡: ${userData.age}
    - 性別: ${userData.gender}
    - 素食者: ${userData.vegetarian ? '是' : '否'}
    - 過去病史: ${userData.history.join(', ') || '無'}
    - 近期用藥史: ${userData.medications.join(', ') || '無'}
    - 血色素 (Hb): ${userData.hb} g/dL
    - 血小板 (Plt): ${userData.plt || '未提供'}
    - 凝血功能 PT/aPTT INR: ${userData.pt || '未提供'}
    - 白蛋白: ${userData.albumin || '未提供'}
    - 貧血症狀: ${userData.symptoms.join(', ') || '無'}
    - 臨床情境: ${userData.scenarios.join(', ') || '無'}

    請以 JSON 格式回覆，包含 5 個步驟的內容。
    所有內容必須為「重點條列式」，讓民眾一目了然，切勿長篇大論。語氣要溫暖人心、活潑生動。

    JSON 結構必須符合以下 Schema:
    {
      "step1": { "title": "引領使用者諮詢方向", "points": ["重點1", "重點2"] },
      "step2": { "title": "輸血替代方案提示", "points": ["替代方案1", "替代方案2"] },
      "step3": { "title": "衛教輸血的正確觀念、減少非必要輸血", "indications": ["適應症1"], "risks": ["風險1"] },
      "step4": { "title": "國內外輸血指引", "guidelines": [{"text": "指引說明", "link": "https://..."}] },
      "step5": { "title": "血品的得來不易", "points": ["重點1"] },
      "step7": { "title": "醫療專業角度的建議", "advice": ["建議1", "建議2"] }
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          step1: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              points: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          step2: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              points: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          step3: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              indications: { type: Type.ARRAY, items: { type: Type.STRING } },
              risks: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          step4: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              guidelines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    link: { type: Type.STRING }
                  }
                }
              }
            }
          },
          step5: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              points: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          step7: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              advice: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  return JSON.parse(text) as AIAdvice;
}

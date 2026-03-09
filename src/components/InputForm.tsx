import { useState } from 'react';
import { UserData } from '../types';
import { ArrowRight, ArrowLeft, Info, Activity } from 'lucide-react';

interface Props {
  initialData: UserData;
  onSubmit: (data: UserData) => void;
  onBack: () => void;
}

const HISTORY_OPTIONS = ['高血壓', '高血糖', '高血脂', '心臟疾病', '胃腸潰瘍', '大腸瘜肉痔瘡', '自體免疫疾病', '血液疾病', '慢性腎臟病', '肝硬化', '癌症'];
const MEDICATION_OPTIONS = ['抗血小板/抗凝血劑(通血路的藥)', '抗癌藥物', '免疫抑制劑', '抗生素', '止痛消炎藥'];
const SYMPTOM_OPTIONS = ['頭暈', '心悸', '全身無力', '虛弱', '四肢末梢冰冷', '喘', '尿少', '水腫'];
const SCENARIO_OPTIONS = ['感染發燒至休克狀態', '大量出血至休克狀態', '營養狀態不均衡或不佳', '近期剛接受抗癌治療', '近期剛接受免疫抑制劑治療', '近期剛接受手術', '慢性腎臟病第5期對紅血球生成素具抗性', '透析後對紅血球生成素具抗性', '肝硬化併大量腹水', '溶血'];

export default function InputForm({ initialData, onSubmit, onBack }: Props) {
  const [formData, setFormData] = useState<UserData>(initialData);
  const [otherSymptom, setOtherSymptom] = useState('');
  const [otherScenario, setOtherScenario] = useState('');

  const handleChange = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: 'history' | 'medications' | 'symptoms' | 'scenarios', option: string) => {
    setFormData(prev => {
      const list = prev[field] as string[];
      if (list.includes(option)) {
        return { ...prev, [field]: list.filter(item => item !== option) };
      } else {
        return { ...prev, [field]: [...list, option] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add "other" inputs if present
    const finalData = { ...formData };
    if (otherSymptom.trim()) {
      finalData.symptoms = [...finalData.symptoms, `其他: ${otherSymptom}`];
    }
    if (otherScenario.trim()) {
      finalData.scenarios = [...finalData.scenarios, `其他: ${otherScenario}`];
    }
    
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-100 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-stone-500" />
        </button>
        <h2 className="text-2xl font-bold text-stone-800">基本資料與現況評估</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-stone-700">年齡 <span className="text-rose-500">*</span></label>
          <input 
            type="number" 
            required 
            min="0" 
            max="120"
            value={formData.age} 
            onChange={e => handleChange('age', e.target.value ? Number(e.target.value) : '')}
            className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
            placeholder="請輸入年齡"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-stone-700">性別 <span className="text-rose-500">*</span></label>
          <div className="flex gap-4">
            {['男', '女', '其他'].map(g => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="gender" 
                  value={g} 
                  required
                  checked={formData.gender === g}
                  onChange={e => handleChange('gender', e.target.value)}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-stone-700">{g}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
            <input 
              type="checkbox" 
              checked={formData.vegetarian}
              onChange={e => handleChange('vegetarian', e.target.checked)}
              className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
            />
            <span className="font-medium text-stone-700">我是素食者</span>
          </label>
        </div>

        {/* Lab Results */}
        <div className="space-y-4 md:col-span-2 pt-4 border-t border-stone-100">
          <h3 className="font-semibold text-stone-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" /> 檢驗數值
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">最近一次血色素 (Hb) <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  required 
                  value={formData.hb} 
                  onChange={e => handleChange('hb', e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-3 pr-12 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="例如: 8.5"
                />
                <span className="absolute right-4 top-3.5 text-stone-400 text-sm">g/dL</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">最近一次血小板 (Plt) <span className="text-stone-400 font-normal">(選填)</span></label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.plt} 
                  onChange={e => handleChange('plt', e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-3 pr-16 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="例如: 150"
                />
                <span className="absolute right-4 top-3.5 text-stone-400 text-sm">10³/uL</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">凝血功能 PT/aPTT INR <span className="text-stone-400 font-normal">(選填)</span></label>
              <input 
                type="number" 
                step="0.1"
                value={formData.pt} 
                onChange={e => handleChange('pt', e.target.value ? Number(e.target.value) : '')}
                className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="例如: 1.2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">最近一次白蛋白 (Albumin) <span className="text-stone-400 font-normal">(選填)</span></label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.albumin} 
                  onChange={e => handleChange('albumin', e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-3 pr-12 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="例如: 3.5"
                />
                <span className="absolute right-4 top-3.5 text-stone-400 text-sm">g/dL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-selects */}
        <div className="space-y-4 md:col-span-2 pt-4 border-t border-stone-100">
          <h3 className="font-semibold text-stone-800">過去病史</h3>
          <div className="flex flex-wrap gap-2">
            {HISTORY_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => handleMultiSelect('history', opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  formData.history.includes(opt) 
                    ? 'bg-rose-100 border-rose-200 text-rose-800' 
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 md:col-span-2 pt-4 border-t border-stone-100">
          <h3 className="font-semibold text-stone-800">近期用藥史</h3>
          <div className="flex flex-wrap gap-2">
            {MEDICATION_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => handleMultiSelect('medications', opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  formData.medications.includes(opt) 
                    ? 'bg-blue-100 border-blue-200 text-blue-800' 
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 md:col-span-2 pt-4 border-t border-stone-100">
          <h3 className="font-semibold text-stone-800">貧血症狀</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {SYMPTOM_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => handleMultiSelect('symptoms', opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  formData.symptoms.includes(opt) 
                    ? 'bg-amber-100 border-amber-200 text-amber-800' 
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <input 
            type="text" 
            value={otherSymptom}
            onChange={e => setOtherSymptom(e.target.value)}
            placeholder="其他症狀 (請自行描述)"
            className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
          />
        </div>

        <div className="space-y-4 md:col-span-2 pt-4 border-t border-stone-100">
          <h3 className="font-semibold text-stone-800">臨床情境</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {SCENARIO_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => handleMultiSelect('scenarios', opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  formData.scenarios.includes(opt) 
                    ? 'bg-emerald-100 border-emerald-200 text-emerald-800' 
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <input 
            type="text" 
            value={otherScenario}
            onChange={e => setOtherScenario(e.target.value)}
            placeholder="其他情境 (請自行描述)"
            className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          type="submit"
          className="flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          送出評估 <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}

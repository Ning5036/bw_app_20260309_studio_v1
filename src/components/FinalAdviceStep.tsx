import { AIAdvice } from '../types';
import { ArrowRight, ArrowLeft, Stethoscope, UserCheck } from 'lucide-react';

interface Props {
  aiAdvice: AIAdvice | null;
  decision: string;
  onNext: () => void;
  onPrev: () => void;
}

export default function FinalAdviceStep({ aiAdvice, decision, onNext, onPrev }: Props) {
  if (!aiAdvice) return null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-stone-800">您的決定與專業建議</h2>
        <p className="text-xl text-stone-600">
          感謝您的參與，以下是總結與醫療團隊的建議。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* User Decision Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-rose-100 flex flex-col items-center text-center space-y-6">
          <div className="bg-rose-50 p-4 rounded-full">
            <UserCheck className="w-12 h-12 text-rose-600" />
          </div>
          <h3 className="text-2xl font-bold text-stone-800">您的選擇</h3>
          <div className="text-3xl font-black text-rose-600 tracking-wider">
            {decision}
          </div>
          <p className="text-stone-500">
            這是您基於目前資訊所做出的明智選擇。
          </p>
        </div>

        {/* AI Advice Card */}
        <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-lg flex flex-col space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-stone-800 p-3 rounded-full">
              <Stethoscope className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold">{aiAdvice.step7?.title || '醫療專業建議'}</h3>
          </div>
          
          <ul className="space-y-4 flex-grow">
            {aiAdvice.step7?.advice.map((adv, i) => (
              <li key={i} className="flex items-start gap-3 text-stone-300">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span className="leading-relaxed">{adv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> 重新選擇
        </button>
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-4 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          填寫滿意度問卷 <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

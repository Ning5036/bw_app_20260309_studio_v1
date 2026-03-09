import { AIAdvice } from '../types';
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, AlertTriangle, BookOpen, HeartPulse, ShieldAlert } from 'lucide-react';

interface Props {
  step: number; // 2 to 6
  isLoading: boolean;
  aiAdvice: AIAdvice | null;
  onNext: () => void;
  onPrev: () => void;
}

export default function JourneyStep({ step, isLoading, aiAdvice, onNext, onPrev }: Props) {
  if (isLoading || !aiAdvice) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <Loader2 className="w-16 h-16 text-rose-500 animate-spin" />
        <p className="text-xl font-medium text-stone-600 animate-pulse">AI 正在為您量身打造專屬建議，請稍候...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (step) {
      case 2: // 引領使用者諮詢方向
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-stone-800">{aiAdvice.step1?.title}</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <ul className="space-y-4">
                {aiAdvice.step1?.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-700 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 3: // 輸血替代方案提示
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <HeartPulse className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-stone-800">{aiAdvice.step2?.title}</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <ul className="space-y-4">
                {aiAdvice.step2?.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-700 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 4: // 衛教輸血的正確觀念
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <ShieldAlert className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-stone-800">{aiAdvice.step3?.title}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h3 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
                  👍 適應症
                </h3>
                <ul className="space-y-3">
                  {aiAdvice.step3?.indications.map((ind, i) => (
                    <li key={i} className="flex items-start gap-2 text-stone-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h3 className="text-xl font-bold text-rose-700 mb-4 flex items-center gap-2">
                  ⚠️ 可能風險
                </h3>
                <ul className="space-y-3">
                  {aiAdvice.step3?.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-stone-700">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      case 5: // 國內外輸血指引
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-stone-800">{aiAdvice.step4?.title}</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <ul className="space-y-4">
                {aiAdvice.step4?.guidelines.map((guide, i) => (
                  <li key={i} className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <p className="text-stone-800 font-medium mb-2">{guide.text}</p>
                    <a href={guide.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                      參閱文獻 <ArrowRight className="w-4 h-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 6: // 血品的得來不易
        return (
          <div className="space-y-6">
            <div className="bg-rose-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <HeartPulse className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="text-3xl font-bold text-stone-800">{aiAdvice.step5?.title}</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <ul className="space-y-4">
                {aiAdvice.step5?.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-700 text-lg">
                    <div className="w-2 h-2 rounded-full bg-rose-400 mt-2.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8 flex justify-center gap-2">
        {[2, 3, 4, 5, 6].map(s => (
          <div 
            key={s} 
            className={`h-2 rounded-full transition-all duration-300 ${
              s === step ? 'w-12 bg-rose-500' : s < step ? 'w-8 bg-rose-200' : 'w-8 bg-stone-200'
            }`} 
          />
        ))}
      </div>

      {renderContent()}

      <div className="mt-12 flex justify-between items-center">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> 上一步
        </button>
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          下一步 <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

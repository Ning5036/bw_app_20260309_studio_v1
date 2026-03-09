import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  onDecision: (decision: string) => void;
  onPrev: () => void;
}

export default function DecisionStep({ onDecision, onPrev }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-12 py-8">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-stone-800">最後決定</h2>
        <p className="text-xl text-stone-600">
          經過前面的資訊與評估，您現在的想法是？
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button 
          onClick={() => onDecision('我要輸血')}
          className="group relative flex flex-col items-center justify-center p-10 bg-white border-2 border-rose-100 rounded-3xl hover:border-rose-500 hover:shadow-xl transition-all hover:-translate-y-2"
        >
          <div className="bg-rose-50 p-4 rounded-full mb-6 group-hover:bg-rose-100 transition-colors">
            <CheckCircle className="w-12 h-12 text-rose-600" />
          </div>
          <span className="text-2xl font-bold text-stone-800">我要輸血</span>
          <p className="text-stone-500 mt-2 text-sm">我了解相關風險與必要性，決定接受輸血治療。</p>
        </button>

        <button 
          onClick={() => onDecision('我不要輸血')}
          className="group relative flex flex-col items-center justify-center p-10 bg-white border-2 border-emerald-100 rounded-3xl hover:border-emerald-500 hover:shadow-xl transition-all hover:-translate-y-2"
        >
          <div className="bg-emerald-50 p-4 rounded-full mb-6 group-hover:bg-emerald-100 transition-colors">
            <XCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-stone-800">我不要輸血</span>
          <p className="text-stone-500 mt-2 text-sm">我想先嘗試替代方案或再與醫師討論其他選擇。</p>
        </button>
      </div>

      <div className="pt-8">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors font-medium mx-auto"
        >
          <ArrowLeft className="w-5 h-5" /> 重新回顧資訊
        </button>
      </div>
    </div>
  );
}

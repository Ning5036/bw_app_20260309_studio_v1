import { Activity, ArrowRight, Users, Calendar } from 'lucide-react';

interface Props {
  onStart: () => void;
  visits: { today: number; total: number };
}

export default function LandingPage({ onStart, visits }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-12">
      <div className="bg-rose-100 p-6 rounded-full shadow-inner mb-4">
        <Activity className="w-24 h-24 text-rose-600" />
      </div>
      
      <h2 className="text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">
        我需要輸血嗎？
      </h2>
      
      <p className="text-xl text-stone-600 max-w-2xl leading-relaxed">
        這是一個互動式 AI 明智選擇小工具，幫助您了解輸血的必要性、替代方案與風險。
        讓我們一起做出最適合您的醫療選擇。
      </p>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 max-w-md w-full text-left space-y-4">
        <h3 className="font-semibold text-stone-800 flex items-center gap-2">
          <span className="bg-rose-100 text-rose-700 p-1 rounded">💡</span> 
          為什麼要使用這個工具？
        </h3>
        <ul className="text-stone-600 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
            了解輸血的真正適應症與潛在風險
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
            探索是否有更安全的替代治療方案
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
            為醫病溝通做好準備，共同決策
          </li>
        </ul>
        <p className="text-xs text-stone-400 mt-4 italic">
          * 本工具非診斷工具，僅用於協助醫病對話，具體醫療決策請與您的主治醫師討論。
        </p>
      </div>

      <button 
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-rose-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-600 hover:bg-rose-700 hover:shadow-lg hover:-translate-y-1"
      >
        開始評估
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="flex gap-8 mt-12 text-stone-500 text-sm">
        <div className="flex flex-col items-center">
          <Calendar className="w-5 h-5 mb-1 text-stone-400" />
          <span>今日造訪: <strong className="text-stone-700">{visits.today}</strong></span>
        </div>
        <div className="flex flex-col items-center">
          <Users className="w-5 h-5 mb-1 text-stone-400" />
          <span>累積造訪: <strong className="text-stone-700">{visits.total}</strong></span>
        </div>
      </div>
    </div>
  );
}

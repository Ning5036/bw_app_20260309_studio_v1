import { useState } from 'react';
import { SurveyData } from '../types';
import { Star, Send } from 'lucide-react';

interface Props {
  onSubmit: (data: SurveyData) => void;
}

export default function SurveyStep({ onSubmit }: Props) {
  const [satisfaction, setSatisfaction] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [improvedUnderstanding, setImprovedUnderstanding] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (satisfaction === 0) {
      alert('請給予滿意度評分');
      return;
    }
    if (!improvedUnderstanding) {
      alert('請選擇是否對輸血有更正確的觀念');
      return;
    }
    onSubmit({ satisfaction, improvedUnderstanding, feedback });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-stone-800">滿意度問卷調查</h2>
        <p className="text-xl text-stone-600">
          您的回饋能幫助我們持續優化這個工具，提供更好的服務。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100 space-y-10">
        
        {/* Rating */}
        <div className="space-y-6 text-center">
          <label className="block text-lg font-bold text-stone-800">
            您對本次互動體驗的滿意度？ <span className="text-rose-500">*</span>
          </label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setSatisfaction(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-2 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star 
                  className={`w-12 h-12 ${
                    star <= (hoveredStar || satisfaction) 
                      ? 'fill-amber-400 text-amber-400' 
                      : 'text-stone-200'
                  } transition-colors`} 
                />
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm text-stone-400 px-8">
            <span>非常不滿意</span>
            <span>非常滿意</span>
          </div>
        </div>

        {/* Improved Understanding */}
        <div className="space-y-6">
          <label className="block text-lg font-bold text-stone-800 text-center">
            透過這個工具，您對輸血是否有更正確的觀念？ <span className="text-rose-500">*</span>
          </label>
          <div className="flex justify-center gap-6">
            {['是，非常有幫助', '有一點幫助', '沒有改變', '反而更困惑'].map(option => (
              <label key={option} className="flex flex-col items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="improved" 
                  value={option} 
                  required
                  checked={improvedUnderstanding === option}
                  onChange={e => setImprovedUnderstanding(e.target.value)}
                  className="w-6 h-6 text-rose-600 focus:ring-rose-500 border-stone-300"
                />
                <span className="text-stone-600 group-hover:text-stone-900 transition-colors text-sm font-medium">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-4">
          <label className="block text-lg font-bold text-stone-800">
            活動建議或想說的話 <span className="text-stone-400 font-normal text-sm">(選填)</span>
          </label>
          <textarea 
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            rows={4}
            className="w-full p-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-rose-500 outline-none resize-none"
            placeholder="請分享您的寶貴意見..."
          />
        </div>

        <div className="pt-8 flex justify-center">
          <button 
            type="submit"
            className="flex items-center gap-3 px-10 py-4 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all hover:-translate-y-1 hover:shadow-lg text-lg"
          >
            送出問卷 <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

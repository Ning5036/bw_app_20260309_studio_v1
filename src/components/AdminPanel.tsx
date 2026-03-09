import { useState } from 'react';
import { X, Download, ShieldAlert, Lock } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsDownloading(true);

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('密碼錯誤');
        }
        throw new Error('下載失敗');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bloodwise_data.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      onClose(); // Close panel on success
    } catch (err: any) {
      setError(err.message || '發生未知錯誤');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-rose-100 p-4 rounded-full">
              <ShieldAlert className="w-10 h-10 text-rose-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-stone-800 mb-2">管理員下載區</h2>
          <p className="text-center text-stone-500 mb-8 text-sm">
            請輸入管理員密碼以下載活動效益分析報表 (Excel)
          </p>

          <form onSubmit={handleDownload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">密碼</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                  placeholder="請輸入密碼"
                />
              </div>
              {error && <p className="text-rose-500 text-sm mt-2 flex items-center gap-1"><X className="w-4 h-4" /> {error}</p>}
            </div>

            <button 
              type="submit"
              disabled={isDownloading || !password}
              className="w-full flex items-center justify-center gap-2 py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <span className="animate-pulse">下載中...</span>
              ) : (
                <>
                  <Download className="w-5 h-5" /> 下載報表
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

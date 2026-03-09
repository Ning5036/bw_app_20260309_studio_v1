/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Heart, Droplets, ArrowRight, ArrowLeft, Download, ShieldCheck, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { UserData, AIAdvice, SurveyData } from './types';
import LandingPage from './components/LandingPage';
import InputForm from './components/InputForm';
import JourneyStep from './components/JourneyStep';
import DecisionStep from './components/DecisionStep';
import FinalAdviceStep from './components/FinalAdviceStep';
import SurveyStep from './components/SurveyStep';
import AdminPanel from './components/AdminPanel';
import { generateAIAdvice } from './services/geminiService';

export default function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    age: '',
    gender: '',
    vegetarian: false,
    history: [],
    medications: [],
    hb: '',
    plt: '',
    pt: '',
    albumin: '',
    symptoms: [],
    scenarios: [],
  });
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [decision, setDecision] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [visits, setVisits] = useState({ today: 0, total: 0 });

  useEffect(() => {
    // Record visit
    fetch('/api/visits', { method: 'POST' })
      .then(() => fetch('/api/visits'))
      .then(res => res.json())
      .then(data => setVisits(data))
      .catch(err => console.error('Failed to record visit', err));
  }, []);

  const handleFormSubmit = async (data: UserData) => {
    setUserData(data);
    setIsLoading(true);
    setStep(2); // Move to loading state / first step
    try {
      const advice = await generateAIAdvice(data);
      setAiAdvice(advice);
    } catch (error) {
      console.error('Failed to generate AI advice', error);
      alert('AI 生成失敗，請稍後再試。');
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecision = (choice: string) => {
    setDecision(choice);
    setStep(8);
  };

  const handleSurveySubmit = async (survey: SurveyData) => {
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          ai_advice: aiAdvice,
          user_decision: decision,
          survey_satisfaction: survey.satisfaction,
          survey_improved: survey.improvedUnderstanding,
          survey_feedback: survey.feedback
        })
      });
      alert('感謝您的填寫！');
      setStep(0); // Go back to start
      setUserData({
        age: '', gender: '', vegetarian: false, history: [], medications: [],
        hb: '', plt: '', pt: '', albumin: '', symptoms: [], scenarios: []
      });
      setAiAdvice(null);
      setDecision('');
    } catch (error) {
      console.error('Failed to submit', error);
      alert('提交失敗，請稍後再試。');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-rose-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep(0)}>
            <Droplets className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-wide">血智多謀：輸血明智選擇</h1>
          </div>
          <button onClick={() => setIsAdminOpen(true)} className="text-rose-100 hover:text-white transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start p-4 md:p-8 w-full max-w-4xl mx-auto relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
              <LandingPage onStart={() => setStep(1)} visits={visits} />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full">
              <InputForm initialData={userData} onSubmit={handleFormSubmit} onBack={() => setStep(0)} />
            </motion.div>
          )}
          {step >= 2 && step <= 6 && (
            <motion.div key={`step${step}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full">
              <JourneyStep 
                step={step} 
                isLoading={isLoading} 
                aiAdvice={aiAdvice} 
                onNext={() => setStep(step + 1)} 
                onPrev={() => setStep(step - 1)} 
              />
            </motion.div>
          )}
          {step === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full">
              <DecisionStep onDecision={handleDecision} onPrev={() => setStep(6)} />
            </motion.div>
          )}
          {step === 8 && (
            <motion.div key="step8" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full">
              <FinalAdviceStep aiAdvice={aiAdvice} decision={decision} onNext={() => setStep(9)} onPrev={() => setStep(7)} />
            </motion.div>
          )}
          {step === 9 && (
            <motion.div key="step9" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="w-full">
              <SurveyStep onSubmit={handleSurveySubmit} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-300 py-6 text-center text-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          <p className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-500" /> 減血一袋 救人一命</p>
          <p className="flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500" /> 謹慎用血 才能救命</p>
          <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-400" /> 有7就好 不比感到7上8下</p>
        </div>
      </footer>

      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}

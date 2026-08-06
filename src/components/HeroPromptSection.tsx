import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Gift, Wand2, Lightbulb, Heart, Paperclip, Mic, MicOff, AlertCircle, ArrowRight, ChevronRight, Check, Pencil } from 'lucide-react';
import HapyMascot from './HapyMascot';
import { translations, Language } from '../i18n/translations';

interface HeroPromptSectionProps {
  onGenerateAIBox: (promptText: string, budget: number) => void;
  isLoading: boolean;
  lang?: Language;
}

export default function HeroPromptSection({ onGenerateAIBox, isLoading, lang = 'tr' }: HeroPromptSectionProps) {
  const [mode, setMode] = useState<'text' | 'wizard'>('text');
  const [promptInput, setPromptInput] = useState('');
  const [maxBudget, setMaxBudget] = useState(1000);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceErrorMessage, setVoiceErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const shouldKeepListeningRef = useRef<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Wizard Quiz state
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wRecipient, setWRecipient] = useState<string>('Yakın Arkadaşım');
  const [wVibe, setWVibe] = useState<string>('🛋️ Ev Kuşu & Battaniye Gurmesi');
  const [wDetail, setWDetail] = useState<string>('');
  const [wBudget, setWBudget] = useState<number>(1000);

  const tHero = translations[lang].hero;

  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSpeechSupported(false);
    }

    return () => {
      shouldKeepListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const handleToggleVoice = (targetSetter: (val: string) => void = setPromptInput) => {
    setVoiceErrorMessage(null);

    // If currently listening, stop it
    if (shouldKeepListeningRef.current) {
      shouldKeepListeningRef.current = false;
      setIsListening(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceErrorMessage(
        lang === 'tr'
          ? 'Tarayıcınız sesli komut özelliğini desteklemiyor. Lütfen Chrome veya Edge kullanın.'
          : 'Voice recognition is not supported in this browser.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = lang === 'en' ? 'en-US' : 'tr-TR';
      recognition.continuous = true; // Continuous listening for long sentences & pauses
      recognition.interimResults = true;

      shouldKeepListeningRef.current = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0]?.transcript || '')
          .join('');
        targetSetter(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          shouldKeepListeningRef.current = false;
          setIsListening(false);
          setVoiceErrorMessage(
            lang === 'tr'
              ? 'Mikrofon izni verilmedi. Lütfen adresteki kilit/mikrofon simgesinden izin verin.'
              : 'Microphone permission denied. Please grant permission in browser settings.'
          );
        } else if (event.error === 'no-speech') {
          // Keep listening even if silent for a bit
        } else {
          setVoiceErrorMessage(
            lang === 'tr'
              ? 'Ses algılanırken bir aksama oluştu. Tekrar mikrofona konuşabilirsiniz.'
              : 'Voice recognition interrupted. You can speak again.'
          );
        }
      };

      recognition.onend = () => {
        // Automatically restart if user hasn't pressed stop explicitly
        if (shouldKeepListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition exception:', err);
      shouldKeepListeningRef.current = false;
      setIsListening(false);
      setVoiceErrorMessage(
        lang === 'tr'
          ? 'Mikrofon başlatılamadı. Lütfen mikrofonunuzu kontrol edin.'
          : 'Failed to start microphone.'
      );
    }
  };

  const examplePrompts = lang === 'en' ? [
    {
      label: 'Trojan / Humor',
      text: 'My witty best friend’s birthday is coming up! He loves lighthearted pranks and humor, so I want to celebrate his special day with an unforgettable, hilarious surprise gift box.',
      icon: '🎭'
    },
    {
      label: 'Eskişehir Spirit',
      text: 'Just because I miss old times and want to send a thoughtful surprise with no special occasion, I want a nostalgic gift box with artisan coffee and local ceramics for my architect friend who studied in Eskişehir.',
      icon: '🏛️'
    },
    {
      label: 'New Career',
      text: 'To congratulate my highly organized colleague on her promotion to manager, I want to send a stylish desktop planner and gourmet coffee gift box to celebrate her career achievement!',
      icon: '💼'
    },
  ] : [
    {
      label: 'Truva / Espri Tutkunu',
      text: 'Espri anlayışı yüksek ve sürprizleri seven yakın arkadaşımın yaklaşan doğum gününü kutlamak için neşeli, komik ve unutulmaz bir şaka hediye kutusu hazırlamak istiyorum.',
      icon: '🎭'
    },
    {
      label: 'Eskişehir Ruhu',
      text: 'Herhangi bir özel gün olmadan, tamamen içimden geldiği için Eskişehir\'de okumuş mimar arkadaşıma eski günleri yâd ettirecek kahve ve şehir temalı nostaljik bir sürpriz kutusu göndermek istiyorum.',
      icon: '🏛️'
    },
    {
      label: 'Yeni İş Heyecanı',
      text: 'Yeni yönetici pozisyonuna terfi eden düzenli ve kahve tutkunu meslektaşımın bu harika kariyer başarısını tebrik etmek ve kutlamak için masasına yakışacak şık bir kutu hazırlamak istiyorum.',
      icon: '💼'
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onGenerateAIBox(promptInput.trim(), maxBudget);
  };

  const handleWizardSubmit = () => {
    const combinedPrompt = `${wRecipient} için özel bir hediye kutusu arıyorum. Tarzı/Ruhu: ${wVibe}.${wDetail.trim() ? ` Özel Detay: ${wDetail.trim()}.` : ''}`;
    onGenerateAIBox(combinedPrompt, wBudget);
  };

  const handleSelectExample = (text: string) => {
    setMode('text');
    setPromptInput(text);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <section id="ai-prompt-hero" className="relative pt-10 pb-16 bg-[#FAF6F0] overflow-hidden">
      
      {/* Subtle Lilac & Cream Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-normal text-slate-900 tracking-tight font-serif leading-tight">
          {tHero.titleStart} <span className="text-purple-800 italic font-medium">{tHero.titleHighlight}</span> {tHero.titleEnd}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          {tHero.subtitle}
        </p>

        {/* Mode Selector Buttons */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 max-w-xl mx-auto bg-purple-50/80 p-1.5 rounded-2xl border border-purple-100/80 shadow-inner">
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`flex-1 py-2.5 px-2.5 sm:px-4 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mode === 'text'
                ? 'bg-white text-purple-900 shadow-xs border border-purple-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-sm shrink-0">✏️</span>
            <span>{lang === 'tr' ? 'Kendim Tarif Etmek İstiyorum' : 'Write My Own Description'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('wizard')}
            className={`flex-1 py-2.5 px-2.5 sm:px-4 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mode === 'wizard'
                ? 'bg-white text-purple-900 shadow-xs border border-purple-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-sm shrink-0">🪄</span>
            <span>{lang === 'tr' ? 'Joy-Genie İle Adım Adım Oluştur' : 'Step-by-Step Wizard'}</span>
          </button>
        </div>

        {/* Prompt Card Outer Box - SPECTACULAR FOCAL POINT */}
        <div className="bg-white/95 rounded-[40px] p-6 sm:p-9 shadow-xl border-2 border-purple-200/90 max-w-3xl mx-auto relative group text-left ring-8 ring-purple-100/50">
          <div className="absolute -top-4 -right-2 sm:-right-4 bg-purple-900 text-purple-100 px-4 py-1.5 rounded-2xl rotate-3 text-[11px] font-extrabold tracking-wider shadow-md border border-purple-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>JOY-GENIE AI</span>
          </div>

          {/* MODE 1: Step-by-Step Interactive Wizard Mode */}
          {mode === 'wizard' ? (
            <div className="space-y-6">
              {/* Visual Step Progression Header with Arrows */}
              <div className="bg-purple-50/90 p-3 sm:p-4 rounded-2xl border border-purple-200/90">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-2.5">
                  <span className="text-purple-900 font-extrabold flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>{lang === 'tr' ? 'Adım Adım Sihirli Kutu Sihirbazı' : 'Step-by-Step Magic Box Wizard'}</span>
                  </span>
                  <span className="bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                    {lang === 'tr' ? `Şu anki Adım: ${wizardStep} / 4` : `Current Step: ${wizardStep} / 4`}
                  </span>
                </div>

                {/* Step Cards with Arrows between them */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2 items-center">
                  {[
                    { step: 1, title: lang === 'tr' ? '1. Kime?' : '1. Recipient', desc: wRecipient || (lang === 'tr' ? 'Alıcı Seçimi' : 'Recipient') },
                    { step: 2, title: lang === 'tr' ? '2. Ruh Hali' : '2. Vibe', desc: wVibe ? wVibe.replace(/^[^\s]+\s*/, '').split('&')[0].trim() : (lang === 'tr' ? 'Ruh Hali' : 'Vibe') },
                    { step: 3, title: lang === 'tr' ? '3. Özel Detay' : '3. Detail', desc: wDetail ? (lang === 'tr' ? 'Eklendi ✓' : 'Added ✓') : (lang === 'tr' ? 'İsteğe Bağlı' : 'Optional') },
                    { step: 4, title: lang === 'tr' ? '4. Bütçe' : '4. Budget', desc: `${wBudget} TL` },
                  ].map((s) => {
                    const isActive = wizardStep === s.step;
                    const isPassed = wizardStep > s.step;
                    return (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => setWizardStep(s.step)}
                        className={`p-2.5 rounded-xl text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400 scale-[1.02]'
                            : isPassed
                            ? 'bg-purple-100 text-purple-950 hover:bg-purple-200 border border-purple-200'
                            : 'bg-white text-slate-400 hover:bg-stone-50 border border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] sm:text-xs font-extrabold truncate">{s.title}</span>
                          {isPassed && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-[9px] sm:text-[10px] truncate mt-1 font-medium ${
                            isActive ? 'text-purple-100' : isPassed ? 'text-purple-700 font-bold' : 'text-slate-400'
                          }`}
                        >
                          {s.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Arrow Progression Line */}
                <div className="flex items-center justify-between px-3 mt-2.5 text-purple-300">
                  <div className={`flex-1 h-0.5 rounded transition-all ${wizardStep > 1 ? 'bg-purple-600' : 'bg-purple-200'}`} />
                  <span className={`px-1.5 text-xs font-extrabold transition-all ${wizardStep >= 2 ? 'text-purple-700' : 'text-purple-300'}`}>➔</span>
                  <div className={`flex-1 h-0.5 rounded transition-all ${wizardStep > 2 ? 'bg-purple-600' : 'bg-purple-200'}`} />
                  <span className={`px-1.5 text-xs font-extrabold transition-all ${wizardStep >= 3 ? 'text-purple-700' : 'text-purple-300'}`}>➔</span>
                  <div className={`flex-1 h-0.5 rounded transition-all ${wizardStep > 3 ? 'bg-purple-600' : 'bg-purple-200'}`} />
                  <span className={`px-1.5 text-xs font-extrabold transition-all ${wizardStep >= 4 ? 'text-purple-700' : 'text-purple-300'}`}>➔</span>
                  <div className={`flex-1 h-0.5 rounded transition-all ${wizardStep >= 4 ? 'bg-purple-600' : 'bg-purple-200'}`} />
                </div>
              </div>

              {/* STEP 1: Recipient */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">1</span>
                      <span>{lang === 'tr' ? 'Hediyeyi kime alıyoruz?' : 'Who are we getting the gift for?'}</span>
                    </h3>
                    <span className="text-xs text-purple-700 font-semibold">{lang === 'tr' ? 'Lütfen bir seçenek seçip ilerleyin' : 'Select an option to proceed'}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { label: lang === 'tr' ? 'Yakın Arkadaşım' : 'Best Friend', icon: '👯' },
                      { label: lang === 'tr' ? 'Sevgilim / Eşim' : 'Partner / Spouse', icon: '💖' },
                      { label: lang === 'tr' ? 'İş Arkadaşım' : 'Colleague', icon: '💼' },
                      { label: lang === 'tr' ? 'Annem / Babam' : 'Parents', icon: '🏡' },
                      { label: lang === 'tr' ? 'Kardeşim' : 'Sibling', icon: '🎈' },
                      { label: lang === 'tr' ? 'Kendim için' : 'For Myself', icon: '✨' },
                    ].map((opt) => {
                      const isSelected = wRecipient === opt.label;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => {
                            setWRecipient(opt.label);
                          }}
                          className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between text-left cursor-pointer ${
                            isSelected
                              ? 'bg-purple-100/90 border-purple-500 text-purple-950 shadow-sm ring-2 ring-purple-300'
                              : 'bg-stone-50 border-purple-100 hover:bg-purple-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{opt.icon}</span>
                            <span>{opt.label}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-purple-700 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explicit Bottom Navigation for Step 1 */}
                  <div className="pt-4 border-t border-purple-100 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-600 font-medium">
                      {lang === 'tr' ? 'Seçilen Alıcı:' : 'Selected Recipient:'} <strong className="text-purple-900 font-extrabold">{wRecipient}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{lang === 'tr' ? 'Devam Et (2. Adım: Ruh Hali)' : 'Continue (Step 2: Vibe)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Vibe & Personality */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">2</span>
                      <span>{lang === 'tr' ? 'Peki ruh hali veya tutkusu nasıl biri?' : 'What is their personality or passion?'}</span>
                    </h3>
                    <span className="text-xs text-purple-700 font-semibold">{lang === 'tr' ? 'İlgi alanını seçip devam edin' : 'Select an interest to proceed'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(lang === 'tr' ? [
                      { label: '🛋️ Ev Kuşu & Battaniye Gurmesi', desc: 'Evden dışarı adım atmak yerine sıcak köşesinde huzur arayanlar' },
                      { label: '✈️ Bitmeyen Bilet Peşinde Gezgin', desc: 'Valizi her an kapıda, aklı hep yeni rotalarda ve keşiflerde' },
                      { label: '📚 Satır Aralarında Kaybolan Kitap Kurdu', desc: 'Sıcak içeceğini kapıp romanlar arasında dünyadan kopanlar' },
                      { label: '🎮 Gece 3’e Kadar Oyuncu (Gamer)', desc: 'Ekran başında zamanı unutan, strateji ve dijital macera sevdalısı' },
                      { label: '🥗 Detoks & Sağlıklı Yaşam Guru’su', desc: 'Matını kapıp yaşam energisi saçan, wellbeing ve fit yaşam aşığı' },
                      { label: '🍕 Damak Tadı Yüksek Lezzet Avcısı (Gurme)', desc: 'Nerede ne yenir çok iyi bilen, gurme lezzetlere asla hayır diyemeyen' },
                      { label: '🎬 Popcorn Canavarı & Mizah (Meme) Gurmesi', desc: 'Sürekli dizi/film izleyen, en güncel sosyal medya esprilerine ve komikliğe doyamayanlar' },
                      { label: '🐈 Patili Dost Aşığı & Hayvansever', desc: 'Tüm gün kedisiyle/köpeğiyle konuşup dostunu şımartanlar' },
                    ] : [
                      { label: '🛋️ Homebody & Cozy Vibe Guru', desc: 'Loves relaxing in a warm, cozy corner at home' },
                      { label: '✈️ Frequent Traveler & Wanderlust', desc: 'Suitcase always packed, dreaming of new adventures' },
                      { label: '📚 Bookworm & Literature Lover', desc: 'Sipping hot drinks surrounded by great novels' },
                      { label: '🎮 Late-Night Gamer', desc: 'Losing track of time in digital adventures' },
                      { label: '🥗 Wellbeing & Fitness Enthusiast', desc: 'Spreading positive health energy and fitness vibes' },
                      { label: '🍕 Gourmet Food Hunter', desc: 'Loves discovering gourmet treats and delicacies' },
                      { label: '🎬 Movie Buff & Humor Lover', desc: 'Binge-watching shows, enjoying great humor' },
                      { label: '🐈 Pet Parent & Animal Lover', desc: 'Talking to pets all day and pampering them' },
                    ]).map((opt) => {
                      const isSelected = wVibe === opt.label;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => {
                            setWVibe(opt.label);
                          }}
                          className={`p-3.5 rounded-2xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-purple-100/90 border-purple-500 text-purple-950 shadow-sm ring-2 ring-purple-300'
                              : 'bg-stone-50 border-purple-100 hover:bg-purple-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="block font-extrabold">{opt.label}</span>
                            <span className="block text-[10px] text-slate-500 mt-0.5">{opt.desc}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-purple-700 stroke-[3] shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explicit Bottom Navigation for Step 2 */}
                  <div className="pt-4 border-t border-purple-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="text-xs font-bold text-slate-600 hover:text-purple-900 bg-stone-100 hover:bg-stone-200 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{lang === 'tr' ? '← 1. Adıma Dön' : '← Back to Step 1'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{lang === 'tr' ? 'Devam Et (3. Adım: Özel Detay)' : 'Continue (Step 3: Special Detail)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Special Detail */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">3</span>
                      <span>{lang === 'tr' ? 'Onunla ilgili esprili veya özel bir detay söylemek ister misin?' : 'Any funny or special detail about them you would like to include?'}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleToggleVoice((val) => setWDetail(val))}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isListening
                          ? 'bg-purple-700 text-white border-purple-800 animate-pulse'
                          : 'bg-white hover:bg-purple-100 text-purple-800 border-purple-200'
                      }`}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-purple-700" />}
                      <span>{lang === 'tr' ? (isListening ? 'Dur' : 'Sesli Anlat 🎙️') : (isListening ? 'Stop' : 'Voice Input 🎙️')}</span>
                    </button>
                  </div>

                  {isListening && (
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-800 bg-purple-100 px-3.5 py-1.5 rounded-full border border-purple-300 animate-pulse">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping"></span>
                      <span>{lang === 'tr' ? 'Sesiniz Dinleniyor... Konuşun 🎙️' : 'Listening to your voice... Speak now 🎙️'}</span>
                    </div>
                  )}

                  <textarea
                    value={wDetail}
                    onChange={(e) => setWDetail(e.target.value)}
                    placeholder={lang === 'tr' 
                      ? "Örn: Eskişehir hastası, çocukluk arkadaşım, kahveyi şekersiz içer, mimar, sürekli komik kedi videoları paylaşır..."
                      : "e.g., Loves Eskişehir, childhood friend, drinks coffee unsweetened, architect, loves cat videos..."}
                    rows={3}
                    className="w-full text-xs p-3.5 rounded-2xl bg-stone-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800"
                  />

                  {/* Explicit Bottom Navigation for Step 3 */}
                  <div className="pt-4 border-t border-purple-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="text-xs font-bold text-slate-600 hover:text-purple-900 bg-stone-100 hover:bg-stone-200 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{lang === 'tr' ? '← 2. Adıma Dön' : '← Back to Step 2'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{lang === 'tr' ? 'Devam Et (4. Adım: Bütçe)' : 'Continue (Step 4: Budget)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Budget & Confirm */}
              {wizardStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">4</span>
                      <span>{lang === 'tr' ? 'Yaklaşık bütçen nedir?' : 'What is your target budget?'}</span>
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {[500, 850, 1200, 1800, 2500].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setWBudget(b)}
                        className={`w-24 h-10 rounded-xl text-xs font-extrabold border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                          wBudget === b
                            ? 'bg-purple-700 text-white border-purple-700 shadow-md ring-2 ring-purple-300'
                            : 'bg-stone-50 text-slate-700 border-purple-100 hover:bg-purple-50'
                        }`}
                      >
                        <span>{b} TL</span>
                        {wBudget === b && (
                          <Heart className="w-3.5 h-3.5 text-pink-300 fill-pink-300 shrink-0 animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Summary Box Before Generation */}
                  <div className="p-3.5 bg-purple-50/80 rounded-2xl border border-purple-200 text-xs text-slate-700 space-y-1">
                    <div className="font-extrabold text-purple-950 flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>{lang === 'tr' ? 'Kutunuz İçin Hazırlanan Konsept Özeti:' : 'Curated Concept Summary:'}</span>
                    </div>
                    <div>• <strong>{lang === 'tr' ? 'Hediyeyi Alan:' : 'Recipient:'}</strong> {wRecipient}</div>
                    <div>• <strong>{lang === 'tr' ? 'Ruh Hali / İlgi Alanı:' : 'Vibe / Interest:'}</strong> {wVibe}</div>
                    {wDetail && <div>• <strong>{lang === 'tr' ? 'Özel Detay:' : 'Special Detail:'}</strong> "{wDetail}"</div>}
                  </div>

                  {/* Explicit Bottom Navigation for Step 4 */}
                  <div className="pt-4 border-t border-purple-100 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="text-xs font-bold text-slate-600 hover:text-purple-900 bg-stone-100 hover:bg-stone-200 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{lang === 'tr' ? '← 3. Adıma Dön' : '← Back to Step 3'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWizardSubmit}
                      disabled={isLoading}
                      className="bg-purple-700 hover:bg-purple-800 active:scale-98 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{lang === 'tr' ? `🪄 Sihirli Kutumu Oluştur (${wBudget} TL)` : `🪄 Create My Magic Box (${wBudget} TL)`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* MODE 2: Direct Free Text Prompt Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative bg-stone-50 hover:bg-white focus-within:bg-white rounded-2xl p-4 sm:p-5 border border-purple-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
                {isListening && (
                  <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-purple-900 bg-purple-100 px-3.5 py-1.5 rounded-full border border-purple-300 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping"></span>
                    <span>{lang === 'tr' ? '🎙️ Sesiniz Kesintisiz Dinleniyor... Mikrofona Konuşun' : '🎙️ Continuous Voice Listening... Speak into microphone'}</span>
                  </div>
                )}

                {voiceErrorMessage && (
                  <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{voiceErrorMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVoiceErrorMessage(null)}
                      className="text-[10px] font-bold text-amber-800 hover:underline"
                    >
                      {lang === 'tr' ? 'Kapat' : 'Close'}
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2.5 mb-3.5 bg-purple-50/60 p-2.5 rounded-2xl border border-purple-100">
                  <HapyMascot size="sm" level="Süper Happinio" showEvolutionBadge={false} />
                  <span className="text-xs font-bold text-purple-950">
                    {lang === 'tr' 
                      ? 'Hediye alacağın kişiyi bana tarif et, gerisini ben halledeyim! 🌸' 
                      : 'Describe the recipient to me, and I will handle the rest! 🌸'}
                  </span>
                </div>

                <textarea
                  ref={textareaRef}
                  value={promptInput}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      setPromptInput(e.target.value);
                    }
                  }}
                  placeholder={lang === 'tr'
                    ? "Örn: Eskişehir'de mimar olan, kahve tutkunu ve espri yapmayı seven çocukluk arkadaşım için doğum günü hediyesi..."
                    : "e.g., Birthday surprise for my architect friend who studied in Eskişehir, loves coffee, humor, and design..."}
                  rows={3}
                  maxLength={300}
                  className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 italic text-sm sm:text-base resize-none font-normal"
                />

                <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400 mt-2 border-t border-purple-100/80 pt-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleToggleVoice(setPromptInput)}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                        isListening
                          ? 'bg-purple-700 text-white border-purple-800 shadow-md animate-bounce'
                          : 'bg-white hover:bg-purple-100 text-purple-800 border-purple-200'
                      }`}
                      title={lang === 'tr' ? "Mikrofon İle Konuş" : "Speak into Microphone"}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-purple-700" />}
                      <span>{lang === 'tr' ? (isListening ? 'Dinlemeyi Durdur' : 'Sesli Komut Ver 🎙️') : (isListening ? 'Stop Listening' : 'Voice Command 🎙️')}</span>
                    </button>
                  </div>
                  <span>{promptInput.length}/300</span>
                </div>
              </div>

              {/* Budget Range & Trigger Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                
                {/* Budget Selector */}
                <div className="flex items-center gap-3 w-full sm:w-auto text-left px-2 select-none">
                  <span className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center min-w-[155px]">
                    <span className="shrink-0">{tHero.budgetLabel}</span>
                    <span className="text-purple-800 font-serif italic text-sm tabular-nums w-16 text-right shrink-0 ml-1">
                      {maxBudget} TL
                    </span>
                  </span>
                  <input
                    type="range"
                    min="400"
                    max="2500"
                    step="50"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-32 sm:w-40 accent-purple-600 cursor-pointer shrink-0"
                  />
                </div>

                {/* Submit AI Button */}
                <button
                  type="submit"
                  disabled={isLoading || !promptInput.trim()}
                  className="w-full sm:w-auto bg-purple-800 hover:bg-purple-900 text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shrink-0"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{tHero.buttonLoading}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{tHero.buttonNormal}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Quick Prompt Chips & Tags (Shown when 'Kendim Tarif Etmek İstiyorum' is selected) */}
          {mode === 'text' && (
            <div className="mt-6 text-left border-t border-purple-100 pt-4">
              <p className="text-xs text-slate-500 mb-3.5 leading-relaxed bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100/50">
                {lang === 'tr' 
                  ? '💡 Nasıl tarif edeceğinizi bilemediniz mi? Aşağıdaki popüler hediye tariflerinden birine tıkladığınızda, o şablon yukarıdaki metin alanına otomatik olarak yazılacaktır. Böylece metni kendi istekleriniz doğrultusunda dilediğiniz gibi kolayca düzenleyip özelleştirebilirsiniz!' 
                  : '💡 Not sure how to describe it? When you click on any of the popular gift recipes below, that template will automatically populate the text area above. You can then edit and customize the text to your exact wishes!'}
              </p>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {lang === 'tr'
                      ? 'Hızlı Konsept Örnekleri (Tıkla & Tarifini Özelleştir):'
                      : 'Quick Concept Examples (Click & Customize):'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {examplePrompts.map((example, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectExample(example.text)}
                    className="text-xs font-medium bg-stone-50 hover:bg-purple-100/80 text-slate-700 hover:text-purple-900 px-3 py-2 rounded-2xl border border-purple-200/80 hover:border-purple-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <span>{example.icon}</span>
                    <span className="truncate">{example.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Print / Drawing Upload Coming Soon Banner (Always visible) */}
          <div className="mt-4 pt-3 text-center border-t border-purple-100/60">
            <p className="text-[11px] text-purple-900 font-medium bg-purple-50/60 px-4 py-2 rounded-2xl border border-purple-200/70 inline-flex items-center justify-center gap-1.5 shadow-2xs">
              <span>
                {lang === 'tr'
                  ? '✨ Çok Yakında: Yapay zeka ile kendi özel çizimlerinizi ürettirip veya kendi görsellerinizi yükleyerek kupa, tişört ve hediyelerinizi istediğiniz tasarımlarla özelleştirebileceksiniz! 🎨'
                  : '✨ Coming Soon: Generate custom AI designs or upload your own images to customize mugs, t-shirts, and gifts with your favorite designs! 🎨'}
              </span>
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl xl:max-w-7xl mx-auto pt-4 text-left">
          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-purple-100/90 shadow-xs flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0">
              <Wand2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
                {lang === 'tr' ? 'Akıllı Eşleşme' : 'Smart Curation'}
              </h2>
              <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                {lang === 'tr' ? 'Kişiye özel öneriler' : 'Personalized choices'}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-purple-100/90 shadow-xs flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
                {lang === 'tr' ? 'Yerel Zanaatkâr' : 'Local Artisans'}
              </h2>
              <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                {lang === 'tr' ? 'Özel el yapımı koleksiyon' : 'Handcrafted items'}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-purple-100/90 shadow-xs flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shrink-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
                {lang === 'tr' ? 'Özel Dilek Kartı' : 'Wish Card'}
              </h2>
              <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                {lang === 'tr' ? 'Duygu yüklü özel mesajlar' : 'Personalized emotional cards'}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-purple-100/90 shadow-xs flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
                {lang === 'tr' ? 'Özenli Paketleme' : 'Hand-Packed'}
              </h2>
              <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                {lang === 'tr' ? 'Doğa dostu zarif ambalaj' : 'Eco-friendly elegant wrap'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

'use client';
import { useState, useRef } from 'react';
import {
  Menu, X, Home, Users, FileText, Mic, Plus, Settings as SettingsIcon,
  DollarSign, ArrowUpRight, ArrowDownRight, AlertCircle,
  Lock, MessageCircle, QrCode, Download, Send, CheckCircle, Upload, Building2, Save
} from 'lucide-react';
import QRCodeLib from 'qrcode';

export default function OEOFiance() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard'|'members'|'reports'|'minutes'|'settings'>('dashboard');
  const [settingsTab, setSettingsTab] = useState<'association'|'migration'>('association');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [assocName, setAssocName] = useState('OEO Progressive Association');
  const [motto, setMotto] = useState('Unity • Progress • Welfare');
  const [founded, setFounded] = useState('1985');
  const [chairman, setChairman] = useState('Chief Okeke');
  const [secretary, setSecretary] = useState('Eric Opute');
  const [duesAmount, setDuesAmount] = useState('5000');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // Voice Minutes
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [language, setLanguage] = useState('en');
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Reports State
  const [reportType, setReportType] = useState('income-expense');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-11-28');
  const [selectedMember, setSelectedMember] = useState('all');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const members = [
    { id: 1, name: "Chief Okeke", code: "OEO001", phone: "2348012345678", duesPaid: true, role: "Trustee" },
    { id: 2, name: "Madam Nneka", code: "OEO002", phone: "2348087654321", duesPaid: false, role: "Member" },
    { id: 3, name: "Eric Opute", code: "OEO003", phone: "2349033445566", duesPaid: true, role: "Secretary" },
    { id: 4, name: "Dr. Mrs. Aisha", code: "OEO004", phone: "2347011122333", duesPaid: false, role: "Trustee" },
  ];

  const balance = { total: 4587200, income: 5820000, expense: 1232800 };
  const duesCollected = members.filter(m => m.duesPaid).length * 5000;
  const duesOwing = members.filter(m => !m.duesPaid).length * 5000;

  const languages = [
    { code: 'en', name: 'English' }, { code: 'ig', name: 'Igbo' }, { code: 'yo', name: 'Yorùbá' },
    { code: 'ha', name: 'Hausa' }, { code: 'pcm', name: 'Pidgin' }, { code: 'ukw', name: 'Ukwani' },
  ];

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9; u.pitch = 1.3;
    u.lang = language === 'ig' ? 'ig-NG' : language === 'yo' ? 'yo-NG' : language === 'ha' ? 'ha-NG' : 'en-GB';
    window.speechSynthesis.speak(u);
  };

  // Recording
  const handleStartPress = () => {
    if (!selectedSpeaker) return alert("Please select your name first");
    longPressTimer.current = setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setAudioURL(URL.createObjectURL(blob));
          generateAISummary();
          stream.getTracks().forEach(t => t.stop());
        };
        mediaRecorderRef.current.start();
        setRecording(true);
        speak("Recording started");
      } catch (err) { alert("Microphone access denied"); }
    }, 800);
  };

  const handleStopPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const generateAISummary = () => {
    const isTrustee = members.find(m => m.name === selectedSpeaker)?.role === "Trustee";
    const summaries: any = {
      en: isTrustee ? `${selectedSpeaker} commended the hall project and urged unity.` : `${selectedSpeaker} thanked the association.`,
      ig: isTrustee ? `${selectedSpeaker} too ndị otu maka ịdị n'otu.` : `${selectedSpeaker} kelere otu.`,
      yo: `${selectedSpeaker} yin àwọn ẹgbẹ́.`,
      ha: `${selectedSpeaker} ya yaba wa da hadin kai.`,
      pcm: `${selectedSpeaker} thank everybody well-well.`,
      ukw: `${selectedSpeaker} too ndi otu maka idị n'otu.`
    };
    setSummary(summaries[language] || summaries.en);
  };

  const sendToChairman = () => {
    setSubmissions([...submissions, {
      id: Date.now(), speaker: selectedSpeaker, language: languages.find(l => l.code === language)?.name,
      summary, audioURL, status: 'pending', timestamp: new Date().toLocaleString()
    }]);
    speak("Sent to Chairman");
    setAudioURL(''); setSummary(''); setSelectedSpeaker('');
  };

  const approveMinute = (id: number) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'approved' } : s));
    speak("Approved");
  };

  const adoptMinute = (id: number) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'adopted' } : s));
    speak("Minutes adopted");
  };

  const generateQR = async (member: any) => {
    const data = `OEO MEMBER\nName: ${member.name}\nCode: ${member.code}\nPhone: ${member.phone}\nStatus: ${member.duesPaid ? 'PAID' : 'OWING'}`;
    const qr = await QRCodeLib.toDataURL(data, { width: 600, color: { dark: '#4C1D95', light: '#FAF5FF' } });
    window.open(qr);
    speak(`QR Code ready for ${member.name}`);
  };

  const openWhatsApp = (phone: string, name: string) => {
    const msg = `Dear ${name.split(' ')[0]},\nOEO reminds you:\nCode: ${members.find(m => m.phone === phone)?.code}\nDues: ${members.find(m => m.phone === phone)?.duesPaid ? 'PAID' : 'OWING ₦5,000'}\n— ${chairman}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const downloadPDF = () => {
    speak("Preparing report...");
    setTimeout(() => window.print(), 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@oeo.com' && password === 'oeo2025') {
      setIsLoggedIn(true);
      speak("Welcome back, Chairman. OEO Empire is eternal.");
    } else {
      alert("Wrong credentials");
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      speak("CSV uploaded successfully");
    } else {
      speak("Invalid file");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-3xl p-24 max-w-2xl w-full text-center">
          <div className="text-9xl font-black text-purple-800 mb-8">OEO</div>
          <h1 className="text-6xl font-bold text-purple-900 mb-20">Executive Portal</h1>
          <form onSubmit={handleLogin} className="space-y-12">
            <input type="email" placeholder="admin@oeo.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-8 text-3xl border-4 border-purple-300 rounded-3xl" required />
            <input type="password" placeholder="oeo2025" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-8 text-3xl border-4 border-purple-300 rounded-3xl" required />
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-10 rounded-3xl text-5xl font-bold hover:scale-105 transition shadow-2xl flex items-center justify-center gap-6">
              <Lock size={56} /> ENTER PORTAL
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-purple-900 to-purple-800 text-white transition-all`}>
        <div className="p-8 text-center relative">
          <h1 className="text-8xl font-black">OEO</h1>
          {sidebarOpen && <p className="text-lg mt-3">Progressive Association</p>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute top-8 right-8">
            {sidebarOpen ? <X size={36} /> : <Menu size={36} />}
          </button>
        </div>
        <nav className="mt-12 space-y-6 px-6">
          <NavItem icon={<Home size={32}/>} label="Dashboard" active={activeView==='dashboard'} onClick={()=>setActiveView('dashboard')} open={sidebarOpen}/>
          <NavItem icon={<Users size={32}/>} label="Members" active={activeView==='members'} onClick={()=>setActiveView('members')} open={sidebarOpen}/>
          <NavItem icon={<FileText size={32}/>} label="Reports" active={activeView==='reports'} onClick={()=>setActiveView('reports')} open={sidebarOpen}/>
          <NavItem icon={<Mic size={32}/>} label="Minutes" active={activeView==='minutes'} onClick={()=>setActiveView('minutes')} open={sidebarOpen}/>
          <NavItem icon={<SettingsIcon size={32}/>} label="Settings" active={activeView==='settings'} onClick={()=>setActiveView('settings')} open={sidebarOpen}/>
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-2xl px-16 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-7xl font-black text-purple-900">{assocName}</h1>
              <p className="text-4xl text-purple-600 italic mt-4">"{motto}"</p>
            </div>
            <div className="text-right">
              <p className="text-3xl text-gray-600">Treasury Balance</p>
              <p className="text-9xl font-black text-green-600">₦{balance.total.toLocaleString()}</p>
            </div>
          </div>
        </header>

        <main className="p-12">

          {/* DASHBOARD */}
          {activeView === 'dashboard' && (
            <div className="grid grid-cols-4 gap-12">
              <SummaryCard title="Income" amount={balance.income} icon={<ArrowUpRight className="text-green-600" size={80}/>} />
              <SummaryCard title="Expense" amount={balance.expense} icon={<ArrowDownRight className="text-red-600" size={80}/>} />
              <SummaryCard title="Dues Collected" amount={duesCollected} icon={<DollarSign className="text-emerald-600" size={80}/>} />
              <SummaryCard title="Dues Owing" amount={duesOwing} icon={<AlertCircle className="text-orange-600" size={80}/>} />
            </div>
          )}

          {/* MEMBERS */}
          {activeView === 'members' && (
            <div>
              <h2 className="text-8xl font-black text-purple-900 text-center mb-20">Membership Directory</h2>
              <div className="grid grid-cols-4 gap-16">
                {members.map(m => (
                  <div key={m.id} className="bg-white rounded-3xl shadow-3xl p-12 text-center hover:scale-105 transition border-8 border-purple-200">
                    <div className="w-48 h-48 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mx-auto mb-8 flex items-center justify-center">
                      <Users size={100} className="text-purple-800" />
                    </div>
                    <h3 className="text-5xl font-black text-purple-900">{m.name}</h3>
                    <p className="text-7xl font-bold text-gray-800 my-8">{m.code}</p>
                    <p className={`text-6xl font-black ${m.duesPaid ? 'text-green-600' : 'text-red-600'}`}>{m.duesPaid ? 'PAID' : 'OWING'}</p>
                    <div className="flex justify-center gap-8 mt-12">
                      <button onClick={() => generateQR(m)} className="bg-purple-600 text-white p-8 rounded-full hover:scale-125"><QrCode size={48} /></button>
                      <button onClick={() => openWhatsApp(m.phone, m.name.split(' ')[0])} className="bg-green-600 text-white p-8 rounded-full hover:scale-125"><MessageCircle size={48} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPORTS — NEW PROFESSIONAL VERSION */}
          {activeView === 'reports' && (
            <div>
              <h2 className="text-9xl font-black text-purple-900 text-center mb-16">Financial Reports</h2>
              <div className="bg-white rounded-3xl shadow-3xl p-16 mb-20">
                <div className="grid grid-cols-3 gap-12 items-end">
                  <div>
                    <label className="text-4xl font-bold text-purple-900 block mb-4">Report Type</label>
                    <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full p-8 text-4xl border-4 border-purple-300 rounded-3xl">
                      <option value="income-expense">Income vs Expenditure</option>
                      <option value="member-ledger">Individual Member Ledger</option>
                      <option value="summary">Summary Report</option>
                      <option value="outstanding">Outstanding Dues</option>
                      <option value="paid">Fully Paid Members</option>
                      <option value="all">All Members Status</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-4xl font-bold text-purple-900 block mb-4">Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-8 text-4xl border-4 border-purple-300 rounded-3xl" />
                  </div>
                  <div>
                    <label className="text-4xl font-bold text-purple-900 block mb-4">End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-8 text-4xl border-4 border-purple-300 rounded-3xl" />
                  </div>
                </div>
                {reportType === 'member-ledger' && (
                  <div className="mt-12">
                    <label className="text-4xl font-bold text-purple-900 block mb-4">Select Member</label>
                    <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} className="w-full p-8 text-4xl border-4 border-purple-300 rounded-3xl">
                      <option value="all">All Members</option>
                      {members.map(m => <option key={m.id} value={m.id.toString()}>{m.name}</option>)}
                    </select>
                  </div>
                )}
                <button onClick={downloadPDF} className="mt-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-40 py-16 rounded-full text-6xl font-bold hover:scale-110 flex items-center gap-8 mx-auto shadow-2xl">
                  <Download size={80} /> Download as PDF
                </button>
              </div>

              <div className="bg-white rounded-3xl shadow-3xl p-20">
                <h3 className="text-7xl font-black text-purple-900 text-center mb-12">
                  {reportType === 'income-expense' && 'Income vs Expenditure Report'}
                  {reportType === 'member-ledger' && 'Individual Member Ledger'}
                  {reportType === 'summary' && 'Financial Summary'}
                  {reportType === 'outstanding' && 'Outstanding Dues Report'}
                  {reportType === 'paid' && 'Fully Paid Members Report'}
                  {reportType === 'all' && 'Complete Dues Status Report'}
                </h3>
                <p className="text-center text-5xl text-gray-700 mb-16">
                  Period: {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()}
                </p>
                <table className="w-full text-4xl border-collapse">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="p-8 text-left">Name</th>
                      <th className="p-8">Code</th>
                      <th className="p-8">Status</th>
                      <th className="p-8 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id} className="border-b-4 border-purple-200">
                        <td className="p-8">{m.name}</td>
                        <td className="p-8 text-center">{m.code}</td>
                        <td className={`p-8 text-center font-black ${m.duesPaid ? 'text-green-600' : 'text-red-600'}`}>
                          {m.duesPaid ? 'PAID' : 'OWING'}
                        </td>
                        <td className="p-8 text-right">₦{m.duesPaid ? '5,000' : '0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-20 grid grid-cols-2 gap-20 text-6xl font-black text-center">
                  <div className="text-green-600">Total Collected: ₦{duesCollected.toLocaleString()}</div>
                  <div className="text-red-600">Total Owing: ₦{duesOwing.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* MINUTES — YOUR FLAWLESS VOICE MINUTES */}
          {activeView === 'minutes' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-9xl font-black text-purple-900 text-center mb-20">Voice Minutes</h2>
              <div className="flex justify-center gap-8 mb-20 flex-wrap">
                {languages.map(l => (
                  <button key={l.code} onClick={() => { setLanguage(l.code); speak(`Switched to ${l.name}`); }}
                    className={`px-16 py-8 rounded-2xl text-4xl font-bold ${language === l.code ? 'bg-purple-700 text-white scale-110' : 'bg-white text-purple-900 shadow-2xl'}`}>
                    {l.name}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-3xl shadow-3xl p-20 text-center">
                <select value={selectedSpeaker} onChange={e => setSelectedSpeaker(e.target.value)} className="w-96 p-8 text-5xl border-4 border-purple-300 rounded-3xl mb-20">
                  <option value="">-- Select Your Name --</option>
                  {members.map(m => <option key={m.id} value={m.name}>{m.name} ({m.role})</option>)}
                </select>
                <button onMouseDown={handleStartPress} onMouseUp={handleStopPress} onMouseLeave={handleStopPress}
                  onTouchStart={handleStartPress} onTouchEnd={handleStopPress}
                  className={`w-80 h-80 rounded-full mx-auto flex items-center justify-center shadow-3xl transition-all relative overflow-hidden ${recording ? 'bg-red-600 animate-pulse scale-110' : 'bg-gradient-to-r from-red-500 to-pink-600 hover:scale-110'}`}>
                  <Mic size={180} className="text-white" />
                  {recording && <div className="absolute inset-0 bg-red-600 opacity-50 animate-ping"></div>}
                </button>
                <p className="text-6xl mt-16 font-bold text-purple-900">{recording ? 'Recording... Release to Stop' : 'Hold 1 Second to Record'}</p>
                {summary && (
                  <div className="mt-20">
                    <div className="bg-purple-50 rounded-3xl p-16 text-left">
                      <h4 className="text-5xl font-black text-purple-900 mb-8">AI Summary ({language.toUpperCase()})</h4>
                      <p className="text-4xl leading-relaxed text-gray-800">{summary}</p>
                    </div>
                    <button onClick={sendToChairman} className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-40 py-16 rounded-full text-6xl font-bold hover:scale-110 flex items-center gap-8 mx-auto">
                      <Send size={80} /> SEND TO CHAIRMAN
                    </button>
                  </div>
                )}
              </div>
              {submissions.length > 0 && (
                <div className="mt-32">
                  <h3 className="text-7xl font-black text-purple-900 text-center mb-16">Chairman Approval Panel</h3>
                  {submissions.map(s => (
                    <div key={s.id} className="bg-white rounded-3xl shadow-3xl p-16 mb-12">
                      <p className="text-5xl font-bold">{s.speaker} • {s.language}</p>
                      <p className="text-4xl mt-8">{s.summary}</p>
                      <audio controls src={s.audioURL} className="w-full mt-8"></audio>
                      <div className="flex gap-8 mt-12">
                        <button onClick={() => approveMinute(s.id)} disabled={s.status !== 'pending'} className="flex-1 bg-green-600 text-white py-12 rounded-2xl text-4xl disabled:opacity-50">APPROVE</button>
                        {s.status === 'approved' && <button onClick={() => adoptMinute(s.id)} className="flex-1 bg-purple-700 text-white py-12 rounded-2xl text-4xl">ADOPT</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {activeView === 'settings' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-9xl font-black text-purple-900 text-center mb-20">Settings</h2>
              <div className="flex justify-center gap-12 mb-20">
                <button onClick={() => setSettingsTab('association')} className={`px-20 py-10 rounded-3xl text-5xl font-bold transition ${settingsTab === 'association' ? 'bg-purple-700 text-white scale-110' : 'bg-white text-purple-900 shadow-2xl'}`}>
                  <Building2 size={60} className="inline mr-6" /> Association Setup
                </button>
                <button onClick={() => setSettingsTab('migration')} className={`px-20 py-10 rounded-3xl text-5xl font-bold transition ${settingsTab === 'migration' ? 'bg-purple-700 text-white scale-110' : 'bg-white text-purple-900 shadow-2xl'}`}>
                  <Upload size={60} className="inline mr-6" /> Data Migration
                </button>
              </div>
              {settingsTab === 'association' && (
                <div className="bg-white rounded-3xl shadow-3xl p-20">
                  <h3 className="text-7xl font-black text-purple-900 text-center mb-16">Association Details</h3>
                  <div className="grid grid-cols-2 gap-16 text-4xl">
                    <div><label className="block font-bold text-purple-900 mb-6">Name</label><input value={assocName} onChange={e => setAssocName(e.target.value)} className="w-full p-8 border-4 border-purple-300 rounded-3xl" /></div>
                    <div><label className="block font-bold text-purple-900 mb-6">Motto</label><input value={motto} onChange={e => setMotto(e.target.value)} className="w-full p-8 border-4 border-purple-300 rounded-3xl" /></div>
                    <div><label className="block font-bold text-purple-900 mb-6">Founded</label><input value={founded} onChange={e => setFounded(e.target.value)} className="w-full p-8 border-4 border-purple-300 rounded-3xl" /></div>
                    <div><label className="block font-bold text-purple-900 mb-6">Dues (₦)</label><input value={duesAmount} onChange={e => setDuesAmount(e.target.value)} className="w-full p-8 border-4 border-purple-300 rounded-3xl" /></div>
                    <div><label className="block font-bold text-purple-900 mb-6">Chairman</label><input value={chairman} onChange={e => setChairman(e.target.value)} className="w-full p-8 border-4 border-purple-300 rounded-3xl" /></div>
                    <div><label className="block font-bold text-purple-900 mb-6">Secretary</label><input value={secretary} onChange={e => setSecretary(e.target.value)} className="w-full p-8 border-4 border-purple-300 rounded-3xl" /></div>
                  </div>
                  <button onClick={() => speak("Settings saved")} className="mt-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-40 py-16 rounded-full text-6xl font-bold hover:scale-110 flex items-center gap-8 mx-auto">
                    <Save size={80} /> SAVE SETTINGS
                  </button>
                </div>
              )}
              {settingsTab === 'migration' && (
                <div className="bg-white rounded-3xl shadow-3xl p-32 text-center">
                  <h3 className="text-7xl font-black text-purple-900 mb-16">Upload Existing Records</h3>
                  <div className="border-8 border-dashed border-purple-300 rounded-3xl p-32">
                    <Upload size={120} className="text-purple-600 mx-auto mb-12" />
                    <p className="text-5xl text-purple-900 mb-12">Drop CSV here or click</p>
                    <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" id="csv-upload" />
                    <label htmlFor="csv-upload" className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-40 py-16 rounded-full text-6xl font-bold hover:scale-110 inline-flex items-center gap-8">
                      <Upload size={80} /> CHOOSE CSV FILE
                    </label>
                    {csvFile && <p className="text-5xl text-green-600 mt-12 font-black">Uploaded: {csvFile.name}</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        <button className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full w-28 h-28 shadow-3xl hover:scale-110 z-50 flex items-center justify-center">
          <Plus size={64} />
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, open }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-8 p-6 rounded-2xl transition ${active ? 'bg-purple-700 shadow-2xl scale-105' : 'hover:bg-purple-700'} ${!open && 'justify-center'}`}>
      {icon}
      {open && <span className="text-2xl font-semibold">{label}</span>}
    </button>
  );
}

function SummaryCard({ title, amount, icon }: any) {
  return (
    <div className="bg-white rounded-3xl shadow-3xl p-12 text-center hover:scale-105 transition">
      {icon}
      <p className="text-4xl text-gray-600 mt-8">{title}</p>
      <p className="text-7xl font-black mt-6 text-gray-800">₦{amount.toLocaleString()}</p>
    </div>
  );
}
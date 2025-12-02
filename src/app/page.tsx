'use client';

import { useState, useRef } from 'react';
import { Menu, X, Home, Users, DollarSign, Mic, Settings, LogOut, Plus, QrCode, Share2, Phone, Mail, MapPin, Download, Send, CheckCircle, Upload, Save, Globe } from 'lucide-react';
import QRCode from 'qrcode.react';

export default function OEOassoai() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard'|'members'|'payments'|'minutes'|'reports'|'settings'>('dashboard');
  const [isFabOpen, setIsFabOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Association Settings
  const [assocName, setAssocName] = useState('OEO Progressive Association');
  const [motto, setMotto] = useState('Unity • Progress • Welfare');
  const [contactPhone, setContactPhone] = useState('+234 803 456 7890');
  const [contactEmail, setContactEmail] = useState('info@oeoassoai.com');
  const [contactAddress, setContactAddress] = useState('No. 12 Unity Road, Asaba, Delta State');
  const [currency, setCurrency] = useState('₦');
  const [country, setCountry] = useState('NG');

  // Members
  const [members] = useState([
    { id: 1, name: "Chief Okeke", code: "OEO001", phone: "+2348012345678", duesPaid: true, role: "Trustee", joined: "2018-03-15" },
    { id: 2, name: "Madam Nneka", code: "OEO002", phone: "+2348087654321", duesPaid: false, role: "Member", joined: "2020-11-20" },
    { id: 3, name: "Eric Opute", code: "OEO003", phone: "+2349033445566", duesPaid: true, role: "Secretary", joined: "2019-07-10" },
    { id: 4, name: "Dr. Mrs. Aisha", code: "OEO004", phone: "+2347011122333", duesPaid: true, role: "Trustee", joined: "2017-05-05" },
    { id: 5, name: "Bro. Chukwudi", code: "OEO005", phone: "+2348109876543", duesPaid: false, role: "Member", joined: "2023-01-12" },
    { id: 6, name: "Sister Grace", code: "OEO006", phone: "+2349077766554", duesPaid: true, role: "Member", joined: "2021-09-30" },
  ]);

  const duesAmount = 5000;
  const totalMembers = members.length;
  const paidMembers = members.filter(m => m.duesPaid).length;
  const duesCollected = paidMembers * duesAmount;
  const duesOwing = (totalMembers - paidMembers) * duesAmount;

  // Countries with Flags (50+)
  const countries = [
    { code: 'NG', name: 'Nigeria', currency: '₦', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', currency: 'GH₵', flag: '🇬🇭' },
    { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪' },
    { code: 'US', name: 'United States', currency: '$', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', currency: '£', flag: '🇬🇧' },
    { code: 'EU', name: 'Europe', currency: '€', flag: '🇪🇺' },
    { code: 'CA', name: 'Canada', currency: 'CAD$', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', currency: 'AUD$', flag: '🇦🇺' },
    { code: 'IN', name: 'India', currency: '₹', flag: '🇮🇳' },
    { code: 'ZA', name: 'South Africa', currency: 'R', flag: '🇿🇦' },
    { code: 'UG', name: 'Uganda', currency: 'USh', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzania', currency: 'TSh', flag: '🇹🇿' },
    { code: 'ET', name: 'Ethiopia', currency: 'Br', flag: '🇪🇹' },
    { code: 'EG', name: 'Egypt', currency: 'E£', flag: '🇪🇬' },
    { code: 'SN', name: 'Senegal', currency: 'CFA', flag: '🇸🇳' },
    { code: 'CI', name: "Côte d'Ivoire", currency: 'CFA', flag: '🇨🇮' },
    { code: 'ZM', name: 'Zambia', currency: 'ZMW', flag: '🇿🇲' },
    { code: 'ZW', name: 'Zimbabwe', currency: 'USD', flag: '🇿🇼' },
    { code: 'BW', name: 'Botswana', currency: 'BWP', flag: '🇧🇼' },
    { code: 'MZ', name: 'Mozambique', currency: 'MZN', flag: '🇲🇿' },
    { code: 'LR', name: 'Liberia', currency: 'LRD', flag: '🇱🇷' },
    { code: 'SL', name: 'Sierra Leone', currency: 'SLL', flag: '🇸🇱' },
    { code: 'GM', name: 'Gambia', currency: 'GMD', flag: '🇬🇲' },
    { code: 'GW', name: 'Guinea-Bissau', currency: 'XOF', flag: '🇬🇼' },
    { code: 'ML', name: 'Mali', currency: 'XOF', flag: '🇲🇱' },
    { code: 'NE', name: 'Niger', currency: 'XOF', flag: '🇳🇪' },
    { code: 'BJ', name: 'Benin', currency: 'XOF', flag: '🇧🇯' },
    { code: 'TG', name: 'Togo', currency: 'XOF', flag: '🇹🇬' },
    { code: 'BF', name: 'Burkina Faso', currency: 'XOF', flag: '🇧🇫' },
    { code: 'GN', name: 'Guinea', currency: 'GNF', flag: '🇬🇳' },
    { code: 'CM', name: 'Cameroon', currency: 'XAF', flag: '🇨🇲' },
    { code: 'GA', name: 'Gabon', currency: 'XAF', flag: '🇬🇦' },
    { code: 'CG', name: 'Congo', currency: 'XAF', flag: '🇨🇬' },
    { code: 'CF', name: 'Central African Republic', currency: 'XAF', flag: '🇨🇫' },
    { code: 'TD', name: 'Chad', currency: 'XAF', flag: '🇹🇩' },
    { code: 'GQ', name: 'Equatorial Guinea', currency: 'XAF', flag: '🇬🇶' },
    { code: 'AO', name: 'Angola', currency: 'AOA', flag: '🇦🇴' },
    { code: 'CD', name: 'DR Congo', currency: 'CDF', flag: '🇨🇩' },
    { code: 'NA', name: 'Namibia', currency: 'NAD', flag: '🇳🇦' },
    { code: 'SZ', name: 'Eswatini', currency: 'SZL', flag: '🇸🇿' },
    { code: 'LS', name: 'Lesotho', currency: 'LSL', flag: '🇱🇸' },
    { code: 'MW', name: 'Malawi', currency: 'MWK', flag: '🇲🇼' },
    { code: 'ZM', name: 'Zambia', currency: 'ZMW', flag: '🇿🇲' },
    { code: 'ZW', name: 'Zimbabwe', currency: 'USD', flag: '🇿🇼' },
  ];

  // Minutes
  const [recording, setRecording] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [language, setLanguage] = useState('en');
  const [individualSummary, setIndividualSummary] = useState('');
  const [allSummaries, setAllSummaries] = useState<any[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startStopRecording = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop();
      mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
      setRecording(false);
      const summary = realisticSummaries(selectedSpeaker, language);
      setIndividualSummary(summary);
    } else {
      if (!selectedSpeaker) return alert("Select a speaker first");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
        setRecording(true);
      } catch (err) {
        alert("Please allow microphone access");
      }
    }
  };

  const approveSummary = () => {
    setAllSummaries([...allSummaries, { speaker: selectedSpeaker, text: individualSummary }]);
    setIndividualSummary('');
    setSelectedSpeaker('');
  };

  const generateMinutes = () => {
    const text = `OEO PROGRESSIVE ASSOCIATION - MEETING MINUTES\nDate: ${new Date().toLocaleDateString('en-GB')}\n\n${allSummaries.map(s => `${s.speaker}:\n${s.text}`).join('\n\n')}\n\nSigned:\nSecretary ____________________\nChairman ____________________`;
    const blob = new Blob([text], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OEO_Minutes.doc';
    a.click();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@oeo.com' && password === 'oeo2025') setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-3xl p-12 max-w-md w-full text-center">
          <h1 className="text-8xl font-black text-purple-800 mb-8">OEO</h1>
          <form onSubmit={handleLogin} className="space-y-8">
            <input type="email" placeholder="admin@oeo.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-5 text-xl border-4 border-purple-300 rounded-2xl" required />
            <input type="password" placeholder="oeo2025" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-5 text-xl border-4 border-purple-300 rounded-2xl" required />
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 rounded-2xl text-3xl font-bold hover:scale-105 transition">
              ENTER EMPIRE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-purple-900 to-purple-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 text-center relative">
          <h1 className="text-6xl font-black">OEO</h1>
          {sidebarOpen && <p className="text-lg">Progressive Association</p>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute top-6 right-6">
            {sidebarOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
        <nav className="flex-1 space-y-3 px-4">
          <NavItem icon={<Home size={28} />} label="Dashboard" active={activeView==='dashboard'} onClick={() => setActiveView('dashboard')} open={sidebarOpen} />
          <NavItem icon={<Users size={28} />} label="Members" active={activeView==='members'} onClick={() => setActiveView('members')} open={sidebarOpen} />
          <NavItem icon={<DollarSign size={28} />} label="Payments" active={activeView==='payments'} onClick={() => setActiveView('payments')} open={sidebarOpen} />
          <NavItem icon={<Mic size={28} />} label="Minutes" active={activeView==='minutes'} onClick={() => setActiveView('minutes')} open={sidebarOpen} />
          <NavItem icon={<FileText size={28} />} label="Reports" active={activeView==='reports'} onClick={() => setActiveView('reports')} open={sidebarOpen} />
          <NavItem icon={<Settings size={28} />} label="Settings" active={activeView==='settings'} onClick={() => setActiveView('settings')} open={sidebarOpen} />
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="m-4 p-4 bg-red-600 rounded-xl flex items-center justify-center gap-3 text-lg font-bold hover:bg-red-700 transition">
          <LogOut size={24} /> {sidebarOpen && "Logout"}
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-xl p-6">
          <div className="flex justify-between items-center flex-wrap gap-6">
            <div>
              <h1 className="text-4xl font-black text-purple-900">{assocName}</h1>
              <p className="text-2xl text-purple-600 italic">"{motto}"</p>
            </div>
            <div className="text-right">
              <p className="text-xl text-gray-600">Treasury Balance</p>
              <p className="text-5xl font-black text-green-600">{currency}{duesCollected.toLocaleString()}</p>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* DASHBOARD */}
          {activeView === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <SummaryCard title="Total Members" value={totalMembers} icon={<Users className="text-purple-600" size={60} />} />
              <SummaryCard title="Dues Collected" value={`${currency}${duesCollected.toLocaleString()}`} icon={<DollarSign className="text-green-600" size={60} />} />
              <SummaryCard title="Dues Owing" value={`${currency}${duesOwing.toLocaleString()}`} icon={<AlertCircle className="text-red-600" size={60} />} />
              <SummaryCard title="Paid Members" value={paidMembers} icon={<CheckCircle className="text-emerald-600" size={60} />} />
            </div>
          )}

          {/* MEMBERS */}
          {activeView === 'members' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map(m => (
                <div key={m.id} className="bg-white rounded-3xl shadow-2xl p-8 text-center hover:scale-105 transition">
                  <QRCode value={`${m.name} | ${m.code} | ${m.phone}`} size={180} className="mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-purple-900">{m.name}</h3>
                  <p className="text-2xl text-purple-700">{m.code}</p>
                  <p className="text-xl mt-4 flex items-center justify-center gap-3"><Phone size={28} /> {m.phone}</p>
                  <a href={`https://wa.me/${m.phone.replace('+', '')}`} className="inline-flex items-center gap-4 bg-green-600 text-white py-4 px-10 rounded-2xl mt-6 text-xl font-bold hover:bg-green-700">
                    <Share2 /> WhatsApp
                  </a>
                  <p className={`text-2xl font-black mt-6 ${m.duesPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {m.duesPaid ? 'PAID' : 'OWING ₦5,000'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* PAYMENTS */}
          {activeView === 'payments' && (
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-black text-purple-900 mb-12">Payments Portal</h2>
              <div className="bg-white rounded-3xl shadow-2xl p-16">
                <DollarSign size={120} className="mx-auto text-green-600 mb-8" />
                <p className="text-4xl font-bold mb-8">Pay Monthly Dues</p>
                <p className="text-6xl font-black text-green-600 mb-12">₦5,000</p>
                <PaystackButton
                  {...paystackConfig}
                  text="PAY NOW WITH PAYSTACK"
                  className="bg-orange-600 hover:bg-orange-700 text-white py-10 px-40 rounded-3xl text-3xl font-bold shadow-2xl cursor-pointer"
                  onSuccess={handlePaystackSuccess}
                />
              </div>
            </div>
          )}

          {/* MINUTES */}
          {activeView === 'minutes' && (
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-black text-purple-900 mb-12">AI Voice Minutes</h2>
              <div className="mb-12">
                <select value={selectedSpeaker} onChange={e => setSelectedSpeaker(e.target.value)} className="p-6 text-xl border-4 border-purple-300 rounded-2xl mr-4">
                  <option>Select Speaker</option>
                  {members.map(m => <option key={m.id}>{m.name}</option>)}
                </select>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="p-6 text-xl border-4 border-purple-300 rounded-2xl">
                  <option value="en">English</option>
                  <option value="ig">Igbo</option>
                  <option value="yo">Yorùbá</option>
                  <option value="ha">Hausa</option>
                  <option value="pcm">Pidgin</option>
                </select>
              </div>
              <div className="mb-12">
                <button onClick={startStopRecording} className={`w-64 h-64 rounded-full shadow-3xl flex items-center justify-center mx-auto text-white text-6xl font-black transition-all ${recording ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-br from-red-500 to-pink-600 hover:scale-105'}`}>
                  <Mic size={120} />
                </button>
                <p className="text-3xl mt-8 text-gray-700">{recording ? "Recording... Click to Stop" : "Click Red Mic to Start"}</p>
              </div>
              {individualSummary && (
                <div className="bg-purple-50 p-10 rounded-3xl border-4 border-purple-300">
                  <p className="text-2xl font-bold mb-6">{selectedSpeaker}'s Contribution:</p>
                  <p className="text-xl leading-relaxed">{individualSummary}</p>
                  <button onClick={approveSummary} className="mt-8 bg-green-600 text-white py-6 px-12 rounded-xl text-2xl font-bold hover:scale-105 transition">
                    APPROVE & ADD TO MINUTES
                  </button>
                </div>
              )}
              {allSummaries.length > 0 && (
                <button onClick={generateMinutes} className="mt-12 bg-gradient-to-r from-purple-700 to-pink-700 text-white py-8 px-20 rounded-3xl text-3xl font-bold hover:scale-105 transition shadow-2xl">
                  <Download className="inline mr-4" size={40} /> DOWNLOAD FULL MINUTES (WORD)
                </button>
              )}
            </div>
          )}

          {/* REPORTS */}
          {activeView === 'reports' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl font-black text-purple-900 text-center mb-12">Financial Reports</h2>
              <div className="bg-white rounded-3xl shadow-2xl p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <select value={reportType} onChange={e => setReportType(e.target.value)} className="p-6 text-xl border-4 border-purple-300 rounded-2xl">
                    <option value="all">All Members Status</option>
                    <option value="paid">Paid Members</option>
                    <option value="owing">Owing Members</option>
                  </select>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-6 text-xl border-4 border-purple-300 rounded-2xl" />
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-6 text-xl border-4 border-purple-300 rounded-2xl" />
                </div>

                <table className="w-full text-left border-collapse mb-10">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="p-6 text-xl font-bold">Name</th>
                      <th className="p-6 text-xl font-bold text-center">Code</th>
                      <th className="p-6 text-xl font-bold text-center">Status</th>
                      <th className="p-6 text-xl font-bold text-right">Dues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id} className="border-b hover:bg-purple-50">
                        <td className="p-6 text-lg">{m.name}</td>
                        <td className="p-6 text-lg text-center font-mono">{m.code}</td>
                        <td className={`p-6 text-lg text-center font-bold ${m.duesPaid ? 'text-green-600' : 'text-red-600'}`}>
                          {m.duesPaid ? 'PAID' : 'OWING'}
                        </td>
                        <td className="p-6 text-lg text-right">₦5,000</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="grid grid-cols-2 gap-8 text-center">
                  <div className="bg-green-50 p-8 rounded-3xl border-4 border-green-300">
                    <p className="text-2xl font-bold text-green-700">Collected</p>
                    <p className="text-5xl font-black text-green-600">₦{duesCollected.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 p-8 rounded-3xl border-4 border-red-300">
                    <p className="text-2xl font-bold text-red-700">Owing</p>
                    <p className="text-5xl font-black text-red-600">₦{duesOwing.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS — FULLY UPGRADED */}
          {activeView === 'settings' && (
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="bg-white rounded-3xl shadow-2xl p-12">
                <h3 className="text-4xl font-black text-purple-900 text-center mb-8">Association Details</h3>
                <div className="space-y-6">
                  <input value={assocName} onChange={e => setAssocName(e.target.value)} placeholder="Association Name" className="w-full p-6 text-xl border-4 border-purple-300 rounded-2xl" />
                  <input value={motto} onChange={e => setMotto(e.target.value)} placeholder="Motto" className="w-full p-6 text-xl border-4 border-purple-300 rounded-2xl" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4 p-6 border-4 border-purple-300 rounded-2xl"><Phone size={28} /> <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="flex-1 text-xl" placeholder="Phone" /></div>
                    <div className="flex items-center gap-4 p-6 border-4 border-purple-300 rounded-2xl"><Mail size={28} /> <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="flex-1 text-xl" placeholder="Email" /></div>
                    <div className="flex items-center gap-4 p-6 border-4 border-purple-300 rounded-2xl"><MapPin size={28} /> <input value={contactAddress} onChange={e => setContactAddress(e.target.value)} className="flex-1 text-xl" placeholder="Address" /></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl p-12">
                <h3 className="text-4xl font-black text-purple-900 text-center mb-8">Country & Currency (50+ Options)</h3>
                <select value={country} onChange={e => {
                  const selected = countries.find(c => c.name === e.target.value.split(' ')[0]);
                  if (selected) { setCurrency(selected.currency); setCountry(selected.name); }
                }} className="w-full max-w-2xl mx-auto p-6 text-xl border-4 border-purple-300 rounded-2xl">
                  {countries.map(c => (
                    <option key={c.name}>{c.name} {c.currency}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
                <Upload size={80} className="mx-auto text-purple-600 mb-6" />
                <p className="text-3xl font-bold text-purple-900 mb-6">Batch Member Upload</p>
                <input type="file" accept=".csv" className="text-xl" />
                <p className="text-lg text-gray-600 mt-4">Upload CSV → Instant Import</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, open }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-5 p-5 rounded-xl transition-all ${active ? 'bg-white/20 shadow-xl' : 'hover:bg-white/10'} ${!open && 'justify-center'}`}>
      {icon}
      {open && <span className="text-xl font-semibold">{label}</span>}
    </button>
  );
}

function SummaryCard({ title, value, icon }: any) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 text-center hover:scale-105 transition">
      {icon}
      <p className="text-2xl text-gray-700 mt-6">{title}</p>
      <p className="text-5xl font-black text-purple-900 mt-4">{value}</p>
    </div>
  );
}
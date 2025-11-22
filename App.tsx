import React, { useState, useRef, useEffect } from 'react';
import { WIFI_PLANS, INITIAL_FORM_DATA } from './constants';
import { FormData, FormStep, AIRecommendation } from './types';
import { PlanCard } from './components/PlanCard';
import { AIRecommender } from './components/AIRecommender';
import { CheckCircle2, ChevronRight, ChevronLeft, Wifi, User, CreditCard, UploadCloud, Download, Home } from 'lucide-react';
import { generateRegistrationPDF } from './utils/pdfGenerator';

const App: React.FC = () => {
  const [step, setStep] = useState<FormStep>(FormStep.PLAN_SELECTION);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [aiRec, setAiRec] = useState<AIRecommendation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState<string>("");
  const formTopRef = useRef<HTMLDivElement>(null);

  // Scroll to top on step change
  useEffect(() => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);

  const handlePlanSelect = (id: string) => {
    setFormData(prev => ({ ...prev, selectedPlanId: id }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       setFormData(prev => ({ ...prev, housePhotoFile: e.target.files![0] }));
    }
  };

  const handleAIRecommendation = (rec: AIRecommendation) => {
    setAiRec(rec);
    setFormData(prev => ({ ...prev, selectedPlanId: rec.recommendedPlanId }));
    // Optional: Scroll to plans
    const plansElement = document.getElementById('plans-grid');
    if (plansElement) plansElement.scrollIntoView({ behavior: 'smooth' });
  };

  const nextStep = () => {
    if (step === FormStep.PLAN_SELECTION && !formData.selectedPlanId) {
      alert("Silakan pilih paket terlebih dahulu.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate ID
    setRegistrationId(`REG-${Math.floor(Math.random() * 1000000)}`);
    
    setIsSubmitting(false);
    setStep(FormStep.SUCCESS);
  };

  const selectedPlan = WIFI_PLANS.find(p => p.id === formData.selectedPlanId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 p-1.5 rounded-lg text-white">
                <Wifi size={24} strokeWidth={3} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Damar Global <span className="text-brand-600">Network</span></span>
            </div>
            <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-brand-600 transition-colors">Paket Internet</a>
              <a href="#" className="hover:text-brand-600 transition-colors">Cek Area</a>
              <a href="#" className="hover:text-brand-600 transition-colors">Bantuan</a>
            </div>
          </div>
        </div>
      </nav>

      <div ref={formTopRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Progress Bar */}
        {step !== FormStep.SUCCESS && (
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full -z-10"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 rounded-full -z-10 transition-all duration-500"
                   style={{ width: `${(step / 2) * 100}%` }}></div>
              
              <div className={`flex flex-col items-center gap-2 bg-slate-50 px-2 ${step >= 0 ? 'text-brand-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${step >= 0 ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-300'}`}>1</div>
                <span className="text-xs font-semibold">Pilih Paket</span>
              </div>
              <div className={`flex flex-col items-center gap-2 bg-slate-50 px-2 ${step >= 1 ? 'text-brand-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${step >= 1 ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-300'}`}>2</div>
                <span className="text-xs font-semibold">Data Diri</span>
              </div>
              <div className={`flex flex-col items-center gap-2 bg-slate-50 px-2 ${step >= 2 ? 'text-brand-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${step >= 2 ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-300'}`}>3</div>
                <span className="text-xs font-semibold">Konfirmasi</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Plan Selection */}
        {step === FormStep.PLAN_SELECTION && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Pilih Paket Internet Impianmu</h1>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">Internet ultra-cepat, stabil, dan tanpa batasan kuota untuk mendukung aktivitas digitalmu.</p>
            </div>

            <AIRecommender onRecommendation={handleAIRecommendation} />

            {aiRec && (
               <div className="bg-brand-50 border border-brand-200 p-4 rounded-xl mb-8 flex items-start gap-3 animate-pulse-once">
                  <div className="bg-brand-100 p-2 rounded-full text-brand-600 mt-1">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-800">Rekomendasi AI untuk Anda</h4>
                    <p className="text-brand-700 text-sm mt-1">{aiRec.reasoning}</p>
                  </div>
               </div>
            )}

            <div id="plans-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {WIFI_PLANS.map(plan => (
                <PlanCard 
                  key={plan.id}
                  plan={plan}
                  isSelected={formData.selectedPlanId === plan.id}
                  onSelect={handlePlanSelect}
                  isRecommended={aiRec?.recommendedPlanId === plan.id}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={nextStep}
                disabled={!formData.selectedPlanId}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Lanjut ke Data Diri <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Personal Details */}
        {step === FormStep.PERSONAL_DETAILS && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                   <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
                      <User size={24} />
                   </div>
                   <div>
                      <h2 className="text-xl font-bold text-slate-900">Lengkapi Identitas Diri</h2>
                      <p className="text-slate-500 text-sm">Data Anda aman dan terenkripsi.</p>
                   </div>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                        placeholder="Sesuai KTP"
                      />
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Nomor KTP (NIK)</label>
                      <input 
                        type="number" 
                        name="nik"
                        value={formData.nik}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                        placeholder="16 digit angka"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                        placeholder="contoh@email.com"
                      />
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Nomor WhatsApp</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                        placeholder="0812xxxx"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Alamat Pemasangan</label>
                      <textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all resize-none"
                        placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan"
                      />
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Jadwal Pemasangan yang Diinginkan</label>
                      <input 
                        type="date"
                        name="installationDate"
                        value={formData.installationDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                      />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Foto Depan Rumah</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="bg-brand-50 p-3 rounded-full text-brand-600 mb-3">
                          <Home size={24} />
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          {formData.housePhotoFile ? formData.housePhotoFile.name : 'Klik untuk upload foto rumah'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Untuk survei lokasi (JPG/PNG max 5MB)</p>
                    </div>
                  </div>

                </form>

                <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                   <button 
                    onClick={prevStep}
                    className="text-slate-500 font-semibold px-4 py-2 hover:text-slate-800 transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft size={18} /> Kembali
                  </button>
                  <button 
                    onClick={nextStep}
                    // Basic validation
                    disabled={!formData.fullName || !formData.nik || !formData.email || !formData.phone || !formData.address || !formData.housePhotoFile}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Lanjut Konfirmasi <ChevronRight size={20} />
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* STEP 3: Confirmation */}
        {step === FormStep.CONFIRMATION && selectedPlan && (
           <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-brand-600 px-6 py-6 text-white">
                  <h2 className="text-xl font-bold">Konfirmasi Pesanan</h2>
                  <p className="text-brand-100 text-sm">Mohon periksa kembali data Anda sebelum mendaftar.</p>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  
                  {/* Selected Plan Summary */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex items-center justify-between">
                     <div>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Paket Pilihan</p>
                       <h3 className="text-lg font-bold text-slate-900">{selectedPlan.name}</h3>
                     </div>
                     <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">Rp {selectedPlan.price.toLocaleString('id-ID')}</p>
                        <p className="text-xs text-slate-500">/bulan</p>
                     </div>
                  </div>

                  {/* Customer Data Summary */}
                  <div className="space-y-4">
                     <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                       <User size={18} className="text-brand-500"/> Informasi Pelanggan
                     </h3>
                     <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div>
                          <p className="text-slate-500">Nama Lengkap</p>
                          <p className="font-medium text-slate-800">{formData.fullName}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">NIK</p>
                          <p className="font-medium text-slate-800">{formData.nik}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Email</p>
                          <p className="font-medium text-slate-800">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">No. WhatsApp</p>
                          <p className="font-medium text-slate-800">{formData.phone}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-slate-500">Alamat Pemasangan</p>
                          <p className="font-medium text-slate-800">{formData.address}</p>
                        </div>
                         <div className="col-span-2">
                          <p className="text-slate-500">Rencana Jadwal</p>
                          <p className="font-medium text-slate-800">{formData.installationDate || '-'}</p>
                        </div>
                        <div className="col-span-2">
                           <p className="text-slate-500">Foto Rumah</p>
                           <p className="font-medium text-brand-600 flex items-center gap-1">
                             <CheckCircle2 size={14} /> {formData.housePhotoFile?.name}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Payment Summary Placeholder */}
                  <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800 border border-yellow-200">
                     <p className="font-semibold flex items-center gap-2 mb-1"><CreditCard size={16}/> Informasi Pembayaran</p>
                     <p>Biaya pemasangan pertama dan prorata bulanan akan ditagihkan setelah instalasi berhasil dilakukan oleh teknisi kami.</p>
                  </div>

                </div>

                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-200">
                    <button 
                      onClick={prevStep}
                      className="text-slate-500 font-semibold px-4 py-2 hover:text-slate-800 transition-colors flex items-center gap-1"
                    >
                      <ChevronLeft size={18} /> Edit Data
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-200 transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? 'Memproses...' : 'Kirim Pendaftaran'}
                      {!isSubmitting && <CheckCircle2 size={20} />}
                    </button>
                </div>
              </div>
           </div>
        )}

        {/* STEP 4: Success */}
        {step === FormStep.SUCCESS && (
          <div className="max-w-xl mx-auto text-center animate-in zoom-in duration-500 pt-10">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-green-600" />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 mb-4">Pendaftaran Berhasil!</h2>
             <p className="text-slate-600 mb-8 leading-relaxed">
               Terima kasih <strong>{formData.fullName}</strong>. Tim kami telah menerima data pendaftaran Anda. 
               Kami akan menghubungi Anda melalui WhatsApp di <strong>{formData.phone}</strong> dalam waktu 1x24 jam untuk konfirmasi jadwal instalasi.
             </p>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm inline-block text-left w-full">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ID REGISTRASI</p>
                <div className="flex justify-between items-center">
                  <code className="text-xl font-mono font-bold text-slate-800">{registrationId}</code>
                  <button className="text-brand-600 text-sm font-semibold hover:underline">Salin</button>
                </div>
             </div>
             
             <div className="mt-8 space-y-3">
               <button 
                  onClick={() => selectedPlan && generateRegistrationPDF(formData, selectedPlan, registrationId)}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
               >
                 <Download size={20} />
                 Cetak Bukti Pendaftaran (PDF)
               </button>
               
               <button 
                  onClick={() => window.location.reload()}
                  className="w-full text-slate-500 font-semibold hover:text-slate-800 py-3 px-6 rounded-xl hover:bg-slate-100 transition-colors"
               >
                 Kembali ke Beranda
               </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
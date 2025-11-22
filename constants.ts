import { WifiPlan } from './types';

export const WIFI_PLANS: WifiPlan[] = [
  {
    id: 'hotspot',
    name: 'Paket Hotspot',
    speed: 'upto 3 Mb',
    price: 60000,
    features: ['Ideal untuk 1 Perangkat HP', 'Akses Media Sosial Ringan', 'Sistem Voucher Bulanan', 'Cocok untuk Pelajar'],
    recommendedFor: 'Pengguna personal, pelajar, akses ringan di HP.',
    color: 'bg-orange-50 border-orange-200'
  },
  {
    id: 'hemat',
    name: 'Paket Hemat',
    speed: '',
    price: 165000,
    features: ['Ideal untuk 2-3 perangkat', 'Browsing & Chatting lancar', 'Email & Tugas Sekolah', 'Support 24/7'],
    recommendedFor: 'Pengguna ringan, anak kost, atau penggunaan minimal.',
    color: 'bg-slate-50 border-slate-200'
  },
  {
    id: 'home',
    name: 'Paket Keluarga',
    speed: '',
    price: 200000,
    features: ['Ideal untuk 3-5 perangkat', 'Streaming HD lancar', 'Zoom/Google Meet stabil'],
    recommendedFor: 'Keluarga kecil, bekerja dari rumah (WFH), streaming film.',
    color: 'bg-blue-50 border-blue-200'
  }
];

export const INITIAL_FORM_DATA = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  nik: '',
  installationDate: '',
  selectedPlanId: null,
  housePhotoFile: null
};
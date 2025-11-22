import { jsPDF } from "jspdf";
import { FormData, WifiPlan } from "../types";

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateRegistrationPDF = async (formData: FormData, plan: WifiPlan, regId: string) => {
  const doc = new jsPDF();

  // Colors
  const brandColor = '#2563eb'; // blue-600
  const textColor = '#1e293b'; // slate-800
  const lightText = '#64748b'; // slate-500

  // Header Background - Reduced Height
  doc.setFillColor(37, 99, 235); // brand-600
  doc.rect(0, 0, 210, 25, 'F'); // Height reduced from 40 to 25
  
  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18); // Slightly smaller font
  doc.setFont("helvetica", "bold");
  doc.text("Damar Global Network", 20, 17); // Adjusted Y
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Bukti Pendaftaran Layanan Internet", 190, 17, { align: "right" });

  let yPos = 40; // Started higher (was 60)

  // Registration Meta
  doc.setTextColor(textColor);
  doc.setFontSize(9);
  doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, yPos);
  doc.text(`ID Registrasi: ${regId}`, 190, yPos, { align: "right" });
  
  yPos += 10; // Reduced spacing

  // Section Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Detail Pendaftaran", 20, yPos);
  
  yPos += 4;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Customer Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Informasi Pelanggan", 20, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const details = [
    { label: "Nama Lengkap", value: formData.fullName },
    { label: "NIK", value: formData.nik },
    { label: "Email", value: formData.email },
    { label: "No. WhatsApp", value: formData.phone },
    { label: "Alamat Pemasangan", value: formData.address },
    { label: "Jadwal Instalasi", value: formData.installationDate || "Menunggu Konfirmasi" },
  ];

  details.forEach(item => {
    doc.setTextColor(lightText);
    doc.text(item.label, 20, yPos);
    doc.setTextColor(textColor);
    doc.text(": " + item.value, 70, yPos);
    yPos += 6; // Reduced line height from 8 to 6
  });

  yPos += 8;

  // Plan Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Paket Pilihan", 20, yPos);
  yPos += 8;

  // Box for plan details - Reduced Height
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(20, yPos, 170, 30, 3, 3, 'FD'); // Height reduced from 40 to 30

  const boxY = yPos + 12; // Adjusted padding
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandColor);
  doc.text(plan.name, 30, boxY);

  const priceY = boxY + 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(lightText);
  doc.text("Biaya Bulanan", 30, priceY);
  
  doc.setFontSize(11);
  doc.setTextColor(textColor);
  doc.setFont("helvetica", "bold");
  doc.text(`Rp ${plan.price.toLocaleString('id-ID')}`, 180, priceY, { align: "right" });

  yPos += 40; // Move past box

  // House Photo
  if (formData.housePhotoFile) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Foto Rumah", 20, yPos);
    yPos += 5;
    
    try {
      const base64Img = await readFileAsDataURL(formData.housePhotoFile);
      // Add image: x, y, w, h. 
      // Reduced image size to ensure it fits on one page (80x60)
      doc.addImage(base64Img, 'JPEG', 20, yPos, 80, 60);
      yPos += 65; // Move past image
    } catch (error) {
      console.error("Error adding image to PDF", error);
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(lightText);
      doc.text("(Gagal memuat gambar rumah)", 20, yPos + 5);
      yPos += 15;
    }
  } else {
      // If no photo (should not happen based on validation, but good safe guard)
      yPos += 10;
  }

  // Footer
  // Check if we are too close to bottom, but with above adjustments, it should fit.
  if (yPos > 270) {
     // Fallback if it somehow still overflows
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFontSize(8);
  doc.setTextColor(lightText);
  doc.setFont("helvetica", "italic");
  doc.text("* Harap kirim via WA ke admin, dan simpan dokumen ini sebagai bukti pendaftaran.", 105, yPos, { align: "center" });
  yPos += 4;
  doc.text("* Tim kami akan menghubungi Anda untuk konfirmasi teknis.", 105, yPos, { align: "center" });

  // Save
  doc.save(`Bukti-Pendaftaran-Damar-${formData.fullName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
};

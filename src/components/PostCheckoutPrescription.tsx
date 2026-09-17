import React, { useState } from 'react';
import {
  Upload,
  Eye,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  ArrowRight,
  AlertCircle,
  FileCheck,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { Order, PrescriptionSubmission, ManualEyePower, OptometristAppointment } from '../types.ts';
import { useStore } from '../context/StoreContext.tsx';

interface Props {
  order: Order;
  onUpdated?: (updatedOrder: Order) => void;
}

const GURUGRAM_FLAGSHIP_STORES = [
  {
    id: 'store-sl1',
    name: 'SPECSLOOK SL1 - DREAMZ MALL, GURUGRAM',
    address: 'Shop No. 1, Dreamz Mall UG Floor, Sector 4-7 Circle, Gurugram, Haryana 122001',
    phone: '+91 83688 53448'
  },
  {
    id: 'store-sl2',
    name: 'SPECSLOOK SL2 - SEC 5 CIRCLE, GURUGRAM',
    address: 'Opp. Palam Vihar Road, Near Sec 5 Circle, Railway Road, Gurugram, Haryana 122006',
    phone: '+91 83688 53448'
  },
  {
    id: 'store-sl3',
    name: 'SPECSLOOK SL3 - SECTOR 85, GURUGRAM',
    address: 'Boulevard Galleria, New Gurugram, Sector 85, Gurugram, Haryana 122004',
    phone: '+91 83688 53448'
  },
  {
    id: 'store-sl4',
    name: 'SPECSLOOK SL4 - SECTOR 103, GURUGRAM',
    address: 'Dwarka Expressway Commercial Plaza, Sector 103, Gurugram, Haryana 122006',
    phone: '+91 83688 53448'
  },
  {
    id: 'store-sl5',
    name: 'SPECSLOOK SL5 - SECTOR 89, GURUGRAM',
    address: 'Main Arterial Sector Road Commercial Arcade, Sector 89, Gurugram, Haryana 122505',
    phone: '+91 83688 53448'
  }
];

const TIME_SLOTS = [
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:30 PM - 04:30 PM',
  '04:30 PM - 05:30 PM',
  '05:30 PM - 06:30 PM',
  '06:30 PM - 07:30 PM',
  '07:30 PM - 08:30 PM'
];

// Generate SPH options (-12.00 to +8.00 in 0.25 steps)
const SPH_OPTIONS = (() => {
  const opts: string[] = ['0.00'];
  for (let val = -0.25; val >= -12.00; val -= 0.25) {
    opts.push(val.toFixed(2));
  }
  for (let val = 0.25; val <= 8.00; val += 0.25) {
    opts.push(`+${val.toFixed(2)}`);
  }
  return opts;
})();

// Generate CYL options (-4.00 to +4.00)
const CYL_OPTIONS = (() => {
  const opts: string[] = ['0.00'];
  for (let val = -0.25; val >= -4.00; val -= 0.25) {
    opts.push(val.toFixed(2));
  }
  for (let val = 0.25; val <= 4.00; val += 0.25) {
    opts.push(`+${val.toFixed(2)}`);
  }
  return opts;
})();

// Generate Axis options (1 to 180 degrees)
const AXIS_OPTIONS = (() => {
  const opts: string[] = ['None / 0°'];
  for (let i = 1; i <= 180; i += (i <= 20 || i >= 160 ? 1 : 5)) {
    opts.push(`${i}°`);
  }
  if (!opts.includes('90°')) opts.push('90°');
  if (!opts.includes('180°')) opts.push('180°');
  return opts.sort((a, b) => parseInt(a) - parseInt(b));
})();

// Near Addition options
const ADD_OPTIONS = ['None', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.50'];

// Pupillary distance options
const PD_OPTIONS = ['Average Standard (63 mm)', '58 mm', '60 mm', '62 mm', '63 mm', '64 mm', '65 mm', '66 mm', '68 mm', '70 mm', 'Measure in Store / Call Me'];

export const PostCheckoutPrescription: React.FC<Props> = ({ order, onUpdated }) => {
  const { showToast, setLastPlacedOrder } = useStore();

  const existingPrescription = order.prescription;
  const [isEditing, setIsEditing] = useState<boolean>(!existingPrescription);
  const [selectedMode, setSelectedMode] = useState<'upload' | 'manual' | 'optometrist_exam'>(
    existingPrescription?.mode || 'optometrist_exam'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Option A: Upload State
  const [uploadedFileBase64, setUploadedFileBase64] = useState<string>(existingPrescription?.fileUrl || '');
  const [uploadedFileName, setUploadedFileName] = useState<string>(existingPrescription?.fileName || '');
  const [fileNotes, setFileNotes] = useState<string>(existingPrescription?.fileNotes || '');

  // Option B: Manual Power State
  const [odSph, setOdSph] = useState<string>(existingPrescription?.manualPower?.odSph || '0.00');
  const [odCyl, setOdCyl] = useState<string>(existingPrescription?.manualPower?.odCyl || '0.00');
  const [odAxis, setOdAxis] = useState<string>(existingPrescription?.manualPower?.odAxis || 'None / 0°');
  const [odAdd, setOdAdd] = useState<string>(existingPrescription?.manualPower?.odAdd || 'None');

  const [osSph, setOsSph] = useState<string>(existingPrescription?.manualPower?.osSph || '0.00');
  const [osCyl, setOsCyl] = useState<string>(existingPrescription?.manualPower?.osCyl || '0.00');
  const [osAxis, setOsAxis] = useState<string>(existingPrescription?.manualPower?.osAxis || 'None / 0°');
  const [osAdd, setOsAdd] = useState<string>(existingPrescription?.manualPower?.osAdd || 'None');

  const [pd, setPd] = useState<string>(existingPrescription?.manualPower?.pd || 'Average Standard (63 mm)');
  const [manualNotes, setManualNotes] = useState<string>(existingPrescription?.manualPower?.notes || '');

  // Option C: Optometrist Appointment State
  const [patientName, setPatientName] = useState<string>(
    existingPrescription?.optometristAppointment?.patientName || order.customer.fullName || ''
  );
  const [patientAge, setPatientAge] = useState<string>(
    existingPrescription?.optometristAppointment?.patientAge ? String(existingPrescription.optometristAppointment.patientAge) : ''
  );
  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    existingPrescription?.optometristAppointment?.storeId || GURUGRAM_FLAGSHIP_STORES[0].id
  );
  // Default appointment date: tomorrow
  const defaultDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [appointmentDate, setAppointmentDate] = useState<string>(
    existingPrescription?.optometristAppointment?.appointmentDate || defaultDate
  );
  const [timeSlot, setTimeSlot] = useState<string>(
    existingPrescription?.optometristAppointment?.timeSlot || TIME_SLOTS[2]
  );
  const [contactNumber, setContactNumber] = useState<string>(
    existingPrescription?.optometristAppointment?.contactNumber || order.customer.phone || ''
  );
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    existingPrescription?.optometristAppointment?.specialInstructions || ''
  );

  // Handle File Upload & Convert to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('File size exceeds 8MB. Please choose a smaller image or PDF.');
      return;
    }

    setErrorMessage('');
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    let payload: PrescriptionSubmission;

    if (selectedMode === 'upload') {
      if (!uploadedFileBase64 && !uploadedFileName) {
        setErrorMessage('Please select or drag a photo/document of your prescription.');
        return;
      }
      payload = {
        mode: 'upload',
        submittedAt: new Date().toISOString(),
        fileUrl: uploadedFileBase64 || 'data:image/jpeg;base64,placeholder',
        fileName: uploadedFileName || 'prescription_slip.jpg',
        fileNotes
      };
    } else if (selectedMode === 'manual') {
      payload = {
        mode: 'manual',
        submittedAt: new Date().toISOString(),
        manualPower: {
          odSph,
          odCyl,
          odAxis,
          odAdd,
          osSph,
          osCyl,
          osAxis,
          osAdd,
          pd,
          notes: manualNotes
        }
      };
    } else {
      // Optometrist Exam Appointment
      if (!patientName.trim()) {
        setErrorMessage('Please enter the patient full legal name.');
        return;
      }
      if (!patientAge || parseInt(patientAge) <= 0 || parseInt(patientAge) > 120) {
        setErrorMessage('Please provide a valid patient age (between 1 and 120).');
        return;
      }
      if (!appointmentDate) {
        setErrorMessage('Please choose your preferred examination date.');
        return;
      }
      if (!contactNumber.trim() || contactNumber.length < 10) {
        setErrorMessage('Please provide a valid 10-digit mobile number so our optical team can call you at the assigned time.');
        return;
      }

      const store = GURUGRAM_FLAGSHIP_STORES.find(s => s.id === selectedStoreId) || GURUGRAM_FLAGSHIP_STORES[0];

      const appointment: OptometristAppointment = {
        patientName: patientName.trim(),
        patientAge: parseInt(patientAge),
        storeId: store.id,
        storeName: store.name,
        storeAddress: store.address,
        appointmentDate,
        timeSlot,
        contactNumber: contactNumber.trim(),
        status: 'Pending Confirmation',
        specialInstructions: specialInstructions.trim() || undefined
      };

      payload = {
        mode: 'optometrist_exam',
        submittedAt: new Date().toISOString(),
        optometristAppointment: appointment
      };
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/prescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prescription: payload })
      });

      let updatedOrder: any = null;
      try {
        const text = await res.text();
        updatedOrder = text ? JSON.parse(text) : null;
      } catch {
        updatedOrder = null;
      }
      setIsSubmitting(false);

      if (res.ok && updatedOrder) {
        setLastPlacedOrder(updatedOrder);
        if (onUpdated) onUpdated(updatedOrder);
        setIsEditing(false);
        showToast(
          selectedMode === 'optometrist_exam'
            ? 'Optometrist exam scheduled! Our store team will call on your time slot.'
            : 'Prescription details saved successfully!'
        );
      } else {
        setErrorMessage((updatedOrder && updatedOrder.error) || 'Failed to save prescription details');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Error communicating with server');
    }
  };

  // If already submitted and user is not currently in edit mode, display the verified summary card
  if (existingPrescription && !isEditing) {
    const rx = existingPrescription;
    return (
      <div className="bg-white border-2 border-emerald-500/80 rounded-xs p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-wider text-emerald-700">
                LENS POWER CONFIGURED
              </div>
              <h3 className="text-base font-black text-neutral-900 uppercase tracking-tight">
                {rx.mode === 'optometrist_exam' && 'In-Store Optometrist Eye Exam Scheduled'}
                {rx.mode === 'manual' && 'Manual Optical Power Provided'}
                {rx.mode === 'upload' && 'Prescription Slip Uploaded'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-bold text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 hover:border-neutral-400 bg-neutral-50 rounded-xs self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update / Change</span>
          </button>
        </div>

        {/* View Details according to mode */}
        {rx.mode === 'optometrist_exam' && rx.optometristAppointment && (
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xs p-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Patient Information</span>
                <p className="font-bold text-neutral-900 text-sm">
                  {rx.optometristAppointment.patientName} ({rx.optometristAppointment.patientAge} Years)
                </p>
                <div className="flex items-center gap-2 text-neutral-600 mt-1">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Contact to Call: <strong>+91 {rx.optometristAppointment.contactNumber}</strong></span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Scheduled Time Slot</span>
                <div className="flex items-center gap-2 text-neutral-900 font-bold">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>{new Date(rx.optometristAppointment.appointmentDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{rx.optometristAppointment.timeSlot}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-200/80 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-neutral-900 block uppercase text-[11px]">
                  {rx.optometristAppointment.storeName}
                </span>
                <span className="text-neutral-600 text-[11px]">
                  {rx.optometristAppointment.storeAddress}
                </span>
              </div>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xs border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Status: <strong>{rx.optometristAppointment.status}</strong> — Our flagship optometrist manager will call +91 {rx.optometristAppointment.contactNumber} on your assigned slot.
              </span>
            </div>
          </div>
        )}

        {rx.mode === 'manual' && rx.manualPower && (
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto border border-neutral-200 rounded-xs">
              <table className="w-full text-center">
                <thead className="bg-neutral-100 uppercase text-[10px] text-neutral-700 font-bold">
                  <tr>
                    <th className="py-2 px-3 text-left">Eye</th>
                    <th className="py-2 px-3">Sphere (SPH)</th>
                    <th className="py-2 px-3">Cylinder (CYL)</th>
                    <th className="py-2 px-3">Axis</th>
                    <th className="py-2 px-3">Add (Near)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-mono text-xs">
                  <tr>
                    <td className="py-2 px-3 text-left font-bold font-sans text-neutral-900">Right Eye (OD)</td>
                    <td className="py-2 px-3 font-semibold">{rx.manualPower.odSph}</td>
                    <td className="py-2 px-3 font-semibold">{rx.manualPower.odCyl}</td>
                    <td className="py-2 px-3 font-semibold">{rx.manualPower.odAxis}</td>
                    <td className="py-2 px-3 font-semibold">{rx.manualPower.odAdd || 'None'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-left font-bold font-sans text-neutral-900">Left Eye (OS)</td>
                    <td className="py-2 px-3 font-semibold">{rx.manualPower.osSph}</td>
                    <td className="py-2 px-3 font-semibold">{rx.manualPower.osCyl}</td>
                    <td className="py-2 px-3 font-semibold">{rx.manualPower.osAxis}</td>
                    <td className="py-2 px-3 font-semibold">{rx.manualPower.osAdd || 'None'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {rx.manualPower.pd && (
              <div className="text-[11px] text-neutral-600">
                Pupillary Distance (PD): <strong className="text-neutral-900">{rx.manualPower.pd}</strong>
              </div>
            )}
          </div>
        )}

        {rx.mode === 'upload' && (
          <div className="flex items-center gap-4 bg-neutral-50 p-3.5 border border-neutral-200 rounded-xs text-xs">
            <div className="w-12 h-12 bg-white border border-neutral-300 rounded-xs flex items-center justify-center shrink-0 overflow-hidden">
              {rx.fileUrl && rx.fileUrl.startsWith('data:image') ? (
                <img src={rx.fileUrl} alt="Prescription Slip" className="w-full h-full object-cover" />
              ) : (
                <FileCheck className="w-6 h-6 text-emerald-600" />
              )}
            </div>
            <div className="flex-1">
              <span className="font-bold text-neutral-900 block truncate">
                {rx.fileName || 'Uploaded_Prescription_Slip.pdf'}
              </span>
              <span className="text-[11px] text-neutral-500 block">
                Prescription recorded and attached to optical fabrication order.
              </span>
              {rx.fileNotes && (
                <span className="text-[11px] text-neutral-600 italic block mt-0.5">
                  Doctor note: "{rx.fileNotes}"
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-300 rounded-xs shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 mb-1">
          <Eye className="w-4 h-4 text-red-600" />
          <span>Step 2: Provide Lens Power & Vision Details</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-neutral-900 tracking-tight">
          How would you like to provide your eye power?
        </h2>
        <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
          As promised, your lens power is collected post-checkout for 100% optical accuracy. Select any of the 3 simple methods below:
        </p>
      </div>

      {/* 3 Tab Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Tab 1: Upload */}
        <button
          type="button"
          onClick={() => {
            setSelectedMode('upload');
            setErrorMessage('');
          }}
          className={`p-4 border text-left transition-all rounded-xs flex flex-col justify-between cursor-pointer ${
            selectedMode === 'upload'
              ? 'border-neutral-950 bg-neutral-900 text-white shadow-sm'
              : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/50 text-neutral-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Upload className={`w-5 h-5 ${selectedMode === 'upload' ? 'text-red-500' : 'text-neutral-700'}`} />
            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-xs ${
              selectedMode === 'upload' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
            }`}>
              OPTION 1
            </span>
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider">Upload Prescription</div>
            <div className={`text-[11px] mt-0.5 ${selectedMode === 'upload' ? 'text-neutral-300' : 'text-neutral-500'}`}>
              Upload doctor's slip photo or PDF from your device.
            </div>
          </div>
        </button>

        {/* Tab 2: Manual Dropdown */}
        <button
          type="button"
          onClick={() => {
            setSelectedMode('manual');
            setErrorMessage('');
          }}
          className={`p-4 border text-left transition-all rounded-xs flex flex-col justify-between cursor-pointer ${
            selectedMode === 'manual'
              ? 'border-neutral-950 bg-neutral-900 text-white shadow-sm'
              : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/50 text-neutral-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Eye className={`w-5 h-5 ${selectedMode === 'manual' ? 'text-red-500' : 'text-neutral-700'}`} />
            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-xs ${
              selectedMode === 'manual' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
            }`}>
              OPTION 2
            </span>
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider">Complete Eye Power</div>
            <div className={`text-[11px] mt-0.5 ${selectedMode === 'manual' ? 'text-neutral-300' : 'text-neutral-500'}`}>
              Select SPH, CYL & Axis numbers with dropdowns.
            </div>
          </div>
        </button>

        {/* Tab 3: Optometrist Eye Exam */}
        <button
          type="button"
          onClick={() => {
            setSelectedMode('optometrist_exam');
            setErrorMessage('');
          }}
          className={`p-4 border text-left transition-all rounded-xs flex flex-col justify-between cursor-pointer ${
            selectedMode === 'optometrist_exam'
              ? 'border-neutral-950 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-950'
              : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/50 text-neutral-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className={`w-5 h-5 ${selectedMode === 'optometrist_exam' ? 'text-red-500' : 'text-neutral-700'}`} />
            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-xs ${
              selectedMode === 'optometrist_exam' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
            }`}>
              FREE STORE EXAM
            </span>
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider">Optometrist Eye Test</div>
            <div className={`text-[11px] mt-0.5 ${selectedMode === 'optometrist_exam' ? 'text-neutral-300' : 'text-neutral-500'}`}>
              Get tested by certified optometrist at our Gurugram boutique.
            </div>
          </div>
        </button>
      </div>

      {/* Active Form Body */}
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ---------------- OPTION 1: UPLOAD PRESCRIPTION ---------------- */}
        {selectedMode === 'upload' && (
          <div className="space-y-4 bg-neutral-50 p-6 border border-neutral-200 rounded-xs">
            <div>
              <h3 className="text-sm font-bold uppercase text-neutral-900">Upload Doctor's Prescription Slip</h3>
              <p className="text-xs text-neutral-500">
                Take a clear photo or upload a scanned image / PDF of your ophthalmologist slip.
              </p>
            </div>

            <div className="border-2 border-dashed border-neutral-300 rounded-xs p-6 text-center hover:border-neutral-500 bg-white transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                <span className="text-xs font-bold text-neutral-900">
                  {uploadedFileName ? uploadedFileName : 'Click or Drag & Drop prescription file here'}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1">
                  Supports JPG, PNG, WEBP, PDF (Max 8MB)
                </span>
              </div>
            </div>

            {uploadedFileBase64 && uploadedFileBase64.startsWith('data:image') && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xs text-xs">
                <div className="w-12 h-12 bg-white border border-emerald-300 rounded-xs overflow-hidden shrink-0">
                  <img src={uploadedFileBase64} alt="Uploaded Slip Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-emerald-950 block">{uploadedFileName}</span>
                  <span className="text-[11px] text-emerald-800">Ready to submit. Our certified optician will verify prior to edging.</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Doctor / Clinic Notes (Optional)
              </label>
              <textarea
                value={fileNotes}
                onChange={(e) => setFileNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Doctor prescribed progressive for distance + computer screen reading..."
                className="w-full p-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 bg-white"
              />
            </div>
          </div>
        )}

        {/* ---------------- OPTION 2: COMPLETE EYE POWER WITH DROPDOWNS ---------------- */}
        {selectedMode === 'manual' && (
          <div className="space-y-5 bg-neutral-50 p-6 border border-neutral-200 rounded-xs">
            <div>
              <h3 className="text-sm font-bold uppercase text-neutral-900">Enter Complete Eye Power with Dropdowns</h3>
              <p className="text-xs text-neutral-500">
                Select your power values as indicated on your prescription card (Right Eye = OD, Left Eye = OS).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Right Eye (OD) */}
              <div className="bg-white p-4 border border-neutral-300 rounded-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <span className="text-xs font-black uppercase text-neutral-900">Right Eye (OD)</span>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold">Oculus Dexter</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Sphere (SPH)</label>
                    <select
                      value={odSph}
                      onChange={(e) => setOdSph(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-xs font-mono font-bold text-neutral-900 bg-white"
                    >
                      {SPH_OPTIONS.map((opt) => (
                        <option key={`od-sph-${opt}`} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Cylinder (CYL)</label>
                    <select
                      value={odCyl}
                      onChange={(e) => setOdCyl(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-xs font-mono font-bold text-neutral-900 bg-white"
                    >
                      {CYL_OPTIONS.map((opt) => (
                        <option key={`od-cyl-${opt}`} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Axis</label>
                    <select
                      value={odAxis}
                      onChange={(e) => setOdAxis(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-xs font-mono font-bold text-neutral-900 bg-white"
                    >
                      {AXIS_OPTIONS.map((opt) => (
                        <option key={`od-axis-${opt}`} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Near Add (+)</label>
                    <select
                      value={odAdd}
                      onChange={(e) => setOdAdd(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-xs font-mono font-bold text-neutral-900 bg-white"
                    >
                      {ADD_OPTIONS.map((opt) => (
                        <option key={`od-add-${opt}`} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Left Eye (OS) */}
              <div className="bg-white p-4 border border-neutral-300 rounded-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <span className="text-xs font-black uppercase text-neutral-900">Left Eye (OS)</span>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold">Oculus Sinister</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Sphere (SPH)</label>
                    <select
                      value={osSph}
                      onChange={(e) => setOsSph(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-xs font-mono font-bold text-neutral-900 bg-white"
                    >
                      {SPH_OPTIONS.map((opt) => (
                        <option key={`os-sph-${opt}`} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Cylinder (CYL)</label>
                    <select
                      value={osCyl}
                      onChange={(e) => setOsCyl(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-xs font-mono font-bold text-neutral-900 bg-white"
                    >
                      {CYL_OPTIONS.map((opt) => (
                        <option key={`os-cyl-${opt}`} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Axis</label>
                    <select
                      value={osAxis}
                      onChange={(e) => setOsAxis(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-xs font-mono font-bold text-neutral-900 bg-white"
                    >
                      {AXIS_OPTIONS.map((opt) => (
                        <option key={`os-axis-${opt}`} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Near Add (+)</label>
                    <select
                      value={osAdd}
                      onChange={(e) => setOsAdd(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-xs font-mono font-bold text-neutral-900 bg-white"
                    >
                      {ADD_OPTIONS.map((opt) => (
                        <option key={`os-add-${opt}`} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pupillary Distance & Remarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Pupillary Distance (PD)
                </label>
                <select
                  value={pd}
                  onChange={(e) => setPd(e.target.value)}
                  className="w-full p-2.5 text-xs border border-neutral-300 rounded-xs font-bold text-neutral-900 bg-white"
                >
                  {PD_OPTIONS.map((opt) => (
                    <option key={`pd-${opt}`} value={opt}>{opt}</option>
                  ))}
                </select>
                <p className="text-[10px] text-neutral-500 mt-1">If unsure, choose standard 63mm or our optometrist will verify over phone.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Additional Notes
                </label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. Primarily for night driving and office monitor"
                  className="w-full p-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- OPTION 3: OPTOMETRIST EYE EXAM AT STORE ---------------- */}
        {selectedMode === 'optometrist_exam' && (
          <div className="space-y-5 bg-neutral-50 p-6 border border-neutral-200 rounded-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-sm font-bold uppercase text-neutral-900 flex items-center gap-1.5">
                  <span>Free In-Store Certified Optometrist Eye Exam</span>
                  <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-xs">100% COMPLIMENTARY</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  Visit any of our 5 Gurugram Flagship stores. Our optometrist will call you at the assigned time to confirm your visit.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Patient Name */}
              <div>
                <label className="block font-bold text-neutral-900 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Patient Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Hardik Gogia"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs font-semibold focus:outline-none focus:border-neutral-900 bg-white"
                />
              </div>

              {/* Patient Age */}
              <div>
                <label className="block font-bold text-neutral-900 mb-1">
                  Patient Age (Years) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 28"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs font-semibold focus:outline-none focus:border-neutral-900 bg-white"
                />
              </div>

              {/* Store Selection */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-neutral-900 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>Select Flagship Boutique for Examination *</span>
                </label>
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs font-bold text-neutral-900 bg-white"
                >
                  {GURUGRAM_FLAGSHIP_STORES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} — {st.address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Appointment Date */}
              <div>
                <label className="block font-bold text-neutral-900 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Preferred Appointment Date *</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs font-semibold focus:outline-none focus:border-neutral-900 bg-white"
                />
              </div>

              {/* Appointment Time Slot */}
              <div>
                <label className="block font-bold text-neutral-900 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Appointment Time Slot *</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-xs font-bold text-neutral-900 bg-white"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Contact Number to call on assigned time */}
              <div>
                <label className="block font-bold text-neutral-900 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Contact Number (For store to call you) *</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-neutral-100 border border-r-0 border-neutral-300 text-xs font-bold text-neutral-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="w-full p-2.5 border border-neutral-300 rounded-r-xs font-bold text-neutral-900 bg-white"
                  />
                </div>
              </div>

              {/* Special notes */}
              <div>
                <label className="block font-bold text-neutral-900 mb-1">
                  Vision Issues or Special Notes (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Experiencing digital eye strain, high astigmatism"
                  className="w-full p-2.5 border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 bg-white"
                />
              </div>
            </div>

            {/* Note on Admin Dashboard Notification */}
            <div className="p-3 bg-neutral-100/90 border border-neutral-200 rounded-xs text-[11px] text-neutral-700 flex items-start gap-2">
              <span className="text-red-600 font-bold">✦</span>
              <span>
                <strong>Store Calling Notice:</strong> This appointment is immediately dispatched to the store manager's admin dashboard. Our optometrist concierge will dial your contact number on your selected time slot to confirm your arrival and prepare your custom testing bay.
              </span>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-neutral-200">
          <div className="text-[11px] text-neutral-500">
            Order: <strong className="text-neutral-900 font-mono">{order.orderNumber}</strong> • Frame fabrication starts post optical verification.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {existingPrescription && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-3 border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-xs font-black py-3.5 px-8 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving to Order...</span>
              ) : (
                <>
                  <span>
                    {selectedMode === 'optometrist_exam' ? 'Confirm Store Eye Exam Appointment' : 'Save Prescription Details'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

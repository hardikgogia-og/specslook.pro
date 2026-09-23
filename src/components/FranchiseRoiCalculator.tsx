import React, { useState, useId } from 'react';
import {
  Calculator,
  TrendingUp,
  ShieldCheck,
  Building2,
  Store,
  DollarSign,
  Clock,
  Sparkles,
  ArrowRight,
  MessageCircle,
  RotateCcw,
  CheckCircle2,
  Sliders
} from 'lucide-react';

interface ModelCalculation {
  modelName: string;
  type: 'mini' | 'flagship';
  capex: number;
  capexDisplay: string;
  grossMarginPct: number;
  monthlyOpex: number;
  dailySalesVolume: number;
  monthlySalesVolume: number;
  averageOrderValue: number;
  monthlyRevenue: number;
  monthlyGrossProfit: number;
  monthlyNetProfit: number;
  annualNetProfit: number;
  paybackMonths: number;
  isWithinBuyback: boolean;
}

export const FranchiseRoiCalculator: React.FC = () => {
  const pairsPerDayId = useId();
  const aovId = useId();
  const rentCostId = useId();

  // Active Model selection for calculator focus
  const [selectedModel, setSelectedModel] = useState<'both' | 'mini' | 'flagship'>('both');

  // Input states
  const [dailySalesPairs, setDailySalesPairs] = useState<number>(8); // 8 pairs/day
  const [averageOrderValue, setAverageOrderValue] = useState<number>(2800); // ₹2,800 AOV
  const [rentCost, setRentCost] = useState<number>(45000); // ₹45,000 monthly rent

  // Operating cost assumptions
  // Mini Store (FOFO): Capex ₹8,50,000, 65% margin, 1-2 staff ~₹22,000, utilities ~₹8,000
  // Flagship: Capex ₹20,00,000, 72% margin (high lens + clinic add-ons), 3 staff + optometrist ~₹55,000, utilities ~₹15,000

  const calculateMini = (): ModelCalculation => {
    const capex = 850000; // ₹8.5 Lakhs midpoint
    const grossMarginPct = 0.65; // 65%
    const monthlySalesVolume = dailySalesPairs * 30;
    const monthlyRevenue = monthlySalesVolume * averageOrderValue;
    const monthlyGrossProfit = monthlyRevenue * grossMarginPct;
    // Mini rent scaled proportionally
    const miniRent = Math.round(rentCost * 0.7);
    const monthlyOpex = miniRent + 22000 + 8000;
    const monthlyNetProfit = Math.max(0, monthlyGrossProfit - monthlyOpex);
    const paybackMonths = monthlyNetProfit > 0 ? Number((capex / monthlyNetProfit).toFixed(1)) : 99;

    return {
      modelName: 'Mini Store (FOFO)',
      type: 'mini',
      capex,
      capexDisplay: '₹7 - 10 Lakhs (Avg. ₹8.5L)',
      grossMarginPct: 65,
      monthlyOpex,
      dailySalesVolume: dailySalesPairs,
      monthlySalesVolume,
      averageOrderValue,
      monthlyRevenue,
      monthlyGrossProfit,
      monthlyNetProfit,
      annualNetProfit: monthlyNetProfit * 12,
      paybackMonths,
      isWithinBuyback: paybackMonths <= 24
    };
  };

  const calculateFlagship = (): ModelCalculation => {
    const capex = 2000000; // ₹20 Lakhs
    const grossMarginPct = 0.72; // 72% (higher due to clinical lens testing & anti-glare coatings)
    // Flagship attracts ~25% higher AOV due to Zeiss lenses and luxury archive
    const flagshipAov = Math.round(averageOrderValue * 1.25);
    // Flagship typically achieves ~25-30% higher sales volume from clinic walk-ins & online lead routing
    const flagshipDailySales = Math.round(dailySalesPairs * 1.3);
    const monthlySalesVolume = flagshipDailySales * 30;
    const monthlyRevenue = monthlySalesVolume * flagshipAov;
    const monthlyGrossProfit = monthlyRevenue * grossMarginPct;
    // Flagship rent full scale + optometrist team
    const monthlyOpex = rentCost + 55000 + 15000;
    const monthlyNetProfit = Math.max(0, monthlyGrossProfit - monthlyOpex);
    const paybackMonths = monthlyNetProfit > 0 ? Number((capex / monthlyNetProfit).toFixed(1)) : 99;

    return {
      modelName: 'Specslook FLAGSHIP (FOCO)',
      type: 'flagship',
      capex,
      capexDisplay: '₹20 Lakhs (Company Operated FOCO)',
      grossMarginPct: 0.72,
      monthlyOpex,
      dailySalesVolume: flagshipDailySales,
      monthlySalesVolume,
      averageOrderValue: flagshipAov,
      monthlyRevenue,
      monthlyGrossProfit,
      monthlyNetProfit,
      annualNetProfit: monthlyNetProfit * 12,
      paybackMonths,
      isWithinBuyback: paybackMonths <= 24
    };
  };

  const miniStats = calculateMini();
  const flagshipStats = calculateFlagship();

  // Presets
  const applyPreset = (preset: 'conservative' | 'moderate' | 'aggressive') => {
    if (preset === 'conservative') {
      setDailySalesPairs(5);
      setAverageOrderValue(2200);
      setRentCost(35000);
    } else if (preset === 'moderate') {
      setDailySalesPairs(8);
      setAverageOrderValue(2800);
      setRentCost(45000);
    } else {
      setDailySalesPairs(14);
      setAverageOrderValue(3600);
      setRentCost(65000);
    }
  };

  const handleShareCalculationToWhatsApp = () => {
    const message = encodeURIComponent(
      `*Specslook Franchise ROI Calculation Estimate*\n` +
      `---------------------------------------------\n` +
      `*Input Parameters:*\n` +
      `• Base Sales: ${dailySalesPairs} pairs/day (${dailySalesPairs * 30} pairs/month)\n` +
      `• Average Order Value: ₹${averageOrderValue.toLocaleString('en-IN')}\n` +
      `• Projected Store Rent: ₹${rentCost.toLocaleString('en-IN')}/month\n\n` +
      `*1. Mini Store (FOFO Model - ₹8.5L avg capex):*\n` +
      `• Operating Structure: High Margins & High Volume\n` +
      `• Monthly Net Profit: ₹${miniStats.monthlyNetProfit.toLocaleString('en-IN')}\n` +
      `• Projected ROI Payback: ${miniStats.paybackMonths} Months (Buyback: 24 Months)\n\n` +
      `*2. Specslook FLAGSHIP (FOCO Model - ₹20L capex - Company Operated):*\n` +
      `• Operating Structure: High Margins & High Volume (100% Managed by Specslook)\n` +
      `• Monthly Net Profit: ₹${flagshipStats.monthlyNetProfit.toLocaleString('en-IN')}\n` +
      `• Projected ROI Payback: ${flagshipStats.paybackMonths} Months (Buyback: 24 Months)\n\n` +
      `I would like to review detailed site feasibilities for my city. Please connect with me.`
    );

    window.open(`https://wa.me/918368853448?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="roi-calculator" className="bg-neutral-950 text-white border border-neutral-800 rounded-xs p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-red-500 uppercase tracking-widest mb-1">
              <Calculator className="w-3.5 h-3.5" />
              INTERACTIVE INVESTMENT MODELER
            </div>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Franchise ROI & Profit Calculator
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
              Adjust expected daily sales volume, average order value, and shop rent to see real-time net profits and months to 100% capital recovery under both models.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-semibold hidden sm:inline">Scenario:</span>
            <button
              onClick={() => applyPreset('conservative')}
              className="px-3 py-1.5 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xs border border-neutral-800 transition-colors"
            >
              Conservative
            </button>
            <button
              onClick={() => applyPreset('moderate')}
              className="px-3 py-1.5 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white rounded-xs border border-neutral-700 transition-colors"
            >
              Moderate
            </button>
            <button
              onClick={() => applyPreset('aggressive')}
              className="px-3 py-1.5 text-xs font-bold bg-red-950/80 hover:bg-red-900/80 text-red-400 rounded-xs border border-red-800/80 transition-colors"
            >
              High Growth
            </button>
          </div>
        </div>

        {/* Sliders Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-900/60 p-6 rounded-xs border border-neutral-800">
          {/* Slider 1: Daily Eyewear Sales Volume */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor={pairsPerDayId} className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Daily Sales Volume
              </label>
              <span className="text-sm font-black text-red-400 bg-red-950/60 px-2 py-0.5 rounded-xs border border-red-900/50">
                {dailySalesPairs} pairs / day
              </span>
            </div>
            <input
              id={pairsPerDayId}
              type="range"
              min={3}
              max={30}
              step={1}
              value={dailySalesPairs}
              onChange={(e) => setDailySalesPairs(Number(e.target.value))}
              aria-label="Daily sales volume in pairs per day"
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>3 pairs (90/mo)</span>
              <span>15 pairs (450/mo)</span>
              <span>30 pairs (900/mo)</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Total monthly volume: <strong>{dailySalesPairs * 30} complete pairs & sunglasses</strong>.
            </p>
          </div>

          {/* Slider 2: Average Order Value (AOV) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor={aovId} className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Average Order Value
              </label>
              <span className="text-sm font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-xs border border-amber-900/50">
                ₹{averageOrderValue.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              id={aovId}
              type="range"
              min={1500}
              max={5500}
              step={100}
              value={averageOrderValue}
              onChange={(e) => setAverageOrderValue(Number(e.target.value))}
              aria-label="Average order value in rupees"
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>₹1,500</span>
              <span>₹3,500</span>
              <span>₹5,500</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Blended average ticket for frames, prescription lenses & sunglasses.
            </p>
          </div>

          {/* Slider 3: Store Rent Outlay */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor={rentCostId} className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Estimated Monthly Rent
              </label>
              <span className="text-sm font-black text-neutral-200 bg-neutral-800 px-2 py-0.5 rounded-xs border border-neutral-700">
                ₹{rentCost.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              id={rentCostId}
              type="range"
              min={20000}
              max={120000}
              step={5000}
              value={rentCost}
              onChange={(e) => setRentCost(Number(e.target.value))}
              aria-label="Estimated monthly store rent in rupees"
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>₹20,000 (Tier 2/3)</span>
              <span>₹60,000 (High-St)</span>
              <span>₹1,20,000 (Prime)</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Commercial rent scaled for boutique or high-street location.
            </p>
          </div>
        </div>

        {/* Real-time Side-by-Side Calculation Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MODEL 1: MINI STORE RESULTS */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xs p-6 space-y-6 relative hover:border-neutral-700 transition-colors">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded-xs">
                  FOFO MODEL &bull; 150-300 SQ.FT
                </span>
                <h4 className="text-xl font-black uppercase text-white mt-1.5 flex items-center gap-2">
                  <Store className="w-5 h-5 text-neutral-400" />
                  Mini Store Model
                </h4>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Initial Capital: <strong>{miniStats.capexDisplay}</strong>
                </div>
              </div>

              {/* Payback badge */}
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-neutral-400">Projected Payback</div>
                <div className="text-2xl font-black text-white">
                  {miniStats.paybackMonths > 36 ? '> 36 Mo' : `${miniStats.paybackMonths} Mo`}
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">
                  {miniStats.isWithinBuyback ? '✓ Within 24M Buyback' : 'Exceeds benchmark'}
                </div>
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-neutral-950 p-3 rounded-xs border border-neutral-800/80 space-y-0.5">
                <div className="text-neutral-400 text-[11px]">Monthly Gross Sales</div>
                <div className="text-base font-black text-white">
                  ₹{miniStats.monthlyRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-neutral-500">
                  {miniStats.monthlySalesVolume} pairs @ ₹{averageOrderValue}
                </div>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xs border border-neutral-800/80 space-y-0.5">
                <div className="text-neutral-400 text-[11px]">Gross Earnings</div>
                <div className="text-base font-black text-amber-300">
                  ₹{Math.round(miniStats.monthlyGrossProfit).toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-amber-400 font-semibold">High Margins & High Volume</div>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xs border border-neutral-800/80 space-y-0.5">
                <div className="text-neutral-400 text-[11px]">Est. Monthly Opex</div>
                <div className="text-base font-bold text-neutral-300">
                  ₹{miniStats.monthlyOpex.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-neutral-500">Rent + Staff (1-2) + Power</div>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xs border border-neutral-800/80 space-y-0.5">
                <div className="text-neutral-400 text-[11px]">Net Monthly Profit</div>
                <div className="text-base font-black text-emerald-400">
                  ₹{miniStats.monthlyNetProfit.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-emerald-500">In-pocket monthly returns</div>
              </div>
            </div>

            {/* Annual Net Profit Strip */}
            <div className="bg-neutral-950/90 border border-neutral-800 p-4 rounded-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Projected Annual Net Take-Home
                </span>
                <span className="text-lg font-black text-white">
                  ₹{miniStats.annualNetProfit.toLocaleString('en-IN')} / year
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">Contractual Protection</span>
                <span className="text-xs font-bold text-emerald-400">24 Months Buyback</span>
              </div>
            </div>
          </div>

          {/* MODEL 2: SPECSLOOK FLAGSHIP RESULTS */}
          <div className="bg-neutral-950 border-2 border-red-600 rounded-xs p-6 space-y-6 relative shadow-xl shadow-red-950/20">
            {/* Tag */}
            <div className="absolute -top-3 right-6 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-xs">
              HIGHEST ROI &bull; 8-11 MONTHS
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-950/60 text-red-400 border border-red-900/50 rounded-xs">
                  FOCO MODEL (COMPANY OPERATED) &bull; 500-1000+ SQ.FT
                </span>
                <h4 className="text-xl font-black uppercase text-white mt-1.5 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-red-500" />
                  Specslook FLAGSHIP (FOCO)
                </h4>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Initial Capital: <strong>₹20 Lakhs (Company-Operated + Zeiss Clinic)</strong>
                </div>
              </div>

              {/* Payback badge */}
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-neutral-400">Projected Payback</div>
                <div className="text-2xl font-black text-red-500">
                  {flagshipStats.paybackMonths > 36 ? '> 36 Mo' : `${flagshipStats.paybackMonths} Mo`}
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">
                  {flagshipStats.isWithinBuyback ? '✓ Ultra-Fast Recovery' : 'Review volume'}
                </div>
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-neutral-900 p-3 rounded-xs border border-neutral-800 space-y-0.5">
                <div className="text-neutral-400 text-[11px]">Monthly Gross Sales</div>
                <div className="text-base font-black text-white">
                  ₹{flagshipStats.monthlyRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {flagshipStats.monthlySalesVolume} pairs @ ₹{flagshipStats.averageOrderValue} (Zeiss + Archive)
                </div>
              </div>

              <div className="bg-neutral-900 p-3 rounded-xs border border-neutral-800 space-y-0.5">
                <div className="text-neutral-400 text-[11px]">Gross Earnings</div>
                <div className="text-base font-black text-amber-300">
                  ₹{Math.round(flagshipStats.monthlyGrossProfit).toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-amber-400 font-semibold">High Margins & High Volume</div>
              </div>

              <div className="bg-neutral-900 p-3 rounded-xs border border-neutral-800 space-y-0.5">
                <div className="text-neutral-400 text-[11px]">Est. Monthly Opex</div>
                <div className="text-base font-bold text-neutral-300">
                  ₹{flagshipStats.monthlyOpex.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-neutral-400">Full Rent + Optometrist Team</div>
              </div>

              <div className="bg-neutral-900 p-3 rounded-xs border border-neutral-800 space-y-0.5">
                <div className="text-neutral-400 text-[11px]">Net Monthly Profit</div>
                <div className="text-base font-black text-emerald-400">
                  ₹{flagshipStats.monthlyNetProfit.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">High ticket volume returns</div>
              </div>
            </div>

            {/* Annual Net Profit Strip */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Projected Annual Net Take-Home
                </span>
                <span className="text-lg font-black text-emerald-400">
                  ₹{flagshipStats.annualNetProfit.toLocaleString('en-IN')} / year
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">Safety Net</span>
                <span className="text-xs font-bold text-emerald-400">24M Buyback Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA & Export to WhatsApp */}
        <div className="bg-neutral-900/90 border border-neutral-800 p-6 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h5 className="font-extrabold text-sm uppercase text-white">
              Want a customized site feasibility report for your location?
            </h5>
            <p className="text-xs text-neutral-400">
              Send this exact calculation to our expansion team on WhatsApp to evaluate footfalls and rent-to-revenue viability.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleShareCalculationToWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share ROI Plan to WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

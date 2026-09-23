import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell
} from 'recharts';
import { ShieldCheck, TrendingUp, Sparkles, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface RoiDataPoint {
  name: string;
  shortName: string;
  paybackMonths: number;
  minMonths: number;
  maxMonths: number;
  displayTimeline: string;
  investment: string;
  grossMargin: string;
  monthlyNet: string;
  buyback: string;
  color: string;
  highlight?: boolean;
}

const roiData: RoiDataPoint[] = [
  {
    name: 'Specslook FLAGSHIP (FOCO Model)',
    shortName: 'FLAGSHIP FOCO (₹20L)',
    paybackMonths: 9.5, // 8 - 11 Months average
    minMonths: 8,
    maxMonths: 11,
    displayTimeline: '8 - 11 Months',
    investment: '₹20 Lakhs',
    grossMargin: 'High Margins & High Volume',
    monthlyNet: '₹1.85L – ₹2.80L / mo',
    buyback: '24 Months Buyback Guarantee',
    color: '#dc2626', // Red-600
    highlight: true
  },
  {
    name: 'Mini Store (FOFO Model)',
    shortName: 'Mini FOFO (₹7-10L)',
    paybackMonths: 15,
    minMonths: 14,
    maxMonths: 15,
    displayTimeline: 'Within 15 Months',
    investment: '₹7 - 10 Lakhs',
    grossMargin: 'High Margins & High Volume',
    monthlyNet: '₹65,000 – ₹95,000 / mo',
    buyback: '24 Months Buyback Guarantee',
    color: '#0a0a0a', // Neutral-950
    highlight: false
  },
  {
    name: 'Traditional Optical Retailer',
    shortName: 'Traditional Retail',
    paybackMonths: 32, // 28 - 36 months industry average
    minMonths: 28,
    maxMonths: 36,
    displayTimeline: '28 - 36 Months',
    investment: '₹25 - 35 Lakhs',
    grossMargin: 'Moderate Margins / Low Velocity',
    monthlyNet: '₹40,000 – ₹65,000 / mo',
    buyback: 'No Buyback (100% Owner Risk)',
    color: '#94a3b8', // Slate-400
    highlight: false
  }
];

// Custom Tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: RoiDataPoint = payload[0].payload;
    return (
      <div className="bg-neutral-950 text-white p-4 rounded-xs border border-neutral-800 shadow-2xl max-w-xs text-xs space-y-2">
        <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2">
          <span className="font-extrabold text-sm uppercase text-white">{data.name}</span>
          {data.highlight && (
            <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
              Fastest ROI
            </span>
          )}
        </div>

        <div className="space-y-1.5 pt-1 text-[11px]">
          <div className="flex justify-between items-center text-neutral-400">
            <span>Payback Period:</span>
            <span className="font-black text-emerald-400 text-xs">{data.displayTimeline}</span>
          </div>

          <div className="flex justify-between items-center text-neutral-400">
            <span>Capital Investment:</span>
            <span className="font-bold text-white">{data.investment}</span>
          </div>

          <div className="flex justify-between items-center text-neutral-400">
            <span>Product Gross Margin:</span>
            <span className="font-bold text-amber-300">{data.grossMargin}</span>
          </div>

          <div className="flex justify-between items-center text-neutral-400">
            <span>Est. Monthly Net Profit:</span>
            <span className="font-bold text-white">{data.monthlyNet}</span>
          </div>

          <div className="flex justify-between items-center text-neutral-400 pt-1 border-t border-neutral-800">
            <span>Capital Protection:</span>
            <span className="font-semibold text-emerald-300 text-[10px]">{data.buyback}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const FranchiseRoiChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'cashflow'>('timeline');

  return (
    <div className="bg-white border border-neutral-200 rounded-xs p-6 sm:p-10 shadow-xs space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            INVESTMENT VELOCITY & CAPITAL RECOVERY
          </div>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
            ROI Payback Timeline Comparison
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            Visualizing time required to recoup 100% initial capital investment. Notice how both Specslook models pay off well ahead of the 24-month buyback guarantee safety net.
          </p>
        </div>

        {/* Legend Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-red-600 rounded-xs" />
            <span className="font-bold text-neutral-900">Flagship (8-11 Mo)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-neutral-950 rounded-xs" />
            <span className="font-semibold text-neutral-700">Mini Store (15 Mo)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-slate-400 rounded-xs" />
            <span className="text-neutral-500">Traditional (~32 Mo)</span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="space-y-4">
        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={roiData}
              layout="vertical"
              margin={{ top: 20, right: 35, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              
              <XAxis
                type="number"
                domain={[0, 36]}
                ticks={[0, 6, 8, 11, 15, 24, 30, 36]}
                tickFormatter={(value) => `${value} Mo`}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              
              <YAxis
                type="category"
                dataKey="shortName"
                width={130}
                tick={{ fontSize: 12, fontWeight: 700, fill: '#0f172a' }}
                axisLine={{ stroke: '#cbd5e1' }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* 24-Month Buyback Guarantee Safety Line */}
              <ReferenceLine
                x={24}
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: '24-Month Buyback Guarantee',
                  position: 'top',
                  fill: '#059669',
                  fontSize: 10,
                  fontWeight: 800
                }}
              />

              <Bar
                dataKey="paybackMonths"
                radius={[0, 4, 4, 0]}
                barSize={28}
                animationDuration={1200}
              >
                {roiData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Explanatory Legend / Safety Threshold Note */}
        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-emerald-950 uppercase block">
                The 24-Month Buyback Safety Cushion
              </span>
              <span className="text-emerald-800 text-[11px] leading-relaxed">
                The dashed emerald line marks Specslook's <strong>24-Month Buyback Guarantee</strong>. Both the <strong>Flagship (8–11 mo)</strong> and <strong>Mini Store (15 mo)</strong> achieve full 100% capital payback well before the guarantee expires.
              </span>
            </div>
          </div>

          <div className="shrink-0 bg-white px-3 py-1.5 border border-emerald-300 text-emerald-900 font-extrabold text-xs rounded-xs shadow-xs">
            100% Contractual Protection
          </div>
        </div>
      </div>

      {/* 3 Metric Cards for Direct Investor Scanning */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-red-50/40 border border-red-200 p-4 rounded-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
              FLAGSHIP (FOCO MODEL)
            </span>
            <span className="text-xs font-black text-red-600">8 – 11 Months</span>
          </div>
          <div className="text-sm font-black text-neutral-900">₹20 Lakhs Outlay</div>
          <p className="text-[11px] text-neutral-600 leading-snug">
            Company-operated FOCO format delivering 3x faster recovery via high margins, high volume retail sales & Zeiss computerized clinical exams.
          </p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800">
              MINI STORE (FOFO MODEL)
            </span>
            <span className="text-xs font-black text-neutral-900">~ 15 Months</span>
          </div>
          <div className="text-sm font-black text-neutral-900">₹7 – 10 Lakhs Outlay</div>
          <p className="text-[11px] text-neutral-600 leading-snug">
            Low initial capex with compact 150–300 sq.ft footprint, high margins and high volume turnover on fast-moving sunglasses & frames.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              TRADITIONAL RETAIL
            </span>
            <span className="text-xs font-bold text-slate-600">28 – 36 Months</span>
          </div>
          <div className="text-sm font-bold text-neutral-700">₹25 – 35 Lakhs Outlay</div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Slow capital payback with high dead-stock liabilities, zero manufacturer buyback, and unorganized supply chains.
          </p>
        </div>
      </div>
    </div>
  );
};

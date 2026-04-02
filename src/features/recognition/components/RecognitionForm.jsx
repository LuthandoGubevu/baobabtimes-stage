import React, { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { RECOGNITION_VALUES } from '../constants/recognitionValues';
import { useAuth } from '../../../hooks/useAuth';

const VALUES = Object.keys(RECOGNITION_VALUES);

/**
 * RecognitionForm component matching the editorial/corporate style
 * @param {Object} props
 * @param {Function} props.onSubmit - Submission handler
 * @param {boolean} props.isSubmitting - Loading state
 */
export default function RecognitionForm({ onSubmit, isSubmitting }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    to: "",
    values: [],
    thankYouFor: "",
    from: user?.displayName || user?.fullName || "",
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
  });

  useEffect(() => {
    if (user && !formData.from) {
      setFormData(prev => ({ ...prev, from: user.displayName || user.fullName || "" }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (val) => {
    setFormData(prev => {
      const values = prev.values.includes(val)
        ? prev.values.filter(v => v !== val)
        : [...prev.values, val];
      return { ...prev, values };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#fcfcfb] p-6 md:p-10 text-[#333] font-sans">
      <div className="space-y-10">
        {/* To Field */}
        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-10">
          <label className="w-full md:w-56 pt-2 font-bold text-sm uppercase tracking-tight">
            To: <span className="text-red-500">*</span>
          </label>
          <div className="flex-1 space-y-1.5">
            <input
              required
              type="text"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="w-full border-b border-stone-300 bg-transparent py-1.5 focus:border-stone-900 focus:outline-none transition-colors text-lg"
            />
            <p className="text-[11px] italic text-stone-400 font-medium">Who do you want to recognize?</p>
          </div>
        </div>

        {/* Checkbox List */}
        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-10">
          <label className="w-full md:w-56 pt-2 font-bold text-sm uppercase tracking-tight leading-tight">
            Please tick the relevant box.
          </label>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {VALUES.map(val => {
              const config = RECOGNITION_VALUES[val];
              const Icon = config.icon;
              const isChecked = formData.values.includes(val);
              
              return (
                <label key={val} className="flex items-center space-x-3 cursor-pointer group w-full">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(val)}
                      className={cn(
                        "peer appearance-none w-5 h-5 border border-stone-300 rounded-md transition-all cursor-pointer",
                        isChecked ? "bg-stone-900 border-stone-900" : "bg-white hover:border-stone-400"
                      )}
                    />
                    <svg 
                      className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className={cn(
                    "flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all flex-1",
                    isChecked ? cn(config.bg, config.border) : "bg-transparent border-transparent grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0"
                  )}>
                    <Icon className={cn("w-4 h-4", isChecked ? config.color : "text-stone-400")} />
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-widest",
                      isChecked ? "text-stone-900" : "text-stone-500"
                    )}>
                      {val}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Thank You For */}
        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-10">
          <label className="w-full md:w-56 pt-2 font-bold text-sm uppercase tracking-tight">
            Thank you for:
          </label>
          <div className="flex-1">
            <input
              type="text"
              name="thankYouFor"
              value={formData.thankYouFor}
              onChange={handleChange}
              className="w-full border-b border-stone-300 bg-transparent py-1.5 focus:border-stone-900 focus:outline-none transition-colors text-lg"
            />
          </div>
        </div>

        {/* From Field */}
        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-10">
          <label className="w-full md:w-56 pt-2 font-bold text-sm uppercase tracking-tight">
            From: <span className="text-red-500">*</span>
          </label>
          <div className="flex-1 space-y-1.5">
            <input
              required
              type="text"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="w-full border-b border-stone-300 bg-transparent py-1.5 focus:border-stone-900 focus:outline-none transition-colors text-lg"
            />
            <p className="text-[11px] italic text-stone-400 font-medium">Your Name.</p>
          </div>
        </div>

        {/* Date Field */}
        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-10">
          <label className="w-full md:w-56 pt-2 font-bold text-sm uppercase tracking-tight">
            Date:
          </label>
          <div className="flex-1 space-y-1.5">
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="DD/MM/YY"
              className="w-full border-b border-stone-300 bg-transparent py-1.5 focus:border-stone-900 focus:outline-none transition-colors text-lg"
            />
            <p className="text-[11px] italic text-stone-400 font-medium">DD/MM/YY</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-10 pt-4">
          <div className="hidden md:block md:w-56" />
          <div className="flex-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-10 py-2.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

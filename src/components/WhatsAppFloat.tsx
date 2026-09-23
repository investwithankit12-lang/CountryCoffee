import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppFloat: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<'general' | 'table' | 'events'>('table');

  const templates = {
    table: 'Hello Country Coffees! I would like to check table availability for today.',
    general: 'Hello Country Coffees, I have a quick enquiry regarding your cafe.',
    events: 'Hello! I would like to inquire about hosting a small celebration or meeting at Country Coffees.',
  };

  const handleSend = () => {
    const textToSend = customMsg.trim() || templates[selectedTopic];
    const encoded = encodeURIComponent(textToSend);
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-40">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-[#FAF7F2] border border-[#E6DCD1] rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DCD1]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A1412]">Country Coffees Concierge</h4>
                <p className="text-[10px] text-[#705E53]">Typically replies in a few minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#705E53] hover:text-[#1A1412] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-2">
            <p className="text-xs text-[#5C4C43]">Select an enquiry topic:</p>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setSelectedTopic('table');
                  setCustomMsg('');
                }}
                className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                  selectedTopic === 'table'
                    ? 'border-[#C59A6F] bg-[#C59A6F]/10 text-[#1A1412] font-semibold'
                    : 'border-[#E6DCD1] text-[#705E53] hover:bg-[#F3ECE2]'
                }`}
              >
                Table Booking
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTopic('general');
                  setCustomMsg('');
                }}
                className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                  selectedTopic === 'general'
                    ? 'border-[#C59A6F] bg-[#C59A6F]/10 text-[#1A1412] font-semibold'
                    : 'border-[#E6DCD1] text-[#705E53] hover:bg-[#F3ECE2]'
                }`}
              >
                General Info
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTopic('events');
                  setCustomMsg('');
                }}
                className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                  selectedTopic === 'events'
                    ? 'border-[#C59A6F] bg-[#C59A6F]/10 text-[#1A1412] font-semibold'
                    : 'border-[#E6DCD1] text-[#705E53] hover:bg-[#F3ECE2]'
                }`}
              >
                Events / Parties
              </button>
            </div>

            <textarea
              rows={2}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder={templates[selectedTopic]}
              className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F] resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            className="w-full py-2 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open in WhatsApp</span>
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

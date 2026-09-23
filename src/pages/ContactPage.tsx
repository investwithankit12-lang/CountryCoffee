import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Send,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('General Enquiry');
  const [formMessage, setFormMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formMessage) return;
    setSubmitted(true);
    showToast('Your message has been sent to our restaurant team.');
    setTimeout(() => {
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormMessage('');
      setSubmitted(false);
    }, 4000);
  };

  const faqs = [
    {
      q: 'Where is Country Coffees located?',
      a: 'We are situated at 39, Plot No. 39, BK Block, Sector 2, Bidhannagar (Salt Lake), Kolkata 700091, near Karunamoyee and local residential parks.',
    },
    {
      q: 'What are your operating hours?',
      a: 'We are open from 10:00 AM to 10:00 PM every single day of the week for dine-in, takeaway, and curbside pick-up.',
    },
    {
      q: 'Do you offer parking facilities?',
      a: 'Yes, convenient on-street neighborhood parking is available directly along BK Block right beside the cafe.',
    },
    {
      q: 'Do you host private birthdays or corporate meetings?',
      a: 'Yes, our dedicated lounge seating can be reserved for birthdays, book clubs, and corporate gatherings. You can reach us at +91 70032 39518 or via WhatsApp.',
    },
    {
      q: 'Do you have high-speed Wi-Fi for remote work?',
      a: 'Yes, we provide complimentary high-speed fiber Wi-Fi with accessible power outlets along selected seating booths.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-20">
      
      {/* Header */}
      <div className="bg-[#1A1412] text-[#FAF7F2] py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#3B2F2A]">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Contact & Directions
          </h1>
          <p className="text-sm sm:text-base text-[#B8A89A] max-w-lg mx-auto leading-relaxed">
            Have a question or planning a celebration? Reach out to the Country Coffees hospitality team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Info Grid + Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E6DCD1] p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1A1412]">
                Country Coffees Hospitality
              </h3>

              <div className="space-y-4 text-xs text-[#5C4C43]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C59A6F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#1A1412] mb-0.5">Address</h4>
                    <p className="leading-relaxed">
                      39, Plot No. 39, BK Block, Sector 2, Bidhannagar, Kolkata, West Bengal 700091, India
                    </p>
                    <a
                      href="https://maps.app.goo.gl/RmJhTSJmnQSguXkj7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#C59A6F] hover:underline font-semibold mt-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#C59A6F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#1A1412] mb-0.5">Telephone</h4>
                    <a href="tel:+917003239518" className="hover:text-[#1A1412] transition-colors font-medium">
                      +91 70032 39518
                    </a>
                    <p className="text-[11px] text-[#8A796E] mt-0.5">Direct manager & table reservation line</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C59A6F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#1A1412] mb-0.5">Hours of Service</h4>
                    <p className="font-medium text-[#1A1412]">10:00 AM – 10:00 PM</p>
                    <p className="text-[11px] text-[#8A796E] mt-0.5">Every Day (Monday – Sunday)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border border-[#E6DCD1] shadow-xs h-64 bg-[#E6DCD1]">
              <iframe
                title="Country Coffees Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.834468641499!2d88.415174!3d22.585252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275ccb9ec1433%3A0xea802da98d361ee2!2sCountry%20Coffees!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6DCD1] p-6 sm:p-10 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#1A1412] mb-1">
              Send an Enquiry
            </h3>
            <p className="text-xs text-[#705E53] mb-6">
              Fill out this form and our manager will follow up with you promptly.
            </p>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-[#FAF7F2] rounded-2xl border border-[#E6DCD1]">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#1A1412]">
                  Thank You for Writing to Us!
                </h4>
                <p className="text-xs text-[#5C4C43] max-w-sm mx-auto leading-relaxed">
                  We have received your message and will reach out via mobile or email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="text-xs font-semibold text-[#1A1412] block mb-1">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Anirban Das"
                      className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="text-xs font-semibold text-[#1A1412] block mb-1">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91 98300 00000"
                      className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className="text-xs font-semibold text-[#1A1412] block mb-1">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="text-xs font-semibold text-[#1A1412] block mb-1">
                      Subject
                    </label>
                    <select
                      id="contact-subject"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F]"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Table Booking Query">Table Booking Query</option>
                      <option value="Private Gathering / Birthday">Private Gathering / Birthday</option>
                      <option value="Corporate Meeting">Corporate Meeting</option>
                      <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-msg" className="text-xs font-semibold text-[#1A1412] block mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    required
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="How can we assist you today?"
                    className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#C59A6F]" />
                  <span>Send Message to Team</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl border border-[#E6DCD1] p-8 sm:p-12 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-[#C59A6F]" />
            <h2 className="font-serif text-2xl font-bold text-[#1A1412]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6DCD1]/80 space-y-2">
                <h4 className="text-xs font-bold text-[#1A1412]">{faq.q}</h4>
                <p className="text-xs text-[#5C4C43] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

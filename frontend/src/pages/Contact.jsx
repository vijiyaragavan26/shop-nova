import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Thank you! Your message has been received. Our support team will reply within 24 hours.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900">Get in Touch with Us</h1>
        <p className="text-xs text-slate-500">
          Have an inquiry about an order, return, or product catalog? We are here to assist 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-8">
          <div>
            <h3 className="text-lg font-bold">Contact Information</h3>
            <p className="text-xs text-slate-400 mt-1">
              Reach out directly to our dedicated customer relations team.
            </p>
          </div>

          <div className="space-y-6 text-xs">
            <div className="flex items-start space-x-4">
              <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Toll-Free Helpline</p>
                <p className="text-slate-400 mt-0.5">1800-SHOP-NOVA / +91 98765 43210</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">Available Mon-Sun, 8 AM - 10 PM IST</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Official Support Email</p>
                <p className="text-slate-400 mt-0.5">support@shopnova.com</p>
                <p className="text-slate-400">helpdesk@shopnova.in</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Corporate Headquarters</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  ShopNova Technologies Pvt Ltd,<br />
                  Level 5, Innovate Tower, Outer Ring Road,<br />
                  Bengaluru, Karnataka 560103, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Send an Inquiry
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                placeholder="e.g. Inquiry regarding order delivery timeline"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Your Message *</label>
              <textarea
                rows={4}
                placeholder="How can our support team assist you today?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center space-x-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import emailjs from '@emailjs/browser';
import { Send, Mail, Linkedin, Github, Twitter, PhoneCall, MessageCircle } from 'lucide-react';

// Initialize EmailJS with public key
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '');

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showFlyingMessage, setShowFlyingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  useEffect(() => {
    // Debug log to check environment variables
    console.log('EmailJS Config:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY
    });
  }, [EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS environment variables are missing.');
      setError('Contact form is temporarily unavailable. Please try again later.');
      setIsSubmitting(false);
      return;
    }

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      sender_details: `${formData.name} <${formData.email}>`,
      message: formData.message,
      reply_to: formData.email,
      to_email: 'madhukuruva20@gmail.com',
    } as const;

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      setSubmitted(true);
      setShowFlyingMessage(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
      setTimeout(() => {
        setShowFlyingMessage(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to send contact form message', err);
      setError('Unable to send your message right now. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com/Madhu097', color: 'hover:text-white' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/madhukuruva9/', color: 'hover:text-blue-400' },
    { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-cyan-400' },
    { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/916281198769', color: 'hover:text-green-400' },
    { icon: PhoneCall, label: 'Call', href: 'tel:+916281198769', color: 'hover:text-emerald-400' },
  ];

  const handleEmailClick = () => {
    // Let the mailto link work naturally
  };

  return (
    <section ref={sectionRef} className="min-h-screen bg-gradient-to-br from-[#050510] via-[#070b1d] to-[#0b1026] py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="contact-gradient contact-gradient--one" />
        <div className="contact-gradient contact-gradient--two" />
        <div className="contact-grid" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-12 md:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Let's Connect
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Have a project in mind? Let's create something extraordinary together
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className={`space-y-6 md:space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 md:mb-6 tracking-tight">Get in Touch</h3>
              <p className="text-gray-300/90 leading-relaxed mb-6 md:mb-8 text-sm sm:text-base">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Drop me a message and let's start a conversation.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <a
                href="mailto:madhukuruva20@gmail.com"
                onClick={handleEmailClick}
                className="contact-panel flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-300"
              >
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-emerald-400/70 via-emerald-500/70 to-cyan-400/70">
                  <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6 text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                </div>
                <div>
                  <p className="text-cyan-300/80 text-xs sm:text-sm uppercase tracking-[0.3em]">Email</p>
                  <p className="text-white font-medium text-sm sm:text-base">Madhukuruva20@gmail.com</p>
                </div>
              </a>

              <div className="contact-panel flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-300">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500/70 via-indigo-500/70 to-pink-500/70">
                  <Linkedin className="w-5 sm:w-6 h-5 sm:h-6 text-white drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
                </div>
                <div>
                  <p className="text-purple-200/80 text-xs sm:text-sm uppercase tracking-[0.3em]">Location</p>
                  <p className="text-white font-medium text-sm sm:text-base">India</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base tracking-[0.25em] uppercase text-gray-300/80">Follow Me</p>
              <div className="flex gap-3 sm:gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      data-magnetic
                      className={`contact-panel contact-social w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center text-gray-300/80 text-sm ${social.color}`}
                      aria-label={social.label}
                    >
                      <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <form onSubmit={handleSubmit} className="contact-panel contact-form space-y-4 md:space-y-6 relative overflow-visible rounded-2xl">
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2 text-sm sm:text-base">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="contact-input w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:ring-offset-2 focus:ring-offset-[#0b1026]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2 text-sm sm:text-base">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="contact-input w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:ring-offset-2 focus:ring-offset-[#0b1026]"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2 text-sm sm:text-base">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="contact-input w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:ring-offset-2 focus:ring-offset-[#0b1026] resize-none"
                  placeholder="Tell me about your project or collabration..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitted}
                data-magnetic
                className="contact-button group relative w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl text-white font-medium text-sm sm:text-base overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {submitted ? (
                    'Message Sent!'
                  ) : isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}
              {showFlyingMessage && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flying-envelope">
                    <Mail className="flying-envelope-icon" />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <footer className={`mt-12 md:mt-20 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4 md:mb-6" />
        <p className="text-gray-400 text-[10px] sm:text-xs">
          © 2025 Madhu Kuruva. Built with React, Tailwind CSS & passion.
        </p>
      </footer>
      <style>{`
        .contact-panel {
          position: relative;
          background: rgba(15, 23, 42, 0.28);
          border: 1px solid rgba(148, 163, 184, 0.08);
          backdrop-filter: blur(8px);
          box-shadow: 0 10px 28px -24px rgba(15, 118, 199, 0.28);
        }

        .contact-panel::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          border: 1px solid rgba(59, 130, 246, 0.05);
          mask: linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff);
          mask-composite: exclude;
          padding: 1px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .contact-panel:hover::after {
          opacity: 0.3;
        }

        .contact-social {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .contact-social:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 22px -18px rgba(59, 130, 246, 0.25);
        }

        .contact-form {
          padding: clamp(1.6rem, 2.2vw, 2.2rem);
          border-radius: 1.5rem;
          overflow: hidden;
        }

        .contact-form::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15), transparent 55%),
            radial-gradient(circle at 80% 30%, rgba(165, 180, 252, 0.12), transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(6, 182, 212, 0.1), transparent 62%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .contact-form:hover::before {
          opacity: 0.4;
        }

        .contact-form > * {
          position: relative;
          z-index: 1;
        }

        .contact-input {
          background: rgba(15, 23, 42, 0.38);
          border: 1px solid rgba(148, 163, 184, 0.1);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .contact-input:focus {
          border-color: rgba(59, 130, 246, 0.32);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .contact-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255, 255, 255, 0) 42%, rgba(255, 255, 255, 0.18) 50%, rgba(255, 255, 255, 0) 58%);
          transform: translateX(-120%);
        }

        .contact-button:hover::before {
          transform: translateX(120%);
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .contact-grid {
          position: absolute;
          inset: -50%;
          background-image:
            linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px);
          background-size: 120px 120px;
          transform: rotate(2deg);
          opacity: 0.45;
          mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0.9), transparent 70%);
          animation: grid-pan 18s linear infinite;
        }

        .contact-gradient {
          position: absolute;
          width: 45vw;
          height: 45vw;
          filter: blur(96px);
          opacity: 0.16;
        }

        .contact-gradient--one {
          top: -10vw;
          left: -12vw;
          background: radial-gradient(circle at center, rgba(59, 130, 246, 0.16), transparent 68%);
          animation: float 16s ease-in-out infinite;
        }

        .contact-gradient--two {
          bottom: -8vw;
          right: -10vw;
          background: radial-gradient(circle at center, rgba(14, 165, 233, 0.14), transparent 65%);
          animation: float-alt 18s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(1.4vw, -1.8vw, 0) scale(1.02);
          }
        }

        @keyframes float-alt {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-1.6vw, 1.3vw, 0) scale(1.02);
          }
        }

        @keyframes grid-pan {
          0% {
            transform: rotate(2deg) translate3d(0, 0, 0);
          }
          100% {
            transform: rotate(2deg) translate3d(-120px, -120px, 0);
          }
        }
      `}</style>
    </section>
  );
}

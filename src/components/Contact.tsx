import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import emailjs from '@emailjs/browser';
import { Send, Mail, Linkedin, Github, Twitter, PhoneCall } from 'lucide-react';

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
    { icon: Mail, label: 'Email', href: 'Mailto:madhukuruva20@gmail.com', color: 'hover:text-purple-400' },
    { icon: PhoneCall, label: 'Call', href: 'tel:+916281198769', color: 'hover:text-emerald-400' },
  ];

  return (
    <section ref={sectionRef} className="min-h-screen bg-[#0a0a14] py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600 rounded-full blur-[150px]" />
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
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 md:mb-6">Get in Touch</h3>
              <p className="text-gray-400 leading-relaxed mb-6 md:mb-8 text-sm sm:text-base">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Drop me a message and let's start a conversation.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all duration-300">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Email</p>
                  <p className="text-white font-medium text-sm sm:text-base">Madhukuruva20@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all duration-300">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Location</p>
                  <p className="text-white font-medium text-sm sm:text-base">India</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">Follow Me</p>
              <div className="flex gap-3 sm:gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      data-magnetic
                      className={`w-10 sm:w-12 h-10 sm:h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-gray-400 text-sm ${social.color} transition-all duration-300 hover:scale-110 hover:border-white/30`}
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
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative overflow-visible">
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
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-cyan-500 transition-all duration-300"
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
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-cyan-500 transition-all duration-300"
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
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-cyan-500 transition-all duration-300 resize-none"
                  placeholder="Tell me about your project or collabration..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitted}
                data-magnetic
                className="group relative w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-medium text-sm sm:text-base overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
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
    </section>
  );
}

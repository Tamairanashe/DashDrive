import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Chrome,
  Phone,
  Apple
} from 'lucide-react';
import { ConfirmationResult } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'initial' | 'phone_otp' | 'email_pass' | 'signup' | 'reset';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { 
    loginWithEmail, 
    signupWithEmail, 
    loginWithGoogle, 
    loginWithPhone, 
    verifyOtp,
    resetPassword 
  } = useAuth();
  
  const [step, setStep] = useState<AuthStep>('initial');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'phone_otp') {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      setLoading(true);
      try {
        const result = await loginWithPhone(phone);
        setConfirmationResult(result);
        setStep('phone_otp');
      } catch (error) {
        // Error handled in context
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || otp.length < 6) return;
    setLoading(true);
    try {
      await verifyOtp(confirmationResult, otp);
      onClose();
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      onClose();
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('initial');
    setEmail('');
    setPhone('');
    setOtp('');
    setPassword('');
    setName('');
    setConfirmationResult(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative overflow-hidden"
          >
            {/* Redesigned Header: Close and Back buttons */}
            <div className="flex justify-between items-center p-8 pb-0">
              {step !== 'initial' ? (
                <button 
                  onClick={() => setStep('initial')}
                  className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50"
                >
                  <ChevronLeft size={24} />
                </button>
              ) : <div className="w-10" />}
              
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-10 pt-6">
              <div id="recaptcha-container"></div>
              
              <AnimatePresence mode="wait">
                {step === 'initial' && (
                  <motion.div
                    key="initial"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome to Dash</h2>
                    <p className="text-gray-500 font-medium mb-10 text-lg">Sign in or create an account to get started.</p>

                    <form onSubmit={handleInitialSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone number</label>
                        <div className="relative group">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-100 pr-3 mr-3">
                            <span className="text-gray-400 font-bold">+1</span>
                          </div>
                          <input 
                            type="tel" 
                            required
                            placeholder="Phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-20 pr-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-800 text-lg placeholder:text-gray-300"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed px-1">We'll text you a code to confirm your number. Standard rates apply.</p>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading || !phone}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-5 rounded-2xl transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-3 shadow-lg shadow-indigo-100"
                      >
                        {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : 'Continue'}
                      </button>
                    </form>

                    <div className="mt-8 flex items-center gap-4 text-gray-200">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">social authentication</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <div className="mt-6 space-y-3">
                      <button 
                        onClick={() => setStep('email_pass')}
                        className="w-full flex items-center justify-center gap-4 py-4 rounded-2xl border-2 border-gray-50 bg-white hover:bg-gray-50 transition-all font-bold text-gray-700 active:scale-[0.98]"
                      >
                        <Mail size={20} className="text-indigo-600" />
                        <span>Continue with email</span>
                      </button>
                      
                      <button 
                        className="w-full flex items-center justify-center gap-4 py-4 rounded-2xl border-2 border-gray-50 bg-white hover:bg-gray-50 transition-all font-bold text-gray-700 active:scale-[0.98]"
                      >
                        <Apple size={20} className="fill-black" />
                        <span>Continue with Apple</span>
                      </button>

                      <button 
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-4 py-4 rounded-2xl border-2 border-gray-50 bg-white hover:bg-gray-50 transition-all font-bold text-gray-700 active:scale-[0.98]"
                      >
                        <Chrome size={20} className="text-gray-400" />
                        <span>Continue with Google</span>
                      </button>
                    </div>

                    <p className="mt-10 text-center text-[10px] text-gray-400 px-8 leading-relaxed">
                      By signing in, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                    </p>
                  </motion.div>
                )}

                {step === 'phone_otp' && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Verify Phone</h2>
                    <p className="text-gray-500 font-medium mb-10">Enter the 6-digit code sent to <span className="text-black font-bold">{phone}</span></p>

                    <form onSubmit={handleOtpVerify} className="space-y-8">
                      <div className="grid grid-cols-6 gap-3">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <input
                            key={i}
                            ref={(el) => (otpRefs.current[i] = el)}
                            type="text"
                            maxLength={1}
                            className="w-full aspect-square text-center text-3xl font-black rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all"
                            value={otp[i] || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              const newOtp = otp.split('');
                              newOtp[i] = value;
                              setOtp(newOtp.join(''));
                              if (value && i < 5) otpRefs.current[i + 1]?.focus();
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                otpRefs.current[i - 1]?.focus();
                              }
                            }}
                          />
                        ))}
                      </div>

                      <button 
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-5 rounded-2xl transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-3"
                      >
                        {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm code'}
                      </button>

                      <p className="text-center">
                        <button 
                          type="button"
                          className="text-xs font-bold text-indigo-600 hover:underline"
                        >
                          Resend code in 0:45
                        </button>
                      </p>
                    </form>
                  </motion.div>
                )}

                {step === 'email_pass' && (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Sign in</h2>
                    <p className="text-gray-500 font-medium mb-10">Use your email address to access your account.</p>

                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email</label>
                          <input 
                            type="email" 
                            required
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                            <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Forgot?</button>
                          </div>
                          <input 
                            type="password" 
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-800"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-black py-5 rounded-2xl transition-all active:scale-[0.98] text-lg"
                      >
                        {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Log in'}
                      </button>

                      <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        New to Dash? 
                        <button type="button" onClick={() => setStep('signup')} className="ml-2 text-indigo-600 hover:underline">Create account</button>
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

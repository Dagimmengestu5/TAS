import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { useLocation, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';

const EnterOtp = () => {
    const [searchParams] = useSearchParams();
    const queryEmail = searchParams.get('email');
    const queryCode = searchParams.get('code');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || queryEmail;

    if (!email) {
        return <Navigate to="/login" replace />;
    }

    const getMaskedEmail = (em) => {
        if (!em) return '';
        const [name, domain] = em.split('@');
        if (!name || !domain) return em;
        if (name.length <= 5) return `${name}***@${domain}`;
        return `${name.substring(0, 5)}${'*'.repeat(Math.max(2, name.length - 6))}${name.slice(-1)}@${domain}`;
    };

    useEffect(() => {
        if (queryCode && queryCode.length === 6) {
            setOtp(queryCode.split(''));
            autoVerify(queryEmail, queryCode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryCode, queryEmail]);

    const autoVerify = async (e, c) => {
        setLoading(true);
        try {
            await api.post('/email/verify-otp', { email: e, otp: c });
            alert('Identity Verified Successfully. Please log in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Invalid code.');
            setLoading(false);
        }
    };

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) {
            setError('Please enter all 6 digits.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/email/verify-otp', { email, otp: code });
            alert('Identity Verified Successfully. Please log in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Invalid code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await api.post('/email/send-otp', { email });
            alert('A new code has been dispatched to your email.');
        } catch (err) {
            alert('Failed to resend code. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-10 text-center relative overflow-hidden"
            >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 opacity-5 rounded-bl-full"></div>

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 border border-yellow-100/50">
                        <KeyRound className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Enter Security Code</h1>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-3 leading-relaxed">
                        We dispatched a 6-digit confirmation code to <span className="text-black">{getMaskedEmail(email)}</span>.<br /> sent email in this email chekc your email.
                    </p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleVerify} className="relative z-10">
                    <div className="flex justify-center gap-2 sm:gap-3 mb-8">
                        {otp.map((data, index) => {
                            return (
                                <input
                                    className="w-10 sm:w-12 h-12 sm:h-14 bg-gray-50 border border-gray-200 rounded-xl text-center text-lg font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all font-mono"
                                    type="text"
                                    name="otp"
                                    maxLength="1"
                                    key={index}
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onFocus={e => e.target.select()}
                                />
                            );
                        })}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-2 group shadow-lg shadow-black/5 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                            </>
                        ) : (
                            <>
                                Confirm Identity <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col items-center gap-2 relative z-10">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Didn't receive the code?</p>
                    <button
                        onClick={handleResend}
                        className="text-[10px] font-bold text-black border-b border-yellow-400 hover:text-yellow-600 transition-colors uppercase tracking-widest"
                    >
                        Resend Code
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default EnterOtp;

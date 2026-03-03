import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { User, Mail, Lock, Phone, Briefcase, ArrowRight, ShieldCheck, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const InteractiveDots = ({ mouseX, mouseY }) => {
    const dots = Array.from({ length: 400 });

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#fff000]">
            {/* Interactive Grid of Dots */}
            <div className="absolute inset-0 opacity-15">
                {dots.map((_, i) => {
                    const x = (i % 20) * 5;
                    const y = Math.floor(i / 20) * 5;

                    return (
                        <motion.div
                            key={i}
                            className="absolute w-0.5 h-0.5 rounded-full"
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                backgroundColor: useTransform(
                                    [mouseX, mouseY],
                                    ([mx, my]) => {
                                        const px = (mx + window.innerWidth / 2) / window.innerWidth * 100;
                                        const py = (my + window.innerHeight / 2) / window.innerHeight * 100;
                                        const dx = px - x;
                                        const dy = py - y;
                                        const dist = Math.sqrt(dx * dx + dy * dy);
                                        return dist < 8 ? '#000000' : '#000000';
                                    }
                                ),
                                x: useSpring(useTransform(mouseX, [-1000, 1000], [-30, 30]), { damping: 40, stiffness: 100 }),
                                y: useSpring(useTransform(mouseY, [-1000, 1000], [-30, 30]), { damping: 40, stiffness: 100 }),
                                scale: useTransform(
                                    [mouseX, mouseY],
                                    ([mx, my]) => {
                                        const px = (mx + window.innerWidth / 2) / window.innerWidth * 100;
                                        const py = (my + window.innerHeight / 2) / window.innerHeight * 100;
                                        const dx = px - x;
                                        const dy = py - y;
                                        const dist = Math.sqrt(dx * dx + dy * dy);
                                        return dist < 8 ? 1.5 : 1;
                                    }
                                )
                            }}
                        />
                    );
                })}
            </div>

            {/* Interactive Dark Glow / Spotlight */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full bg-black/5 blur-[120px] pointer-events-none"
                style={{
                    x: useSpring(useTransform(mouseX, [-700, 700], [-150, 150]), { damping: 30, stiffness: 200 }),
                    y: useSpring(useTransform(mouseY, [-700, 700], [-150, 150]), { damping: 30, stiffness: 200 }),
                    left: '50%',
                    top: '50%',
                    marginLeft: '-250px',
                    marginTop: '-250px'
                }}
            />

            {/* Floating Dynamic Dark Dots */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={`float-${i}`}
                    className="absolute w-1 h-1 rounded-full bg-black/20"
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        y: ["-10%", "110%"],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 4 + Math.random() * 6,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5
                    }}
                />
            ))}
        </div>
    );
};

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        professional_background: '',
    });
    const [loading, setLoading] = useState(false);

    // Mouse Tracking for Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set(clientX - innerWidth / 2);
        mouseY.set(clientY - innerHeight / 2);
    };

    // Parallax Transforms
    const textX = useTransform(springX, [-500, 500], [-15, 15]);
    const textY = useTransform(springY, [-500, 500], [-15, 15]);
    const logoX = useTransform(springX, [-500, 500], [-10, 10]);
    const logoY = useTransform(springY, [-500, 500], [-10, 10]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await register(formData);
            if (response.requires_verification) {
                navigate('/enter-otp', { state: { email: response.email, message: response.message } });
            } else {
                alert('Account created successfully.');
                navigate('/');
            }
        } catch (error) {
            alert('Registration failed. Please check your information.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            const response = await api.get(`/auth/${provider}/redirect`);
            window.location.href = response.data.url;
        } catch (error) {
            alert(`Failed to initialize ${provider} signup.`);
        }
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-white flex font-sans overflow-hidden"
        >
            {/* Left Side - Inverted Branding (Yellow background) */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-[#fff000]">
                <InteractiveDots mouseX={mouseX} mouseY={mouseY} />

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ x: logoX, y: logoY }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative z-10 flex items-center gap-3"
                >
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
                        <ShieldCheck className="w-6 h-6 text-[#fff000]" />
                    </div>
                    <span className="text-xl font-bold text-black tracking-tight">Droga Hub</span>
                </motion.div>

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ x: textX, y: textY }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <h1 className="text-6xl font-bold text-black tracking-tight leading-[1.05] mb-6">
                            Join the <br />
                            <span className="opacity-70">elite network.</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ x: textX, y: textY }}
                        transition={{ delay: 0.7, duration: 1 }}
                        className="text-black/60 text-lg leading-relaxed font-medium"
                    >
                        Create your profile today and unlock strategic career opportunities within the Droga Group enterprise.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ x: logoX, y: logoY }}
                    transition={{ delay: 0.9, duration: 1 }}
                    className="relative z-10 flex items-center gap-6 text-sm font-bold text-black/40 uppercase tracking-widest"
                >
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> Precision</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-black/20" /> Excellence</span>
                </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 xl:px-32 relative overflow-y-auto bg-white">
                {/* Top Navigation */}
                <div className="absolute top-8 left-8 right-8 hidden md:flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group text-gray-500 hover:text-black transition-colors">
                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wider">Back to Home</span>
                    </Link>

                    <div className="lg:hidden flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-5 h-5 text-[#fff200]" />
                        </div>
                        <span className="text-lg font-bold text-black tracking-tight">Droga Hub</span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-lg"
                >
                    <div className="mb-8 lg:mb-10 text-center lg:text-left">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-1.5">Create Account</h2>
                        <p className="text-gray-500 text-xs">Please fill in your details to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-gray-900 transition-colors" />
                                    <input
                                        type="text" required
                                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all placeholder:text-gray-300 shadow-sm"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-gray-900 transition-colors" />
                                    <input
                                        type="email" required
                                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all placeholder:text-gray-300 shadow-sm"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider ml-1">Phone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="tel"
                                        required
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all placeholder:text-gray-300 shadow-sm"
                                        placeholder="09..."
                                        value={formData.phone}
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, ''); // Only allow digits
                                            setFormData({ ...formData, phone: val });
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Discipline */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider ml-1">Discipline</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors z-10" />
                                    <select
                                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-8 py-3 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all appearance-none shadow-sm relative z-0"
                                        value={formData.professional_background}
                                        onChange={e => setFormData({ ...formData, professional_background: e.target.value })}
                                    >
                                        <option value="" disabled className="text-gray-300">Select Category</option>
                                        <option value="IT">IT & Tech</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Health">Healthcare</option>
                                        <option value="Eng">Engineering</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Sales">Sales</option>
                                        <option value="HR">Human Resources</option>
                                        <option value="Operations">Operations</option>
                                        <option value="Legal">Legal</option>
                                    </select>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-gray-900 transition-colors" />
                                    <input
                                        type="password" required
                                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all placeholder:text-gray-300 shadow-sm"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider ml-1">Confirm</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-gray-900 transition-colors" />
                                    <input
                                        type="password" required
                                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all placeholder:text-gray-300 shadow-sm"
                                        placeholder="••••••••"
                                        value={formData.password_confirmation}
                                        onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3.5 mt-4 rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-lg shadow-gray-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-brand-yellow rounded-full animate-spin" />
                            ) : (
                                <>
                                    Complete Registration
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#fff200]" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Or register with</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm shadow-gray-100/50 group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                <path d="M1 1h22v22H1z" fill="none" />
                            </svg>
                            <span className="text-xs font-bold text-gray-700">Google</span>
                        </button>
                        <button
                            onClick={() => handleSocialLogin('github')}
                            className="flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm shadow-gray-100/50 group"
                        >
                            <Github className="w-5 h-5 text-gray-900 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-gray-700">GitHub</span>
                        </button>
                    </div>

                    <div className="mt-10 text-center">
                        <span className="text-sm font-medium text-gray-500">
                            Already registered?{' '}
                            <Link
                                to="/login"
                                className="font-bold text-gray-900 hover:text-brand-yellow transition-colors"
                            >
                                Sign In
                            </Link>
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;

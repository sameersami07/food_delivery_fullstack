import React, { useState, useCallback } from "react";
import { useStore } from "../context/StoreContext";
import GoogleSignInButton from "./GoogleSignInButton";
import { Mail, Lock, User as UserIcon, X, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPopup() {
  const { setShowLogin, loginUser, loginWithGoogle, registerUser, loading } = useStore();
  const [currState, setCurrState] = useState<"Login" | "Sign Up">("Login");
  
  // Fields state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all credentials");
      return;
    }

    if (currState === "Sign Up" && !name) {
      setErrorMsg("Please provide your name");
      return;
    }

    if (currState === "Login") {
      const success = await loginUser(email, password);
      if (!success) {
        setErrorMsg("Invalid credentials. Try demo@tomato.com with demo123");
      }
    } else {
      await registerUser(name, email, password);
    }
  };

  const handleDemologin = () => {
    setEmail("demo@tomato.com");
    setPassword("demo123");
    setCurrState("Login");
    setErrorMsg("");
  };

  const handleAdminlogin = () => {
    setEmail("admin@tomato.com");
    setPassword("admin123");
    setCurrState("Login");
    setErrorMsg("");
  };

  const handleGoogleCredential = useCallback(async (credential: string) => {
    setErrorMsg("");
    const success = await loginWithGoogle(credential);
    if (!success) {
      setErrorMsg("Google sign-in failed. Check GOOGLE_CLIENT_ID configuration.");
    }
  }, [loginWithGoogle]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop fading in */}
      <div 
        onClick={() => { if (!loading) setShowLogin(false); }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all"
      ></div>

      {/* Main Form Box popup card */}
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-100 flex flex-col p-6 sm:p-8 animate-in zoom-in-95 duration-250 ease-out">
        
        {/* Absolute Header close button */}
        <button
          onClick={() => setShowLogin(false)}
          disabled={loading}
          className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Title branding text */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {currState}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {currState === "Login" 
              ? "Access your tomato order profiles & histories" 
              : "Register an account to start placing hot orders"
            }
          </p>
        </div>

        {/* Error message slot */}
        {errorMsg && (
          <div className="mb-4 bg-red-50 text-red-600 border border-red-100 text-xs py-2.5 px-3.5 rounded-xl font-medium animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Primary Auth Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {currState === "Sign Up" && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Your Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
                />
                <UserIcon size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="e.g. customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
              />
              <Mail size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
              Secure Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-10 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
              />
              <Lock size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Accept conditions toggle */}
          {currState === "Sign Up" && (
            <div className="flex items-start space-x-2.5 pt-1.5">
              <input
                type="checkbox"
                required
                id="terms"
                className="mt-0.5 rounded accent-red-500 h-3.5 w-3.5 border-slate-200 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-400 font-normal leading-normal cursor-pointer select-none">
                By registering an account with us, I accept the terms of service agreement & privacy policies of Tomato.
              </label>
            </div>
          )}

          {/* Action trigger button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all duration-200 mt-2 shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{currState === "Login" ? "Sign In" : "Register Account"}</span>
            )}
          </button>
        </form>

        {/* Google Sign-In */}
        <div className="mt-4">
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-widest text-slate-400">or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>
          <GoogleSignInButton onCredential={handleGoogleCredential} disabled={loading} />
        </div>

        {/* Demo Fast Login presets for easier evaluation! */}
        <div className="mt-5 border-t border-slate-100 pt-4 flex flex-col items-center">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2.5">
            Evaluate with Demo Logins
          </p>
          <div className="flex items-center space-x-3 w-full">
            <button
              onClick={handleDemologin}
              type="button"
              disabled={loading}
              className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-xl py-2 px-3 text-[11px] font-semibold text-slate-600 cursor-pointer transition-colors"
            >
              Demo Customer
            </button>
            <button
              onClick={handleAdminlogin}
              type="button"
              disabled={loading}
              className="flex-1 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 rounded-xl py-2 px-3 text-[11px] font-semibold text-red-600 cursor-pointer transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Footnote switcher triggers */}
        <div className="mt-5 text-center text-xs text-slate-400 pt-3 border-t border-slate-50">
          {currState === "Login" ? (
            <p>
              New to Tomato?{" "}
              <button
                onClick={() => setCurrState("Sign Up")}
                className="font-bold text-red-500 hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setCurrState("Login")}
                className="font-bold text-red-500 hover:underline cursor-pointer"
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

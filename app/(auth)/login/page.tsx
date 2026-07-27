import Form from "@/components/login/Form";
import Link from "next/link";

export const metadata = { 
  title: "Sign In",
  description: "Log in to access your account"
};

export default function Login() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span className="text-3xl font-bold text-white tracking-tight">Kartify</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome back
          </h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
            Sign in to access your orders, track shipments, and discover exclusive deals.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-white">50k+</p>
              <p className="text-slate-400 text-xs mt-1">Products</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-white">4.9</p>
              <p className="text-slate-400 text-xs mt-1">Rating</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-slate-400 text-xs mt-1">Support</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <svg className="w-8 h-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Kartify</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign in to your account</h1>
          <p className="text-slate-500 mb-8">
            New to Kartify?{" "}
            <Link href="#" className="text-slate-900 font-semibold hover:underline">
              Create an account
            </Link>
          </p>

          <Form />
          
        </div>
      </div>
    </div>
  );
}

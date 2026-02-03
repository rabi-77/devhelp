import { Link } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  Users,
  Clock,
  Zap,
  Shield,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Logo } from "@/components/shared/Logo";

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-emerald-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center bg-emerald-100 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Zap className="h-4 w-4 mr-2 text-emerald-600" fill="currentColor" />
              <span className="text-sm font-semibold text-emerald-900">
                Streamline Your Team Workflow
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Team Management</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Manage projects, track tasks, and collaborate with your team—all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center bg-white border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-all"
              >
                Sign In
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-700 font-medium">Easy Setup</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Users className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-700 font-medium">Team Collaboration</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Clock className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-700 font-medium">Time Tracking</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-700 font-medium">Secure & Reliable</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration Placeholder */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-3xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-emerald-100">
                <div className="grid grid-cols-3 gap-4">
                  {/* Task Card 1 */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg mb-3"></div>
                    <div className="h-3 bg-emerald-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-emerald-100 rounded w-1/2"></div>
                  </div>
                  {/* Task Card 2 */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg mb-3"></div>
                    <div className="h-3 bg-blue-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-blue-100 rounded w-1/2"></div>
                  </div>
                  {/* Task Card 3 */}
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-4 rounded-lg border border-teal-200">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg mb-3"></div>
                    <div className="h-3 bg-teal-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-teal-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Logo size="md" showText={false} variant="light" />
                <span className="text-xl font-bold text-white">devHelp</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-sm">
                Complete project and task management platform for companies and
                teams.
              </p>
              <p className="text-sm text-gray-500">
                © 2026 devHelp. All rights reserved.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">
              Built for teams who value simplicity
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

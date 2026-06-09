import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import '@/i18n';
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageLoader, { RouteProgressBar } from "@/components/PageLoader";
import ChatWidget from "@/components/chatbot/ChatWidget";
import ChatWidget from "@/components/chatbot/ChatWidget";

// Public pages — lazy loaded
const Home        = lazy(() => import('./pages/Home'));
const About       = lazy(() => import('./pages/About/About'));
const Contact     = lazy(() => import('./pages/Contact'));
const Events      = lazy(() => import('./pages/Events'));
const Ministries  = lazy(() => import('./pages/Ministries'));
const Prayer      = lazy(() => import('./pages/Prayer'));
const Partnership = lazy(() => import('./pages/Partnership'));
const Giving      = lazy(() => import('./pages/Giving'));
const Gallery     = lazy(() => import('./pages/Gallery'));
const Resources   = lazy(() => import('./pages/Resources'));
const NotFound    = lazy(() => import('./pages/NotFound'));

// Admin pages — lazy loaded
const AdminLogin        = lazy(() => import('./pages/Admin/Login'));
const AdminLayout       = lazy(() => import('./pages/Admin/Layout'));
const AdminDashboard    = lazy(() => import('./pages/Admin/Dashboard'));
const AdminMinistries   = lazy(() => import('./pages/Admin/Ministries'));
const AdminEvents       = lazy(() => import('./pages/Admin/Events'));
const AdminGallery      = lazy(() => import('./pages/Admin/Gallery'));
const AdminTestimonials = lazy(() => import('./pages/Admin/Testimonials'));
const AdminPartnerships = lazy(() => import('./pages/Admin/Partnerships'));
const AdminPrayerRequests = lazy(() => import('./pages/Admin/PrayerRequests'));

const queryClient = new QueryClient();

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <ChatWidget />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ErrorBoundary>
          {/* Initial app load — full splash screen */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="ministries" element={<AdminMinistries />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="prayers" element={<AdminPrayerRequests />} />
                <Route path="partnerships" element={<AdminPartnerships />} />
              </Route>

              {/* Public Routes — inner Suspense in PublicLayout handles transitions */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/events" element={<Events />} />
                <Route path="/ministries" element={<Ministries />} />
                <Route path="/prayer" element={<Prayer />} />
                <Route path="/partnership" element={<Partnership />} />
                <Route path="/giving" element={<Giving />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

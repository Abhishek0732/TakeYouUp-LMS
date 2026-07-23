import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import VerifyEmailBanner from "./components/VerifyEmailBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CourseProvider } from "./context/CourseContext";
import Chatbot from "@/components/Chatbot";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import CourseEntry from "./routes/CourseEntry";
import { DetailSkeleton } from "@/components/Skeletons";
import { lazy, Suspense } from "react";

// Home stays eager: it is the landing page, so pulling it from a second chunk
// would only add a round trip to the paint that matters most. Everything else
// is split — the Monaco editor, the admin console and highlight.js were all
// being downloaded before a first-time visitor saw the hero.
import Home from "./pages/Home";

const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const CodeEditor = lazy(() => import("./pages/CodeEditor"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Signup = lazy(() => import("./pages/SignUp"));
const CodingQuestions = lazy(() => import("./pages/CodingQuestions"));
const Resources = lazy(() => import("./pages/Resources"));
const ResourceCategory = lazy(() => import("./pages/ResourceCategory"));
const ResourceTopic = lazy(() => import("./pages/ResourceTopic"));
const Admin = lazy(() => import("./pages/Admin"));
const Certificates = lazy(() => import("./pages/Certificates"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));
const MyPosts = lazy(() => import("./pages/MyPosts"));

import { ProgressProvider } from "./context/ProgressContext";

const queryClient = new QueryClient();

/** Shown while a route chunk is in flight — a skeleton, never the word "Loading". */
const RouteFallback = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
    <DetailSkeleton />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProgressProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <VerifyEmailBanner />
                {/* flex-1 + flex-col: main already absorbs the space the
                    navbar and footer leave, which is what pins the footer to the
                    bottom on a short page. Pages must therefore NOT set their
                    own min-height: 100vh — doing so stacked a full viewport
                    inside a container that was already a full viewport tall,
                    leaving a block of dead space above the footer. */}
                <main className="flex-1 flex flex-col">
                  <Suspense fallback={<RouteFallback />}>
                  <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route
                    path="/certificates"
                    element={
                      <ProtectedRoute>
                        <Certificates />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/verify/:serial" element={<VerifyCertificate />} />
                  <Route
                    path="/"
                    element={
                      <CourseProvider>
                        <Home />
                      </CourseProvider>
                    }
                  />
                  <Route
                    path="/courses"
                    element={
                      <CourseProvider>
                        <Courses />
                      </CourseProvider>
                    }
                  />
                  {/* Community blog. The reader pages are public; writing and
                      the author's dashboard need an account. Static segments
                      (/blog/new, /blog/mine, /blog/edit) outrank the dynamic
                      /blog/:slug, so an article slug never shadows them. */}
                  <Route path="/blog" element={<Blog />} />
                  <Route
                    path="/blog/new"
                    element={
                      <ProtectedRoute>
                        <BlogEditor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/blog/edit/:id"
                    element={
                      <ProtectedRoute>
                        <BlogEditor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/blog/mine"
                    element={
                      <ProtectedRoute>
                        <MyPosts />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/blog/:slug" element={<BlogPost />} />

                  {/* Public syllabus when signed out, full course when signed
                      in — see CourseEntry. Also what makes an unknown top-level
                      slug render the not-found page instead of the login form. */}
                  <Route path="/:courseSlug" element={<CourseEntry />} />
                  <Route
                    path="/:courseSlug/:lessonSlug"
                    element={
                      <ProtectedRoute>
                        <CourseDetail />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route
                    path="/resources/:categorySlug"
                    element={<ResourceCategory />}
                  />
                  {/* Browsing categories and topics is public; the practice
                      questions need an account, gated like every other
                      protected page so visitors land on the real login form. */}
                  <Route
                    path="/resources/:categorySlug/:topicSlug"
                    element={
                      <ProtectedRoute>
                        <ResourceTopic />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/online-compiler" element={<CodeEditor />} />
                  <Route
                    path="/problems"
                    element={
                      <ProtectedRoute>
                        <CodingQuestions />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                  </Suspense>
              </main>
              <Footer />
              <Chatbot />
            </div>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </ProgressProvider>
      </AuthProvider>
    </QueryClientProvider>
  );

export default App;

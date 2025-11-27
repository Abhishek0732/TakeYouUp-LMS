import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import InterviewPrep from "./pages/InterviewPrep";
import InterviewPrepDetail from "./pages/InterviewPrepDetail";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { CourseProvider } from "./context/CourseContext";
import Chatbot from "@/components/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
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
                  } />
                {/* <Route path="/:slug" element={<CourseDetail />} /> */}
                <Route path="/:courseSlug" element={<CourseDetail />} />
                <Route path="/:courseSlug/:lessonSlug" element={<CourseDetail />} />

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/interview-prep" element={<InterviewPrep />} />
                <Route path="/interview-prep/:id" element={<InterviewPrepDetail />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

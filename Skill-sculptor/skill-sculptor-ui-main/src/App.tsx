import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import QueryFormPage from "./pages/QueryFormPage";
import RoadmapPage from "./pages/RoadmapPage";
import RoadmapListPage from "./pages/RoadmapListPage";
import LearnStepPage from "./pages/LearnStepPage";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UploadPage from "./pages/UploadPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import FlashcardGeneratePage from "./pages/FlashcardGeneratePage";
import QuizListPage from "./pages/QuizListPage";
import QuizGeneratePage from "./pages/QuizGeneratePage";
import QuizTakePage from "./pages/QuizTakePage";
import GamifiedDashboardPage from "./pages/GamifiedDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/query-form" element={<QueryFormPage />} />
            <Route path="/roadmaps" element={<RoadmapListPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/roadmap/:id" element={<RoadmapPage />} />
            <Route path="/learn/:roadmapId/:stepIndex" element={<LearnStepPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/flashcards/generate" element={<FlashcardGeneratePage />} />
            <Route path="/quiz" element={<QuizListPage />} />
            <Route path="/quiz/generate" element={<QuizGeneratePage />} />
            <Route path="/quiz/:id/take" element={<QuizTakePage />} />
            <Route path="/gamified-dashboard" element={<GamifiedDashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// removed TooltipProvider to avoid runtime error; local tooltips still work
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Conversations from "./pages/Conversations";
import Finances from "./pages/Finances";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/conversations" element={
            <ProtectedRoute>
              {/** Lazy import not necessary for now */}
              {/** Keeping consistent UI */}
              {/** Page shows chat thread */}
              <Conversations />
            </ProtectedRoute>
          } />
          <Route path="/finances" element={
            <ProtectedRoute>
              <Finances />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    
  </QueryClientProvider>
);

export default App;

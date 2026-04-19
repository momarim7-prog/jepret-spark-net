import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import BookTiming from "./pages/BookTiming.tsx";
import BookNow from "./pages/BookNow.tsx";
import BookPosted from "./pages/BookPosted.tsx";
import OnlineBrowse from "./pages/OnlineBrowse.tsx";
import Orders from "./pages/Orders.tsx";
import Chat from "./pages/Chat.tsx";
import Promos from "./pages/Promos.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book/:type/:slug" element={<BookTiming />} />
          <Route path="/book/:type/:slug/now" element={<BookNow />} />
          <Route path="/book/:type/:slug/later" element={<BookNow />} />
          <Route path="/book/:type/:slug/posted" element={<BookPosted />} />
          <Route path="/online/:slug" element={<OnlineBrowse />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/promos" element={<Promos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

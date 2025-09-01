import { ChatInput } from "@/components/dashboard/chat-input";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";

const Index = () => {
  // Enable realtime sync for all database changes
  useRealtimeSync();
  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          <ChatInput />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
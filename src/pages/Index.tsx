import { BreathingCircle } from "@/components/BreathingCircle";
import { SessionsTracker } from "@/components/SessionsTracker";

const Index = () => {
  return (
    <main className="flex-1 container max-w-lg mx-auto p-4">
      <BreathingCircle />
      <SessionsTracker />
    </main>
  );
};

export default Index;
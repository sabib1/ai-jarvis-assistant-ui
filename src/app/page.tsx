import JarvisInterface from "@/components/JarvisInterface";
import ChatInput from "@/components/ChatInput";
import { ArceeTranscripts } from "@/components/ArceeTranscripts";

export default function Home() {
  return (
    <>
      <JarvisInterface />
      <div className="fixed bottom-8 right-8 z-50">
        <ChatInput />
      </div>
      <div className="fixed top-20 left-8 z-40 w-96">
        <ArceeTranscripts />
      </div>
    </>
  );
}
import { Chat } from "@/components/organisms/Chat";
import { CpuAi } from "lucide-react";

const Header = () => (
  <header className="flex flex-col items-center justify-start md:flex-row w-full gap-4 md:gap-8 pb-4 sm:py-8 md:py-0">
    <div>
      <CpuAi className="w-8 h-8 md:w-12 md:h-12 text-gray-600 dark:text-gray-400" />
    </div>
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <h1 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
        {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
      <p className="mt-2 md:text-lg text-gray-600 dark:text-gray-400">
        {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
      </p>
    </div>
  </header>
);

export default function Home() {
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black overflow-hidden select-none">
      <main className="flex h-full w-full max-w-3xl flex-col items-center md:justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
        <Header />
        <div className="flex-1 w-full relative mx-auto md:max-w-xl min-h-0 mt-4 md:max-h-180">
          <Chat />
        </div>
      </main>
    </div>
  );
}

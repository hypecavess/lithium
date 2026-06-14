import { signIn, auth } from "../auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="relative flex flex-col items-center justify-center bg-[#07080a] text-white font-sans h-full min-h-[100dvh] overflow-hidden selection:bg-blue-500/30 text-center px-6">
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-blue-500/8 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[35%] h-[35%] bg-white/[0.01] blur-[140px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-center gap-6 max-w-2xl z-10">
        <h1 className="text-5xl md:text-6xl font-medium text-white tracking-tight">
          The Hugest clean bot.
        </h1>

        <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-lg">
          Automate onboarding with Auto Roles, design custom welcome cards, and configure powerful auto-responders. All managed from a clean, modern dashboard.
        </p>

        <div className="flex flex-row items-center gap-4 mt-2">
          {session ? (
            <Link
              href="/panel"
              className="bg-[#171820] hover:bg-[#20212b] active:scale-[0.98] transition-all text-white text-[13px] font-medium py-2 px-5 rounded-xl border border-white/[0.03] cursor-pointer"
            >
              Go to Dashboard
            </Link>
          ) : (
            <form
              action={async () => {
                "use server"
                await signIn("discord", { redirectTo: "/panel" })
              }}
            >
              <button
                type="submit"
                className="bg-[#171820] hover:bg-[#20212b] active:scale-[0.98] transition-all text-white text-[13px] font-medium py-2 px-5 rounded-xl border border-white/[0.03] cursor-pointer"
              >
                Login with Discord
              </button>
            </form>
          )}

          <a
            href="https://github.com/hypecavess/lithium"
            className="bg-transparent hover:bg-white/[0.02] active:scale-[0.98] transition-all text-zinc-400 hover:text-white text-[13px] font-medium py-2 px-5 rounded-xl border border-white/[0.08] cursor-pointer"
          >
            Source Code
          </a>
        </div>
      </div>
    </main>
  );
}

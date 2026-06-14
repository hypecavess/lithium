export default function LandPanel() {
  return (
    <aside className="w-[340px] min-h-screen pt-[120px] pb-8 px-8 flex flex-col gap-10 text-white shrink-0">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=James"
            alt="Profile"
            className="size-[72px] rounded-full bg-zinc-800 object-cover border-4 border-[#0a0a0f] shadow-lg"
          />
        </div>
        <div>
          <h3 className="font-normal text-[1.1rem] flex items-center gap-1.5 tracking-tight">
            James Gandolfini
            <svg className="size-[18px] text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.5 12.083l-2.618-2.906.634-3.856-3.811-.834-1.92-3.387-3.785 1.611L7.215 1.1 5.295 4.487 1.484 5.32l.634 3.856L-.5 12.083l2.618 2.906-.634 3.856 3.811.834 1.92 3.387 3.785-1.611 3.785 1.611 1.92-3.387 3.811-.834-.634-3.856L22.5 12.083zm-12.825 5.24l-4.14-4.14 1.41-1.41 2.73 2.73 6.01-6.01 1.41 1.41-7.42 7.42z" />
            </svg>
          </h3>
          <p className="text-zinc-500 text-sm mt-0.5">jamesgandolfin@gmail.com</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mt-2">
        <div className="flex justify-between items-center bg-[#15161c] px-6 py-4 rounded-[1.25rem] border border-white/[0.03] shadow-sm">
          <span className="font-normal text-zinc-100">$34,345</span>
          <span className="text-zinc-500 text-[13px] font-normal">Spend</span>
        </div>
        <div className="flex justify-between items-center bg-[#15161c] px-6 py-4 rounded-[1.25rem] border border-white/[0.03] shadow-sm">
          <span className="font-normal text-zinc-100">6</span>
          <span className="text-zinc-500 text-[13px] font-normal">Communities</span>
        </div>
        <div className="flex justify-between items-center bg-[#15161c] px-6 py-4 rounded-[1.25rem] border border-white/[0.03] shadow-sm">
          <span className="font-normal text-zinc-100">254</span>
          <span className="text-zinc-500 text-[13px] font-normal">Offers</span>
        </div>
      </div>
    </aside>
  );
}

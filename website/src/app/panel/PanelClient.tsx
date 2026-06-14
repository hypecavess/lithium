'use client';

import { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import { MouseTooltip } from '../../components/common/Tooltip';
import { Bookmark, Globe, Calendar, ShieldCheck, Key, Role, Chat, Users, Squares } from '../../components/common/Icons';

export interface DiscordServer {
  id: string;
  name: string;
  iconUrl: string | null;
  bannerUrl: string | null;
  letter: string;
  color: string;
  members: string;
  manageable: boolean;
  desc: string | null;
  boosts: number;
  boostTier: number;
  securityLevel: string;
  ownerId: string | null;
  serverType: string;
  accessType: string;
  creationDateText: string;
  isOwner: boolean;
}

interface PanelClientProps {
  session: Session | null;
}

export default function PanelClient({ session }: PanelClientProps) {
  const [view, setView] = useState<'home' | 'detail'>('home');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('Name of Community');
  const [tooltipText, setTooltipText] = useState("Copy ID");
  const [activeTab, setActiveTab] = useState<string>("Servers");
  const [searchQuery, setSearchQuery] = useState("");
  const [servers, setServers] = useState<DiscordServer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServers() {
      try {
        setLoading(true);
        const res = await fetch("/api/guilds");
        if (!res.ok) {
          throw new Error("Failed to fetch servers");
        }
        const data = await res.json();
        setServers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchServers();
  }, []);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedInvite, setCopiedInvite] = useState(false);

  useEffect(() => {
    const handleViewChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ view: 'home' | 'detail'; server?: string }>;
      if (customEvent.detail) {
        setView(customEvent.detail.view);
        if (customEvent.detail.server) {
          setSelectedCommunity(customEvent.detail.server);
        }
      }
    };
    window.addEventListener('panel-view-change', handleViewChange);
    return () => {
      window.removeEventListener('panel-view-change', handleViewChange);
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("lithium_favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
      }
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("lithium_favorites", JSON.stringify(updated));
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setTooltipText("Copied");
  };

  const tabs = ["Servers", "Favorites", "Teams", "Projects"];

  const handleSelectCommunity = (name: string) => {
    setSelectedCommunity(name);
    setView('detail');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('panel-view-change', {
        detail: { view: 'detail', server: name }
      }));
    }
  };

  const handleBackToHome = () => {
    setView('home');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('panel-view-change', {
        detail: { view: 'home' }
      }));
    }
  };

  const currentServer = servers.find(s => s.name === selectedCommunity);

  const handleCopyInvite = async () => {
    if (!currentServer) return;
    try {
      const res = await fetch(`/api/guilds/${currentServer.id}/invite`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.url) {
          navigator.clipboard.writeText(data.url);
          setCopiedInvite(true);
          setTimeout(() => setCopiedInvite(false), 2000);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to generate real invite:", e);
    }

    const inviteUrl = `https://discord.com/channels/${currentServer.id}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const filteredServers = servers
    .filter((server) =>
      server.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (b.manageable ? 1 : 0) - (a.manageable ? 1 : 0));

  const favoriteServers = filteredServers.filter((server) =>
    favorites.includes(server.id)
  );

  const totalMembers = servers
    .filter((s) => s.manageable && s.members && s.members !== "N/A")
    .reduce((acc, curr) => {
      const count = parseInt(curr.members.replace(/[^0-9]/g, "")) || 0;
      return acc + count;
    }, 0);

  const userDisplayName = session?.user?.name || "James Gandolfini";
  const emailPrefix = session?.user?.email ? session.user.email.split('@')[0] : "jamesgandolfin";
  const userUsername = `@${session?.user?.username || emailPrefix}`;
  const userAvatar = session?.user?.image || "https://api.dicebear.com/7.x/notionists/svg?seed=James";

  return (
    <div className="flex flex-col h-full bg-transparent">
      {view === 'detail' && (
        <>
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center gap-2 text-[14px]">
              <button
                onClick={handleBackToHome}
                className="text-zinc-500 hover:text-zinc-300 font-medium transition-colors cursor-pointer"
              >
                Servers
              </button>
              <span className="text-zinc-600 font-medium">/</span>
              <span className="text-zinc-100 font-medium">{selectedCommunity}</span>
            </div>

            <div className="flex items-center gap-5 w-full sm:w-auto">
              <div className="relative w-full sm:w-44">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 size-[13px] text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="search"
                  className="w-full bg-[#15161c]/80 border border-white/[0.03] rounded-full py-1.5 pl-8.5 pr-4 text-[13px] text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-white/10 transition-all font-medium"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <img
                  src={userAvatar}
                  alt="Profile"
                  className="size-6 rounded-full bg-zinc-800 object-cover"
                />
                <MouseTooltip content={tooltipText}>
                  <span
                    onClick={() => handleCopyId(session?.user?.id || "1515762692818866257")}
                    onMouseLeave={() => setTooltipText("Copy ID")}
                    className="text-[13px] text-zinc-300 font-medium hover:text-white cursor-pointer transition-colors"
                  >
                    {userDisplayName}
                  </span>
                </MouseTooltip>
              </div>
            </div>
          </header>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 py-6">
            <div className="flex flex-col gap-6">
              <div className="relative w-full h-[210px] rounded-[20px] overflow-hidden border border-white/[0.04] bg-[#101115] shadow-inner flex items-center justify-center">
                {currentServer?.bannerUrl ? (
                  <img
                    src={currentServer.bannerUrl}
                    alt="Community Banner"
                    className="w-full h-full object-cover opacity-85 hover:scale-[1.02] transition-transform duration-700"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 select-none text-center px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-8 text-zinc-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a3 3 0 0 1 4.243 0l6.28 6.28m0 0-3.059-3.059a3 3 0 0 1 4.243 0l2.082 2.082m-19.5 1.5.03-.03m-3.185-3.185.03-.03m0 0 1.5-1.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className="text-[12px] text-zinc-500 font-medium">No banner available for this server</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                <div className="bg-[#121319]/90 border border-white/[0.03] rounded-2xl p-5 flex flex-col gap-3.5 hover:bg-[#16171f] hover:border-white/[0.06] transition-all cursor-pointer group shadow-sm">
                  <div className="size-9 bg-[#171820] border border-white/[0.03] rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                    <Role className="size-4.5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-medium text-[13.5px] text-zinc-200 group-hover:text-white transition-colors">Auto Role</h4>
                    <p className="text-zinc-500 text-[12px] leading-relaxed">Automatically assign roles to new members on arrival.</p>
                  </div>
                </div>

                <div className="bg-[#121319]/90 border border-white/[0.03] rounded-2xl p-5 flex flex-col gap-3.5 hover:bg-[#16171f] hover:border-white/[0.06] transition-all cursor-pointer group shadow-sm">
                  <div className="size-9 bg-[#171820] border border-white/[0.03] rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                    <Chat className="size-4.5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-medium text-[13.5px] text-zinc-200 group-hover:text-white transition-colors">Responders</h4>
                    <p className="text-zinc-500 text-[12px] leading-relaxed">Define custom triggers and automated responses.</p>
                  </div>
                </div>

                <div className="bg-[#121319]/90 border border-white/[0.03] rounded-2xl p-5 flex flex-col gap-3.5 hover:bg-[#16171f] hover:border-white/[0.06] transition-all cursor-pointer group shadow-sm">
                  <div className="size-9 bg-[#171820] border border-white/[0.03] rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                    <Users className="size-4.5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-medium text-[13.5px] text-zinc-200 group-hover:text-white transition-colors">Welcomer</h4>
                    <p className="text-zinc-500 text-[12px] leading-relaxed">Greet new members with join messages.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-[20px] font-medium tracking-tight text-white">{selectedCommunity}</h2>
                <p className="text-zinc-500 text-[13px] leading-relaxed mt-2.5">
                  {currentServer?.desc || "No description available for this server."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 mt-1">
                <span className="bg-[#14151c]/90 border border-white/[0.04] text-zinc-300 text-[12px] px-3 py-1 rounded-[6px] flex items-center gap-1.5 font-medium shadow-sm">
                  <Globe className="size-[13px] text-zinc-400" />
                  {currentServer?.serverType || "Personal Server"}
                </span>
                {currentServer?.boosts && currentServer.boosts > 0 ? (
                  <span className="bg-[#1b101a] border border-pink-500/10 text-pink-400 text-[12px] px-3 py-1 rounded-[6px] flex items-center gap-1.5 font-medium shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-[13px] text-pink-400">
                      <path d="M11.645 20.91l-9-9c-.39-.39-.39-1.02 0-1.41l9-9c.39-.39 1.02-.39 1.41 0l9 9c.39.39.39 1.02 0 1.41l-9 9c-.38.39-1.02.39-1.41 0z" />
                    </svg>
                    Boost Tier {currentServer.boostTier} ({currentServer.boosts} Boosts)
                  </span>
                ) : (
                  <span className="bg-[#151515] border border-white/[0.04] text-zinc-400 text-[12px] px-3 py-1 rounded-[6px] flex items-center gap-1.5 font-medium shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="size-[13px] text-zinc-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    No Boosts
                  </span>
                )}
              </div>

              <div className="bg-[#13141b]/95 border border-white/[0.03] rounded-[14px] p-3.5 flex justify-between items-center shadow-sm mt-2">
                <span className="text-white text-[15px] font-bold tracking-tight">
                  {currentServer?.members ? currentServer.members.replace(" Members", "") : "0"}
                </span>
                <span className="text-zinc-500 text-[12px] font-medium">Members</span>
              </div>

              <div className="bg-[#13141b]/95 border border-white/[0.03] rounded-[14px] p-3.5 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentServer?.isOwner ? userAvatar : `https://api.dicebear.com/7.x/notionists/svg?seed=${currentServer?.ownerId || "Owner"}`}
                    alt="Owner Profile"
                    className="size-5.5 rounded-full bg-zinc-800 object-cover"
                  />
                  <span className="text-white text-[13px] font-medium">
                    {currentServer?.isOwner ? userDisplayName : "Server Owner"}
                  </span>
                </div>
                <span className="text-zinc-500 text-[12px] font-medium">Owner</span>
              </div>

              <div className="flex flex-col mt-2 divide-y divide-white/[0.02]">
                <div className="flex justify-between items-center py-3.5 text-[13px]">
                  <div className="flex items-center gap-2.5 text-zinc-500 font-medium">
                    <ShieldCheck className="size-4 text-zinc-500" />
                    Verification Level
                  </div>
                  <span className="text-white font-medium">{currentServer?.securityLevel || "None"}</span>
                </div>

                <div className="flex justify-between items-center py-3.5 text-[13px]">
                  <div className="flex items-center gap-2.5 text-zinc-500 font-medium">
                    <Calendar className="size-4 text-zinc-500" />
                    Created At
                  </div>
                  <span className="text-white font-medium">{currentServer?.creationDateText || "N/A"}</span>
                </div>

                <div className="flex justify-between items-center py-3.5 text-[13px]">
                  <div className="flex items-center gap-2.5 text-zinc-500 font-medium">
                    <Key className="size-4 text-zinc-500" />
                    Access Type
                  </div>
                  <span className="text-white font-medium">{currentServer?.accessType || "Invite Only"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={handleCopyInvite}
                  className="w-full bg-[#171820] hover:bg-[#20212b] active:scale-[0.98] transition-all text-white text-[13px] font-medium py-2.5 rounded-xl border border-white/[0.03] cursor-pointer"
                >
                  {copiedInvite ? "Invite Link Copied!" : "Copy Invite Link"}
                </button>
                <button
                  onClick={handleBackToHome}
                  className="w-full bg-transparent hover:bg-white/[0.02] active:scale-[0.98] transition-all text-zinc-400 hover:text-white text-[13px] font-medium py-2.5 rounded-xl border border-white/[0.08] cursor-pointer"
                >
                  Unauthorize
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {view === 'home' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 py-6">
          <div className="flex flex-col gap-6">
            <div className="sticky top-12 z-20 flex flex-col gap-4 bg-transparent rounded-xl backdrop-blur-md pt-1 pb-4 border-b border-white/[0.02]">
              <h1 className="text-[28px] font-medium text-white tracking-tight">Home</h1>

              <div className="flex items-center gap-1">
                {tabs.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[13px] px-4 py-1.5 rounded-full transition-all font-medium cursor-pointer ${tab === activeTab
                      ? "border border-white text-white bg-transparent"
                      : "text-zinc-500 hover:text-white"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#15161c]/80 border border-white/[0.03] rounded-2xl py-3 pl-11 pr-4 text-[13px] text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-white/10 transition-all font-medium shadow-inner"
                />
              </div>
            </div>

            {activeTab === "Servers" && (
              <div className="flex flex-col gap-4">
                {loading && (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-[#121319]/90 border border-white/[0.03] rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-zinc-800" />
                          <div className="flex flex-col gap-2">
                            <div className="h-4 w-32 bg-zinc-800 rounded" />
                            <div className="h-3 w-16 bg-zinc-800 rounded" />
                          </div>
                        </div>
                        <div className="h-3 w-full bg-zinc-800 rounded mt-1" />
                      </div>
                    ))}
                  </>
                )}

                {!loading && error && (
                  <div className="bg-[#121319]/90 rounded-2xl p-6 text-center">
                    <span className="text-white text-[13px] font-normal">Error loading servers: {error}</span>
                  </div>
                )}

                {!loading && !error && filteredServers.length === 0 && (
                  <div className="bg-[#121319]/90 border border-white/[0.03] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2.5 shadow-sm">
                    <div className="size-11 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 border border-white/[0.03]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-zinc-200 font-medium text-[13px]">No Admin Servers Found</h3>
                      <p className="text-zinc-500 text-[12px] max-w-xs leading-relaxed">
                        You don't seem to be an administrator of any Discord servers.
                      </p>
                    </div>
                  </div>
                )}

                {!loading && !error && filteredServers.map((server, idx) => (
                  <div
                    key={server.id || idx}
                    onClick={() => handleSelectCommunity(server.name)}
                    className="bg-[#121319]/90 border border-white/[0.03] rounded-2xl p-5 flex flex-col gap-3 hover:bg-[#16171f] hover:border-white/[0.06] transition-all cursor-pointer shadow-sm group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {server.iconUrl ? (
                          <img
                            src={server.iconUrl}
                            alt={server.name}
                            className="size-9 rounded-full object-cover shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                          />
                        ) : (
                          <div className={`size-9 rounded-full bg-gradient-to-br ${server.color} flex items-center justify-center text-white font-bold text-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}>
                            {server.letter}
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <h4 className="font-medium text-[14px] text-zinc-200 group-hover:text-white transition-colors">
                            {server.name}
                          </h4>
                          <span className="text-[12px] text-zinc-500 font-medium flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3.5 text-zinc-600">
                              <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                            </svg>
                            {server.members}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {server.manageable ? (
                          <span className="bg-emerald-500/5 text-emerald-400 text-[11px] px-2 py-0.5 rounded-[5px] border border-emerald-500/10 flex items-center gap-1 font-medium select-none">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Manageable
                          </span>
                        ) : (
                          <span className="bg-white/5 text-zinc-400 text-[11px] px-2 py-0.5 rounded-[5px] border border-white/[0.08] flex items-center gap-1 font-medium select-none">
                            <span className="size-1.5 rounded-full bg-zinc-500" />
                            Not Manageable
                          </span>
                        )}

                        <button
                          onClick={(e) => toggleFavorite(server.id, e)}
                          className="p-1 rounded-md hover:bg-white/5 text-zinc-500 hover:text-yellow-400 active:scale-95 transition-all cursor-pointer"
                        >
                          <Bookmark className={`size-4 ${favorites.includes(server.id) ? "text-yellow-500" : "text-zinc-600 hover:text-zinc-300"}`} />
                        </button>
                      </div>
                    </div>
                    <p className="text-zinc-500 text-[13px] leading-relaxed pl-0.5">
                      {server.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Teams" && (
              <div className="bg-[#121319]/90 border border-white/[0.03] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 shadow-sm">
                <div className="size-12 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-400 border border-white/[0.03]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-zinc-200 font-medium text-[14px]">No Teams Configured</h3>
                  <p className="text-zinc-500 text-[13px] max-w-sm leading-relaxed">
                    You are not a member of any teams yet. Create a team or get invited to collaborate.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "Projects" && (
              <div className="bg-[#121319]/90 border border-white/[0.03] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 shadow-sm">
                <div className="size-12 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-400 border border-white/[0.03]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-zinc-200 font-medium text-[14px]">No Projects Initialized</h3>
                  <p className="text-zinc-500 text-[13px] max-w-sm leading-relaxed">
                    No active projects found. Start a project to track task lists, integrations, and releases.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "Favorites" && (
              <div className="flex flex-col gap-4">
                {favoriteServers.length === 0 ? (
                  <div className="bg-[#121319]/90 border border-white/[0.03] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2.5 shadow-sm">
                    <div className="size-11 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 border border-white/[0.03]">
                      <Bookmark className="size-5 text-yellow-500" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-zinc-200 font-medium text-[13px]">No Favorites Added</h3>
                      <p className="text-zinc-500 text-[12px] max-w-xs leading-relaxed">
                        Click the bookmark icon on any server to add it to your favorites.
                      </p>
                    </div>
                  </div>
                ) : (
                  favoriteServers.map((server, idx) => (
                    <div
                      key={server.id || idx}
                      onClick={() => handleSelectCommunity(server.name)}
                      className="bg-[#121319]/90 border border-white/[0.03] rounded-2xl p-5 flex flex-col gap-3 hover:bg-[#16171f] hover:border-white/[0.06] transition-all cursor-pointer shadow-sm group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {server.iconUrl ? (
                            <img
                              src={server.iconUrl}
                              alt={server.name}
                              className="size-9 rounded-full object-cover shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                            />
                          ) : (
                            <div className={`size-9 rounded-full bg-gradient-to-br ${server.color} flex items-center justify-center text-white font-bold text-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}>
                              {server.letter}
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5">
                            <h4 className="font-medium text-[14px] text-zinc-200 group-hover:text-white transition-colors">
                              {server.name}
                            </h4>
                            <span className="text-[12px] text-zinc-500 font-medium flex items-center gap-1.5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3.5 text-zinc-600">
                                <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                              </svg>
                              {server.members}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {server.manageable ? (
                            <span className="bg-emerald-500/5 text-emerald-400 text-[11px] px-2 py-0.5 rounded-[5px] border border-emerald-500/10 flex items-center gap-1 font-medium select-none">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              Manageable
                            </span>
                          ) : (
                            <span className="bg-white/5 text-zinc-400 text-[11px] px-2 py-0.5 rounded-[5px] border border-white/[0.08] flex items-center gap-1 font-medium select-none">
                              <span className="size-1.5 rounded-full bg-zinc-500" />
                              Not Manageable
                            </span>
                          )}

                          <button
                            onClick={(e) => toggleFavorite(server.id, e)}
                            className="p-1 rounded-md hover:bg-white/5 text-zinc-500 hover:text-yellow-400 active:scale-95 transition-all cursor-pointer"
                          >
                            <Bookmark className={`size-4 ${favorites.includes(server.id) ? "text-yellow-500" : "text-zinc-600 hover:text-zinc-300"}`} />
                          </button>
                        </div>
                      </div>
                      <p className="text-zinc-500 text-[13px] leading-relaxed pl-0.5">
                        {server.desc}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 sticky top-12 h-fit">
            <div className="flex flex-col gap-3">
              <img
                src={userAvatar}
                alt="Profile"
                className="size-[68px] rounded-full bg-zinc-800 object-cover border-2 border-white/[0.03] shadow-md"
              />
              <div className="flex flex-col gap-0.5">
                <h3 className="font-medium text-[15px] flex items-center gap-1.5 text-white">
                  <MouseTooltip content={tooltipText}>
                    <span
                      onClick={() => handleCopyId(session?.user?.id || "1515762692818866257")}
                      onMouseLeave={() => setTooltipText("Copy ID")}
                      className="cursor-pointer hover:text-zinc-300 transition-colors"
                    >
                      {userDisplayName}
                    </span>
                  </MouseTooltip>
                  <svg className="size-[15px] text-[#1DA1F2] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.5 12.083l-2.618-2.906.634-3.856-3.811-.834-1.92-3.387-3.785 1.611L7.215 1.1 5.295 4.487 1.484 5.32l.634 3.856L-.5 12.083l2.618 2.906-.634 3.856 3.811.834 1.92 3.387 3.785-1.611 3.785 1.611 1.92-3.387 3.811-.834-.634-3.856L22.5 12.083zm-12.825 5.24l-4.14-4.14 1.41-1.41 2.73 2.73 6.01-6.01 1.41 1.41-7.42 7.42z" />
                  </svg>
                </h3>
                <span className="text-zinc-600 text-[12px] font-medium">{userUsername}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              <div className="flex justify-between items-center bg-[#13141b]/95 px-5 py-3.5 rounded-[14px] border border-white/[0.03] shadow-sm">
                <span className="font-bold text-white text-[14px]">
                  {totalMembers.toLocaleString("en-US")}
                </span>
                <span className="text-zinc-500 text-[12px] font-medium">Total Reach</span>
              </div>
              <div className="flex justify-between items-center bg-[#13141b]/95 px-5 py-3.5 rounded-[14px] border border-white/[0.03] shadow-sm">
                <span className="font-bold text-white text-[14px]">
                  {servers.filter((s) => s.manageable).length}
                </span>
                <span className="text-zinc-500 text-[12px] font-medium">Managed</span>
              </div>
              <div className="flex justify-between items-center bg-[#13141b]/95 px-5 py-3.5 rounded-[14px] border border-white/[0.03] shadow-sm">
                <span className="font-bold text-white text-[14px]">
                  {favorites.length}
                </span>
                <span className="text-zinc-500 text-[12px] font-medium">Favorites</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

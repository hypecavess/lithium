import { NextResponse } from "next/server";
import { auth } from "../../../auth";

interface DiscordUserGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: "DISCORD_BOT_TOKEN not configured" }, { status: 500 });
    }

    const userGuildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!userGuildsRes.ok) {
      const errText = await userGuildsRes.text();
      return NextResponse.json(
        { error: "Failed to fetch guilds from Discord", details: errText },
        { status: userGuildsRes.status }
      );
    }

    const userGuilds = (await userGuildsRes.json()) as DiscordUserGuild[];

    const adminGuilds = userGuilds.filter((guild) => {
      if (guild.owner) return true;
      if (!guild.permissions) return false;
      try {
        const perms = BigInt(guild.permissions);
        const adminPermission = BigInt(8);
        return (perms & adminPermission) === adminPermission;
      } catch (e) {
        return false;
      }
    });

    let botGuildIds = new Set<string>();
    try {
      const botGuildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      });

      if (botGuildsRes.ok) {
        const botGuilds = (await botGuildsRes.json()) as { id: string }[];
        if (Array.isArray(botGuilds)) {
          botGuildIds = new Set(botGuilds.map((g) => g.id));
        }
      }
    } catch (err) {
      console.error("Failed to fetch bot guilds:", err);
    }

    const gradients = [
      "from-blue-500 to-red-500",
      "from-cyan-400 to-purple-500",
      "from-yellow-400 to-orange-500",
      "from-blue-600 to-blue-800",
      "from-red-500 to-pink-500",
    ];

    const mappedGuilds = await Promise.all(
      adminGuilds.map(async (guild, index: number) => {
        let isBotInGuild = botGuildIds.has(guild.id);
        let membersCountText = "N/A";
        let manageable = false;
        let description = guild.features.includes("COMMUNITY") ? guild.name : null; // Default fallback if bot not present
        let boosts = 0;
        let boostTier = 0;
        let securityLevel = "None";
        let ownerId = guild.owner && session.user ? session.user.id : null;
        let bannerUrl: string | null = null;

        if (isBotInGuild) {
          manageable = true;
          try {
            const guildDetailsRes = await fetch(
              `https://discord.com/api/guilds/${guild.id}?with_counts=true`,
              {
                headers: {
                  Authorization: `Bot ${botToken}`,
                },
              }
            );

            if (guildDetailsRes.ok) {
              const details = await guildDetailsRes.json();
              if (details) {
                if (typeof details.approximate_member_count === "number") {
                  membersCountText = `${details.approximate_member_count}`;
                }
                description = details.description || description;
                boosts = details.premium_subscription_count || 0;
                boostTier = details.premium_tier || 0;
                ownerId = details.owner_id || ownerId;
                if (details.banner) {
                  bannerUrl = `https://cdn.discordapp.com/banners/${guild.id}/${details.banner}.png?size=1024`;
                }

                const secLevels = ["None", "Low", "Medium", "High", "Very High"];
                const levelIdx = details.verification_level;
                if (levelIdx >= 0 && levelIdx < secLevels.length) {
                  securityLevel = secLevels[levelIdx];
                }
              }
            }
          } catch (err) {
            console.error(`Failed to fetch counts for guild ${guild.id}:`, err);
          }
        }

        const iconUrl = guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
          : null;

        const gradient = gradients[index % gradients.length];

        let serverType = "Personal Server";
        if (guild.features && Array.isArray(guild.features)) {
          if (guild.features.includes("PARTNERED")) {
            serverType = "Partnered Server";
          } else if (guild.features.includes("COMMUNITY")) {
            serverType = "Community Server";
          }
        }

        let accessType = "Invite Only";
        if (guild.features && Array.isArray(guild.features)) {
          if (guild.features.includes("DISCOVERABLE")) {
            accessType = "Discoverable";
          } else if (guild.features.includes("MEMBER_VERIFICATION_GATE_ENABLED")) {
            accessType = "Apply to Join";
          }
        }

        let creationDateText = "N/A";
        try {
          const timestamp = Number((BigInt(guild.id) >> BigInt(22)) + BigInt(1420070400000));
          const creationDate = new Date(timestamp);
          creationDateText = creationDate.toLocaleDateString("en-US", { year: "numeric", month: "short" });
        } catch (e) {
        }

        return {
          id: guild.id,
          name: guild.name,
          iconUrl,
          bannerUrl,
          letter: guild.name.charAt(0).toUpperCase(),
          color: gradient,
          members: membersCountText === "N/A" ? "N/A" : `${membersCountText} Members`,
          manageable,
          desc: description,
          boosts,
          boostTier,
          securityLevel,
          ownerId,
          serverType,
          accessType,
          creationDateText,
          isOwner: guild.owner === true,
        };
      })
    );

    return NextResponse.json(mappedGuilds);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

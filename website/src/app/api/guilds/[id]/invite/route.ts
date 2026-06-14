import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";

interface DiscordUserGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

interface DiscordChannel {
  id: string;
  type: number;
  name: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: guildId } = await params;
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        { error: "DISCORD_BOT_TOKEN not configured" },
        { status: 500 }
      );
    }

    const userGuildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!userGuildsRes.ok) {
      return NextResponse.json({ error: "Failed to verify user permissions" }, { status: 400 });
    }

    const userGuilds = (await userGuildsRes.json()) as DiscordUserGuild[];
    const userGuild = userGuilds.find((g) => g.id === guildId);
    if (!userGuild) {
      return NextResponse.json({ error: "User is not a member of this guild" }, { status: 403 });
    }

    let isAdmin = userGuild.owner === true;
    if (!isAdmin && userGuild.permissions) {
      try {
        const perms = BigInt(userGuild.permissions);
        const adminPermission = BigInt(8);
        isAdmin = (perms & adminPermission) === adminPermission;
      } catch (e) {
      }
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "User is not an administrator of this guild" }, { status: 403 });
    }

    const channelsRes = await fetch(`https://discord.com/api/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (!channelsRes.ok) {
      return NextResponse.json({
        url: `https://discord.com/channels/${guildId}`,
        fallback: true
      });
    }

    const channels = (await channelsRes.json()) as DiscordChannel[];
    if (!Array.isArray(channels) || channels.length === 0) {
      return NextResponse.json({
        url: `https://discord.com/channels/${guildId}`,
        fallback: true
      });
    }

    const textChannel = channels.find((c) => c.type === 0);
    const targetChannel = textChannel || channels[0];

    if (!targetChannel || !targetChannel.id) {
      return NextResponse.json({
        url: `https://discord.com/channels/${guildId}`,
        fallback: true
      });
    }

    const inviteRes = await fetch(`https://discord.com/api/channels/${targetChannel.id}/invites`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        max_age: 86400,
        max_uses: 0,
        unique: false,
      }),
    });

    if (!inviteRes.ok) {
      return NextResponse.json({
        url: `https://discord.com/channels/${guildId}`,
        fallback: true
      });
    }

    const invite = await inviteRes.json();
    if (invite && invite.code) {
      return NextResponse.json({
        code: invite.code,
        url: `https://discord.gg/${invite.code}`,
        fallback: false
      });
    }

    return NextResponse.json({
      url: `https://discord.com/channels/${guildId}`,
      fallback: true
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

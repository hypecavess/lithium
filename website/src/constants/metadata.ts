import type { Metadata } from "next";

export const mainPage: Metadata = {
  title: "lithium: your best discord app",
  description: "lithium is a free and best discord bot",
  icons: {
    icon: "/assets/images/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "lithium: your best discord app",
  },
  twitter: {
    card: "summary_large_image",
    title: "lithium: your best discord app",
    description: "lithium is a free and best discord bot",
    images: [
      "/assets/images/logo.png",
    ],
  },
  openGraph: {
    title: "lithium: your best discord app",
    description: "lithium is a free and best discord bot",
    images: [
      "/assets/images/logo.png",
    ],
    url: "https://lithiums.vercel.app",
    siteName: "lithium",
    locale: "en_US",
    type: "website",
  },
  other: {
    "theme-color": "#000000",
  },
};

export const panelPage: Metadata = {
  title: "lithium: dashboard",
  description: "Manage your servers and account settings",
};

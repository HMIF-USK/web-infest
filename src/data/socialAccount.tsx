import { Instagram } from "@/app/icons/instagram";
import { Tiktok } from "@/app/icons/tiktok";
import { WhatsApp } from "@/app/icons/whatsApp";

export const socialAccounts = [
  {
    id: "whatsApp",
    iconComponent: (<WhatsApp />),
    url: "https://api.whatsapp.com/send?phone=6285269270159",
  },
  {
    id: "tiktok",
    iconComponent: <Tiktok width="24" height="24"/>,
    url: "https://www.tiktok.com/@hmif_usk",
  },
  {
    id: "instagram",
    iconComponent: <Instagram />,
    url: "https://www.instagram.com/infest_usk/",
  },
];
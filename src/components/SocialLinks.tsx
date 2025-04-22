import React from "react";
import {
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Globe,
} from "lucide-react";

const iconMap = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  website: Globe,
};

const SocialButtons = ({ social }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {social.map(({ type, url, label }) => {
        const Icon = iconMap[type];
        if (!Icon || !url) return null;

        return (
          <a
            key={type}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Icon size={18} />
            {label}
          </a>
        );
      })}
    </div>
  );
};

export default SocialButtons;

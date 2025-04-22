import { Share2 } from "lucide-react";
import React from "react"
import { RWebShare } from "react-web-share"

interface RWebShareProps {
    url: string;
    title: string;
    text: string;
}

export const ShareButton: React.FC<RWebShareProps> = (({ url, title, text }) => {
    return (
        <RWebShare data={{ text: text, url: url, title: title }} onClick={() => console.log("Share Successfully")}>
            <button className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 transition-all">
                <Share2 size={18} /> <p>Share</p>
            </button>
        </RWebShare>
    )
})
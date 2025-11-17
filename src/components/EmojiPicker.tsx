'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

const EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
  "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
  "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
  "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
  "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮",
  "🤧", "🥵", "🥶", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️",
  "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥",
  "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱",
  "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡",
  "👹", "👺", "👻", "👽", "👾", "🤖", "❤️", "🧡", "💛", "💚",
  "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓",
  "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️",
  "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊",
  "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔",
  "⚛️", "🉑", "☢️", "☣️", "📴", "📳", "🈶", "🈚", "🈸", "🈺"
];

export default function EmojiPicker({ onEmojiSelect }: { onEmojiSelect: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-white/5"
        >
          <Smile className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-[#1a1a1a] border-white/10 p-4">
        <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
          {EMOJIS.map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleEmojiClick(emoji)}
              className="text-2xl hover:bg-white/10 p-2 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { useGlobe } from "@/contexts/globe-context";
import { GlobeModal } from "./globe-modal";
import { motion } from "framer-motion";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isGlobeOpen, setIsGlobeOpen } = useGlobe();

  return (
    <div className="relative w-full h-[calc(100dvh-52px)] overflow-hidden">
      {/* Globe Panel */}
      <GlobeModal isOpen={isGlobeOpen} onClose={() => setIsGlobeOpen(false)} />

      {/* Main Content - Animated to shift when globe is open */}
      <motion.div
        className="absolute inset-0 h-full"
        animate={{
          left: isGlobeOpen ? "80%" : "0%",
          width: isGlobeOpen ? "20%" : "100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

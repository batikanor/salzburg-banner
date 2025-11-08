"use client";

import { Button } from "./ui/button";
import { GitIcon, GlobeIcon } from "./icons";
import { useGlobe } from "@/contexts/globe-context";
import { ModelSelector } from "./model-selector";
import Link from "next/link";

export const Navbar = () => {
  const { isGlobeOpen, setIsGlobeOpen } = useGlobe();

  return (
    <div className="p-2 flex flex-row gap-2 justify-between relative z-50">
      <Link href="https://github.com/batikanor/alpinesight">
        <Button variant="outline">
          <GitIcon /> View Source Code
        </Button>
      </Link>

      <div className="flex gap-2">
        <ModelSelector />
        <Button onClick={() => setIsGlobeOpen(!isGlobeOpen)}>
          <GlobeIcon size={16} />
          {isGlobeOpen ? "Hide Map" : "View Map"}
        </Button>
      </div>
    </div>
  );
};

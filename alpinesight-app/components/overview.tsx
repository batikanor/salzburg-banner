"use client";

import { motion } from "framer-motion";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="text-lg md:text-5xl">
          <span className="text-amber-800">Alpine</span>sight
        </p>
<<<<<<< HEAD
        <p>Get intelligent, data supported insgihts that help your business</p>
=======
        <p className="text-gray-300">some caption</p>
>>>>>>> f9dde9dde2edce0d4ec967287da7aee24afea4eb
      </div>
    </motion.div>
  );
};

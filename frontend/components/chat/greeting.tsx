import { motion } from "framer-motion";
import { UniVoiceIcon } from "./icons";

export const Greeting = () => (
  <div className="flex flex-col items-center px-4" key="overview">
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-gradient-to-b from-card to-muted/40 shadow-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <UniVoiceIcon className="text-foreground" size={22} />
    </motion.div>
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="text-center font-semibold text-2xl tracking-tight text-foreground md:text-3xl"
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      UniVoice Campus Outreach
    </motion.div>
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mt-2.5 max-w-md text-center text-muted-foreground/80 text-sm leading-relaxed"
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      Type a command to query student databases, review target outreach lists,
      and initiate voice campaigns.
    </motion.div>
  </div>
);

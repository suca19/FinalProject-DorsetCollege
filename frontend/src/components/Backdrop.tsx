import { useEffect } from "react";
import { motion } from "framer-motion";

import { ReactNode } from "react";

const Backdrop = ({ children, onClick }: { children: ReactNode, onClick: () => void }) => {
  // Log state
  useEffect(() => {
    console.log("Backdrop", true);
    return () => console.log("Backdrop", false);
  }, []);

  return (
    <motion.div
      className="backdrop"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
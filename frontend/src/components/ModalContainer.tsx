import { AnimatePresence, motion } from "framer-motion";

import { ReactNode } from "react";
import '../Modal.css';

 const ModalContainer = ({ children, label }: { children: ReactNode, label?: string }) => (
    // Enables the animation of components that have been removed from the tree
    <AnimatePresence
      // Disable any initial animations on children that
      // are present when the component is first rendered
      initial={false}
      // Only render one component at a time.
      // The exiting component will finish its exit
      // animation before entering component is rendered
      // exitBeforeEnter={true}
      // Fires when all exiting nodes have completed animating out
      onExitComplete={() => console.log(label)}
    >
      {children}
    </AnimatePresence>
  );
  export default ModalContainer;
import { useEffect } from "react";
import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import { ReactNode } from "react";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const flip = {
  hidden: {
    transform: "scale(0) rotateX(-360deg)",
    opacity: 0,
    transition: {
      delay: 0.3,
    },
  },
  visible: {
    transform: " scale(1) rotateX(0deg)",
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    transform: "scale(0) rotateX(360deg)",
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const newspaper = {
  hidden: {
    transform: "scale(0) rotate(720deg)",
    opacity: 0,
    transition: {
      delay: 0.3,
    },
  },
  visible: {
    transform: " scale(1) rotate(0deg)",
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    transform: "scale(0) rotate(-720deg)",
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};



const Modal = ({ children, handleClose, text, type }: { children: ReactNode, handleClose: () => void, text: string, type: string }) => {
  // Log state
  useEffect(() => {
    console.log("Modal", true);
    return () => console.log("Modal", false);
  }, []);

  return (
    <Backdrop onClick={handleClose}>
      {type === "dropIn" && (
        <motion.div
          onClick={(e) => e.stopPropagation()}  // Prevent click from closing modal
          className="modal orange-gradient"
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
            <div style={{background: 'white'}}>
            {children} 
            <ModalButton onClick={handleClose} label="Close" />
            </div>

        </motion.div>
      )}

      {type === "flip" && (
        <motion.div
          onClick={(e) => e.stopPropagation()}   
          className="modal  orange-gradient"
          variants={flip}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
           {/* <ModalText text={text} /> */}
          {children}
          <ModalButton onClick={handleClose} label="Close" />
        </motion.div>
      )}

    </Backdrop>
  );
};


const ModalButton = ({ onClick, label }: { onClick: () => void, label: string }) => (
  <motion.button
    className="modal-button"
    type="button"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {label}
  </motion.button>
);

export default Modal;
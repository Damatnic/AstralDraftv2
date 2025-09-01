import { motion } from &apos;framer-motion&apos;;

interface TouchFeedbackProps {
}
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;

}

export const TouchFeedback: React.FC<TouchFeedbackProps> = ({
}
  children,
  className = &apos;&apos;,
  disabled = false
}: any) => {
}
  return (
    <motion.div
      className={className}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  );
};
'use client'

import { Variants } from 'framer-motion'

// ============================================
// ANIMATION TOKENS - Consistent timing & easing
// ============================================

export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const

export const easings = {
  // Smooth, natural movement
  smooth: [0.4, 0, 0.2, 1],
  // Bouncy, playful
  bounce: [0.68, -0.55, 0.265, 1.55],
  // Subtle spring
  spring: [0.43, 0.13, 0.23, 0.96],
  // Quick start, slow end
  easeOut: [0, 0, 0.2, 1],
  // Slow start, quick end
  easeIn: [0.4, 0, 1, 1],
} as const

// ============================================
// REUSABLE MOTION VARIANTS
// ============================================

// Fade variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.smooth }
  },
  exit: { 
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.smooth }
  }
}

// Fade up (most common for content)
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: durations.slow, 
      ease: easings.smooth 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: durations.fast }
  }
}

// Fade down
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: durations.slow, ease: easings.smooth }
  }
}

// Fade left/right for page transitions
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: durations.slow, ease: easings.smooth }
  }
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: durations.slow, ease: easings.smooth }
  }
}

// Scale variants
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: durations.normal, 
      ease: easings.spring 
    }
  }
}

// Stagger container for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
}

// Stagger container (fast)
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    }
  }
}

// Stagger item
export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smooth
    }
  }
}

// Card hover effect
export const cardHover: Variants = {
  rest: { 
    scale: 1,
    y: 0,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
  },
  hover: { 
    scale: 1.02,
    y: -8,
    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    transition: {
      duration: durations.normal,
      ease: easings.smooth
    }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: durations.fast }
  }
}

// Image zoom effect for cards
export const imageZoom: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.08,
    transition: {
      duration: durations.slow,
      ease: easings.smooth
    }
  }
}

// Button press effect
export const buttonPress: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: durations.fast }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: durations.fast }
  }
}

// Slide in from bottom (for modals, sheets)
export const slideUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: "100%" 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smooth
    }
  },
  exit: { 
    opacity: 0, 
    y: "100%",
    transition: { duration: durations.normal }
  }
}

// Hero text stagger
export const heroTextContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
}

export const heroTextItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    filter: "blur(10px)"
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: durations.slower,
      ease: easings.smooth
    }
  }
}

// Counter animation for stats
export const counterVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

// Pulse animation for loading/attention
export const pulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Success checkmark animation
export const checkmarkPath: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0 
  },
  visible: { 
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: durations.slow,
      ease: easings.easeOut
    }
  }
}

// Page transition variants
export const pageTransition: Variants = {
  initial: { 
    opacity: 0,
    y: 20
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smooth
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: durations.fast,
      ease: easings.easeIn
    }
  }
}

// Navbar scroll effect
export const navbarScroll = {
  top: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    backdropFilter: "blur(0px)",
    borderBottomColor: "rgba(0, 0, 0, 0)"
  },
  scrolled: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    borderBottomColor: "rgba(0, 0, 0, 0.1)"
  }
}

// Floating animation for decorative elements
export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Shimmer loading effect
export const shimmer: Variants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// Tab switch animation
export const tabContent: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20,
    position: "absolute" as const
  },
  visible: { 
    opacity: 1, 
    x: 0,
    position: "relative" as const,
    transition: {
      duration: durations.normal,
      ease: easings.smooth
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    position: "absolute" as const,
    transition: {
      duration: durations.fast
    }
  }
}

// Price change animation
export const priceChange: Variants = {
  initial: { 
    scale: 1,
    color: "inherit"
  },
  changed: { 
    scale: [1, 1.2, 1],
    color: ["inherit", "#10b981", "inherit"],
    transition: {
      duration: 0.5
    }
  }
}

// Notification/toast animation
export const toast: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.9,
    transition: { duration: durations.fast }
  }
}

// Badge/tag pop animation
export const badgePop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 20
    }
  }
}

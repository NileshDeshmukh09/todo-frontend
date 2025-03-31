import { useState, useEffect, useCallback } from 'react';

export const useAnimation = (duration = 300) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = useCallback(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return {
    isAnimating,
    animate,
  };
};

export const useFadeIn = (duration = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const fadeOut = useCallback(() => {
    setOpacity(0);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return {
    isVisible,
    opacity,
    fadeOut,
  };
};

export const useSlideIn = (direction = 'up', duration = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  const [transform, setTransform] = useState('');

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setTransform('translate(0)');
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const slideOut = useCallback(() => {
    setTransform('');
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(20px)';
      case 'down':
        return 'translateY(-20px)';
      case 'left':
        return 'translateX(20px)';
      case 'right':
        return 'translateX(-20px)';
      default:
        return 'translateY(20px)';
    }
  };

  return {
    isVisible,
    transform: transform || getInitialTransform(),
    slideOut,
  };
};

export const useScaleIn = (duration = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setScale(1);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const scaleOut = useCallback(() => {
    setScale(0.8);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return {
    isVisible,
    scale,
    scaleOut,
  };
};

export const useRotateIn = (duration = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  const [rotate, setRotate] = useState(-180);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setRotate(0);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const rotateOut = useCallback(() => {
    setRotate(-180);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return {
    isVisible,
    rotate,
    rotateOut,
  };
};

export const useBounceIn = (duration = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  const [bounce, setBounce] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setBounce(1);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const bounceOut = useCallback(() => {
    setBounce(0);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return {
    isVisible,
    bounce,
    bounceOut,
  };
}; 
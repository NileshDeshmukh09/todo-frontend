import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const useBreakpoint = (breakpoint) => {
  const { width } = useWindowSize();
  return width >= breakpoint;
};

export const useResponsiveValue = (values) => {
  const { width } = useWindowSize();
  const breakpoints = Object.keys(values).map(Number).sort((a, b) => a - b);

  for (let i = breakpoints.length - 1; i >= 0; i--) {
    if (width >= breakpoints[i]) {
      return values[breakpoints[i]];
    }
  }

  return values[breakpoints[0]];
};

export const useIsMobile = () => {
  return useBreakpoint(640);
};

export const useIsTablet = () => {
  return useBreakpoint(768);
};

export const useIsDesktop = () => {
  return useBreakpoint(1024);
};

export const useIsLargeDesktop = () => {
  return useBreakpoint(1280);
};

export const useOrientation = () => {
  const { width, height } = useWindowSize();
  return width > height ? 'landscape' : 'portrait';
};

export const useDevicePixelRatio = () => {
  const [pixelRatio, setPixelRatio] = useState(
    typeof window !== 'undefined' ? window.devicePixelRatio : 1
  );

  useEffect(() => {
    const handleResize = () => {
      setPixelRatio(window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return pixelRatio;
};

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: typeof window !== 'undefined' ? window.pageXOffset : 0,
    y: typeof window !== 'undefined' ? window.pageYOffset : 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}; 
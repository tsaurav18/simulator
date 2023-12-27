import { useState, useEffect } from 'react';

export function useResponsive() {
    const [isTablet, setIsTablet] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQueryTablet = window.matchMedia(
            "(min-width: 481px) and (max-width: 1240px)" //1240
        );
        const mediaQueryMobile = window.matchMedia("(max-width: 480px)");

        setIsTablet(mediaQueryTablet.matches);
        setIsMobile(mediaQueryMobile.matches);

        const handleResizeTablet = (event) => {
            setIsTablet(event.matches);
        };
        const handleResizeMobile = (event) => {
            setIsMobile(event.matches);
        };

        mediaQueryTablet.addEventListener("change", handleResizeTablet);
        mediaQueryMobile.addEventListener("change", handleResizeMobile);
        return () => {
            mediaQueryTablet.removeEventListener("change", handleResizeTablet);
            mediaQueryMobile.removeEventListener("change", handleResizeMobile);
        };
    }, []);

    const responsiveValue = (desktop, tablet, mobile) => {
        if (isTablet) {
            return tablet;
        } else if (isMobile) {
            return mobile;
        } else {
            return desktop;
        }
    }

    return { isTablet, isMobile, deviceType: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop', responsiveValue };
}

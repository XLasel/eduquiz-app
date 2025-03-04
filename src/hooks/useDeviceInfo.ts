'use client';

import { useEffect, useState } from 'react';

type Device = 'mobile' | 'tablet' | 'desktop' | 'hd';

interface DeviceInfo {
  width: number;
  device: Device;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isHd: boolean;
  isWideScreen: boolean;
}

const deviceWidths: [Device, number][] = [
  ['mobile', 768],
  ['tablet', 1024],
  ['desktop', 1440],
  ['hd', Infinity],
];

const findDevice = (deviceWidth: number): Device =>
  deviceWidths.find(([_, width]) => deviceWidth < width)?.[0] as Device;

export const useDeviceInfo = (): DeviceInfo => {
  const [state, setState] = useState<DeviceInfo>({
    width: 0,
    device: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isHd: false,
    isWideScreen: true,
  });

  useEffect(() => {
    const updateState = () => {
      const width = window.innerWidth;
      const device = findDevice(width);
      setState({
        width,
        device,
        isMobile: device === 'mobile',
        isTablet: device === 'tablet',
        isDesktop: device === 'desktop',
        isHd: device === 'hd',
        isWideScreen: device === 'desktop' || device === 'hd',
      });
    };

    updateState();

    window.addEventListener('resize', updateState);

    return () => {
      window.removeEventListener('resize', updateState);
    };
  }, []);

  return state;
};

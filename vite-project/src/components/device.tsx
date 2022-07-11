import { useState, useEffect } from 'react';

const useDevice = (adapter: GPUAdapter | null | undefined) => {
  const [device, setDevice] = useState<GPUDevice | null>();
  useEffect(() => {
    adapter
      ?.requestDevice({
        requiredFeatures: ['texture-compression-etc2'],
        requiredLimits: {
          maxStorageBufferBindingSize:
            adapter.limits.maxStorageBufferBindingSize,
        },
      })
      .then((item) => {
        console.log('i', item);
        setDevice(item);
      });
  }, [adapter]);
  return device;
};
/**
 * webgpu初始化
 * @returns
 */
export const useWebGpu = () => {
  const [adapter, setAdapter] = useState<GPUAdapter | null>();
  const device = useDevice(adapter);
  useEffect(() => {
    if (navigator.gpu !== undefined) {
      console.log('>>>>>> adapter loaded.');
      navigator.gpu
        .requestAdapter({ powerPreference: 'high-performance' })
        .then((item) => {
          setAdapter(item);
        });
    }
  }, [navigator.gpu]);
  return {
    adapter,
    device,
  };
};

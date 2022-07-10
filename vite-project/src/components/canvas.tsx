import { useRef, useMemo, useEffect } from 'react';

/**
 *  获取浏览器默认颜色配置
 * @returns
 */
const useDefaultColorFormat = () => {
  const format = useRef<GPUTextureFormat>('rgba8unorm');
  if (navigator.gpu) {
    format.current = navigator.gpu?.getPreferredCanvasFormat();
  }
  return format;
};

/**
 *  配置画布
 * @param device
 * @param options
 * @returns
 */
export const useCanvas = (
  device: GPUDevice | null | undefined,
  options?: {
    width: number;
    height: number;
  },
) => {
  const canvasRef = useRef<any>(null);
  const format = useDefaultColorFormat();
  const dom = useMemo(
    () => (
      <canvas
        ref={canvasRef.current}
        width={options?.width || 700}
        height={options?.height || 700}
      />
    ),
    [options],
  );

  useEffect(() => {
    if (device && canvasRef.current) {
      const ctx: GPUCanvasContext = canvasRef.current.getContext('webgpu');
      ctx.configure({
        device,
        format: format.current,
      });
    }
  }, [device]);
  return {
    dom,
  };
};

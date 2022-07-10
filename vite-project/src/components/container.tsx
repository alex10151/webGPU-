import { useCanvas } from './canvas';
import { useWebGpu } from './device';

/**
 *  容器
 * @returns
 */
const Container = () => {
  const { device } = useWebGpu();
  const { dom: canvas } = useCanvas(device);
  return canvas;
};

export default Container;

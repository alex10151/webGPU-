import { useEffect } from 'react';
import { useCanvas } from './canvas';
import { useWebGpu } from './device';
import { usePipeline } from './pipeline';

/**
 *  录制命令
 * @param device
 * @param context
 * @param pipeline
 */
const useCommandsEffect = (
  device: GPUDevice | null | undefined,
  context: GPUCanvasContext | undefined,
  pipeline: GPURenderPipeline | undefined,
) => {
  useEffect(() => {
    if (device && context && pipeline) {
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            clearValue: { a: 1, r: 0, g: 0, b: 0 },
            storeOp: 'store',
          },
        ],
      });
      pass.setPipeline(pipeline);
      pass.draw(3); // 使用多少个线程运行vertexshader，这里与数量一致（会并行运行3次）
      pass.end();
      const commandBuffer = encoder.finish();
      device.queue.submit([commandBuffer]);
    }
  }, [device, context, pipeline]);
};

/**
 *  容器
 * @returns
 */
const Container = () => {
  const { device } = useWebGpu();
  const { dom: canvas, context } = useCanvas(device);
  const pipeline = usePipeline(device);
  useCommandsEffect(device, context, pipeline);
  return canvas;
};

export default Container;

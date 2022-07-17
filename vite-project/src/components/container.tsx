import { useEffect, useMemo } from 'react';
import { useCanvas } from './canvas';
import { useWebGpu } from './device';
import { usePipeline, useGroup } from './pipeline';

/**
 *  录制命令
 * @param device
 * @param context
 * @param pipeline
 */
const useCommandsEffect = (options: {
  device: GPUDevice | null | undefined;
  context: GPUCanvasContext | undefined;
  pipeline: GPURenderPipeline | undefined;
  vertexBuffer: GPUBuffer | undefined;
  group: GPUBindGroup | undefined | null;
}) => {
  useEffect(() => {
    const { device, context, pipeline, vertexBuffer, group } = options;
    if (device && context && pipeline && vertexBuffer && group) {
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
      pass.setVertexBuffer(0, vertexBuffer);
      pass.setBindGroup(0, group);
      pass.draw(3); // 使用多少个线程运行vertexshader，这里与数量一致（会并行运行3次）
      pass.end();
      const commandBuffer = encoder.finish();
      device.queue.submit([commandBuffer]);
    }
  }, [options]);
};

/**
 *  容器
 * @returns
 */
const Container = () => {
  const { device } = useWebGpu();
  const { dom: canvas, context } = useCanvas(device);
  const { pipeline, vertexBuffer, colorBuffer } = usePipeline(device);
  const groupConf = useMemo(() => {
    if (colorBuffer && device && pipeline) {
      return {
        groupDataEntries: [{ binding: 0, resource:{buffer: colorBuffer} }],
        device,
        pipeline,
      };
    }
    return undefined;
  }, [device, pipeline, colorBuffer]);
  const group = useGroup(groupConf);
  useCommandsEffect({ device, context, pipeline, vertexBuffer, group });
  return canvas;
};

export default Container;

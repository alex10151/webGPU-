import vertex from '../wgsl/triangle.vert.wgsl?raw';
import frag from '../wgsl/red.frag.wgsl?raw';
import { useDefaultColorFormat } from './canvas';
import { useEffect, useState } from 'react';

/**
 *  初始化管线
 * @param device
 */
export const usePipeline = (device?: GPUDevice | null) => {
  const format = useDefaultColorFormat();
  const [pipeline, setPipeline] = useState<GPURenderPipeline>();
  useEffect(() => {
    if (device) {
      const vertexShader = device.createShaderModule({
        code: vertex,
      });
      const fragShader = device.createShaderModule({
        code: frag,
      });
      device
        .createRenderPipelineAsync({
          vertex: {
            entryPoint: 'main',
            module: vertexShader,
          },
          layout: 'auto',
          fragment: {
            entryPoint: 'main',
            module: fragShader,
            targets: [{ format: format.current }], // 设置着色后的格式，要与canvas一致才能正确显示
          },
          primitive: {
            topology: 'triangle-list',
          },
        })
        .then((pipeline) => setPipeline(pipeline));
    }
  }, [device]);
  return pipeline;
};

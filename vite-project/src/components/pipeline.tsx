import vertex from '@/wgsl/triangle.vert.wgsl?raw';
import frag from '@/wgsl/red.frag.wgsl?raw';

/**
 *  初始化管线
 * @param device
 */
export const usePipeline = (device: GPUDevice) => {
  const vertexShader = device.createShaderModule({
    code: vertex,
  });
  const fragShader = device.createShaderModule({
    code: frag,
  });
//   device.createRenderPipelineAsync();
};

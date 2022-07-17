import vertex from '../wgsl/triangle.vert.wgsl?raw';
import frag from '../wgsl/red.frag.wgsl?raw';
import { useDefaultColorFormat } from './canvas';
import { useEffect, useMemo, useState } from 'react';
/**
 *  buffer
 * UNIFORM : 最大64kb
 * STORAGE : 最大2gb
 * @param initNumberArr
 * @param device
 * @returns
 */
const useBuffers = (config: {
  init: number[];
  position?: number;
  device?: GPUDevice | null;
  usage?: number;
}) => {
  const { init, device, position, usage = GPUBufferUsage.UNIFORM } = config;
  const [buf, setBuf] = useState<GPUBuffer>();
  const data = new Float32Array(init);
  useEffect(() => {
    if (device) {
      const buffer = device.createBuffer({
        size: data.byteLength,
        usage: usage,
      });
      setBuf(buffer);
      device.queue.writeBuffer(buffer, position || 0, data);
    }
  }, [device]);
  return buf;
};
/**
 *  数据的存储的大小，bytes
 */
const useDefaultStride = () => {
  return 3 * 4;
};

/**
 *  初始化管线
 * @param device
 */
export const usePipeline = (device?: GPUDevice | null) => {
  const format = useDefaultColorFormat();
  const defaultStride = useDefaultStride();
  const [pipeline, setPipeline] = useState<GPURenderPipeline>();

  // 顶点slot的buffer
  const vertexBuffer = useBuffers({
    init: [0.0, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0],
    position: 0,
    device,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
  });
  // 颜色的buffer，外面binding用
  const colorBuffer = useBuffers({
    init: [1, 0, 0, 1],
    position: 0,
    device,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
  });
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
            buffers: [
              {
                arrayStride: defaultStride,
                attributes: [
                  { format: 'float32x3', shaderLocation: 0, offset: 0 },
                ],
              },
            ],
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
  return { pipeline, vertexBuffer, colorBuffer };
};

/**
 *  group使用
 * @param config
 * @returns
 */
export const useGroup = (config?: {
  groupDataEntries: GPUBindGroupEntry[] | null | undefined;
  device: GPUDevice | null;
  pipeline: GPURenderPipeline | null;
}) => {
  const group = useMemo(() => {
    if (config) {
      const { groupDataEntries, device, pipeline } = config;
      if (device && pipeline && groupDataEntries) {
        return device.createBindGroup({
          entries: groupDataEntries,
          layout: pipeline.getBindGroupLayout(0),
        });
      }
    }
    return null;
  }, [config]);
  return group;
};

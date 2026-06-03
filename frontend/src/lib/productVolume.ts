export const PRODUCT_VOLUME_RATE_PER_ML = 80;
export const PRODUCT_VOLUME_OPTIONS = [5, 10, 20] as const;
export const DEFAULT_PRODUCT_VOLUME_ML = PRODUCT_VOLUME_OPTIONS[0];

export type ProductVolumeMl = (typeof PRODUCT_VOLUME_OPTIONS)[number];

export function getVolumePrice(volumeMl: number) {
  return volumeMl * PRODUCT_VOLUME_RATE_PER_ML;
}

export function formatVolume(volumeMl: number) {
  return `${volumeMl} ml`;
}

export function getVolumeCartValue(volumeMl: number) {
  return `${volumeMl}ml`;
}


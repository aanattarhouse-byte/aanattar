export const PRODUCT_VOLUME_OPTIONS = [5, 10, 15] as const;
export const DEFAULT_PRODUCT_VOLUME_ML = PRODUCT_VOLUME_OPTIONS[0];

export type ProductVolumeMl = (typeof PRODUCT_VOLUME_OPTIONS)[number];

export function getVolumePrice(volumeMl: number, pricePerMl: number) {
  return volumeMl * pricePerMl;
}

export function formatVolume(volumeMl: number) {
  return `${volumeMl} ml`;
}

export function getVolumeCartValue(volumeMl: number) {
  return `${volumeMl}ml`;
}

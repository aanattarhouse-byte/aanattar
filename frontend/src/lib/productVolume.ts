export const PRODUCT_VOLUME_OPTIONS = [10, 15] as const;
export const DEFAULT_PRODUCT_VOLUME_ML = PRODUCT_VOLUME_OPTIONS[0];

export type ProductVolumeMl = (typeof PRODUCT_VOLUME_OPTIONS)[number];
const FIFTEEN_ML_UPGRADE_PRICE = 160;

export function getVolumePrice(volumeMl: number, pricePerMl: number) {
  if (volumeMl === 15) {
    return pricePerMl * 10 + FIFTEEN_ML_UPGRADE_PRICE;
  }

  return volumeMl * pricePerMl;
}

export function formatVolume(volumeMl: number) {
  return `${volumeMl} ml`;
}

export function getVolumeCartValue(volumeMl: number) {
  return `${volumeMl}ml`;
}

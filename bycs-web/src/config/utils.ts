import { SHIPPING_METHODS } from "@/constants/common";

export function isDevelopmentEnvironment(): boolean {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'local'
}

export function getShippingCharge(shippingMethod: string): string {
  const insideDhakaCharge = parseFloat(
    process.env.NEXT_PUBLIC_INSIDE_DHAKA_SHIPPING_CHARGE || '0'
  );
  const outsideDhakaCharge = parseFloat(
    process.env.NEXT_PUBLIC_OUTSIDE_DHAKA_SHIPPING_CHARGE || '0'
  );

  if (shippingMethod === SHIPPING_METHODS.INSIDE_DHAKA) {
    return insideDhakaCharge.toFixed(2);
  } else {
    return outsideDhakaCharge.toFixed(2);
  }
}

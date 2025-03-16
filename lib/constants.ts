export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Inkerman";
export const APP_SLOGAN =
  process.env.NEXT_PUBLIC_APP_SLOGAN || "Spend less, save more";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "E-commerce website for the best products. We have a wide selection of the best products in the world. From clothing to electronics, we have it all. Shop now and get the best products for the best price.";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9);

export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE || 35
)
/**
 * MOBILIX ONLINE STOREFRONT — WHATSAPP INQUIRY URL GENERATOR
 *
 * Catalog-Only Architecture:
 * - No shopping cart, no checkout, no payment gateway.
 * - Customer transactions and inquiries are completed directly with sales staff via WhatsApp.
 * - Dynamically formats and safely URI-encodes the structured Arabic inquiry message.
 */

export interface WhatsAppInquiryParams {
  productName: string;
  price: number;
  productUrl?: string;
  variantDescription?: string;
  businessNumber?: string;
}

/**
 * Validates and cleans a phone number string (digits only, e.g., 201012345678).
 */
export function sanitizeWhatsAppNumber(rawNumber?: string): string {
  const defaultNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201097976407';
  let target = (rawNumber || defaultNumber).replace(/\D/g, '');
  if (target.startsWith('01') && target.length === 11) {
    target = '2' + target;
  }
  return target;
}

/**
 * Builds a direct `https://wa.me/{number}?text={encodedText}` URL for product inquiry.
 */
export function buildWhatsAppInquiryUrl(params: WhatsAppInquiryParams): string {
  const {
    productName,
    price,
    productUrl,
    variantDescription,
    businessNumber,
  } = params;

  const cleanNumber = sanitizeWhatsAppNumber(businessNumber);

  // Construct structured Arabic customer inquiry message
  let message = `مرحبًا، أريد الاستفسار عن المنتج: ${productName}`;

  if (variantDescription) {
    message += ` (${variantDescription})`;
  }

  const formattedPrice = `${price.toLocaleString('en-US')} ج.م`;
  message += `، السعر المعروض: ${formattedPrice}`;

  if (productUrl) {
    message += `، رابط المنتج: ${productUrl}`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

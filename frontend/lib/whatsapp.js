export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94750519450';
export const WHATSAPP_DISPLAY = '0750519450';

function buildLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generalOrderLink() {
  return buildLink('Hello, I would like to place an order for seafood.');
}

export function productOrderLink({ name, localName, quantity, district }) {
  const label = localName ? `${name} / ${localName}` : name;
  let msg = `Hello, I would like to order ${quantity} ${label}.`;
  if (district) msg += `\nDelivery District: ${district}`;
  return buildLink(msg);
}

export function fullOrderLink({ items, district, customerName, address }) {
  const lines = [
    'Hello, I would like to place an order.',
    '',
    ...items.map(
      (item) => `Product: ${item.name}${item.localName ? ' / ' + item.localName : ''}\nQuantity: ${item.quantity}${item.unit || 'kg'}`
    ),
    '',
    `District: ${district || 'Puttalam'}`,
    customerName ? `Customer Name: ${customerName}` : null,
    address ? `Delivery Address: ${address}` : null,
    '',
    'Please confirm availability and total price.',
  ].filter(Boolean);
  return buildLink(lines.join('\n'));
}

export function inquiryLink({ name, phone, district, message }) {
  const msg = [
    'Hello, I have an inquiry:',
    name ? `Name: ${name}` : null,
    phone ? `Phone: ${phone}` : null,
    district ? `District: ${district}` : null,
    message ? `Message: ${message}` : null,
  ]
    .filter(Boolean)
    .join('\n');
  return buildLink(msg);
}

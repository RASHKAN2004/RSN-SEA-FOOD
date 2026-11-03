function getSriLankaDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function isValidDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function getPriceForDate(product, dateKey = getSriLankaDate()) {
  return (product.priceHistory || [])
    .filter(
      (entry) =>
        entry.effectiveDate <= dateKey && Number.isFinite(Number(entry.price)),
    )
    .sort((left, right) => right.effectiveDate.localeCompare(left.effectiveDate))[0]
    ?.price ?? product.price;
}

module.exports = { getSriLankaDate, isValidDateKey, getPriceForDate };

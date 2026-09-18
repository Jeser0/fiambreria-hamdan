export const business = {
  name: "Fiambrería Hamdan",
  since: 1992,
  siteUrl: "https://fiambreriahamdan.com",
  address: "Av. Colón 340",
  city: "San Miguel de Tucumán",
  province: "Tucumán",
  countryCode: "AR",
  phoneDisplay: "+54 381 255 0960",
  phoneHref: "tel:+543812550960",
  whatsappDisplay: "381 351 4449",
  whatsappNumber: "543813514449",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+Col%C3%B3n+340%2C+San+Miguel+de+Tucum%C3%A1n",
  hours: {
    daysShort: "Lun–Sáb",
    firstShift: "09:00–13:30",
    secondShift: "18:00–21:30",
  },
} as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${business.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

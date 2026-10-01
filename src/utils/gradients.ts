/**
 * Función centralizada para controlar los porcentajes y opacidad de degradados en toda la web.
 * @param solidCoveragePercentage - Porcentaje inicial de cobertura sólida (ej: 40 = 40%)
 * @param fadeEndPercentage - Porcentaje donde el degradado se vuelve 100% transparente (ej: 85 = 85%)
 * @param colorBase - Color base en formato HEX (ej: "#07162c" o "#ffffff")
 * @param direction - Dirección del degradado (ej: 'to right' o 'to bottom')
 */
export function calculateGradient(
  solidCoveragePercentage = 40,
  fadeEndPercentage = 85,
  colorBase = "#07162c",
  direction = "to right"
) {
  const midPoint = Math.round((solidCoveragePercentage + fadeEndPercentage) / 2);
  
  // Convertir HEX a RGB para poder aplicar opacidad
  let r = 0, g = 0, b = 0;
  if (colorBase.length === 7) {
    r = parseInt(colorBase.slice(1, 3), 16);
    g = parseInt(colorBase.slice(3, 5), 16);
    b = parseInt(colorBase.slice(5, 7), 16);
  }

  const rgbaMid = `rgba(${r}, ${g}, ${b}, 0.85)`;
  const rgbaTransparent = `rgba(${r}, ${g}, ${b}, 0)`;

  return `linear-gradient(${direction}, ${colorBase} 0%, ${colorBase} ${solidCoveragePercentage}%, ${rgbaMid} ${midPoint}%, ${rgbaTransparent} ${fadeEndPercentage}%)`;
}

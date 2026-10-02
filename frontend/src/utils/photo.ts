/**
 * Procesado de la foto de perfil.
 *
 * La foto se guarda dentro del CV como data URL, y el CV vive en localStorage
 * (cuota ~5MB). Por eso nunca se guarda el archivo original: se recorta a un
 * cuadrado y se re-comprime a JPEG chico, que además es lo único que las
 * plantillas necesitan (siempre se muestra en un círculo).
 */

/** Lado del cuadrado final, en píxeles. 400 alcanza para imprimir el círculo del CV. */
const OUTPUT_SIZE = 400;
const JPEG_QUALITY = 0.82;
/** Tope del archivo de entrada. Sirve para no colgar el navegador con un RAW de 40MB. */
const MAX_INPUT_BYTES = 12 * 1024 * 1024;

export class PhotoError extends Error {}

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new PhotoError("No se pudo leer la imagen. Probá con otro archivo."));
    };
    img.src = url;
  });

/**
 * Convierte el archivo elegido en un data URL cuadrado listo para el PDF.
 * Recorta centrado (el mismo encuadre que verá el usuario en el círculo).
 */
export const fileToSquareDataUrl = async (file: File): Promise<string> => {
  if (!file.type.startsWith("image/")) {
    throw new PhotoError("El archivo tiene que ser una imagen (JPG o PNG).");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new PhotoError("La imagen es muy pesada. Subí una de menos de 12 MB.");
  }

  const img = await loadImage(file);
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  if (!side) throw new PhotoError("La imagen está vacía o dañada.");

  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new PhotoError("Tu navegador no pudo procesar la imagen.");

  // Fondo blanco: los PNG con transparencia quedarían negros al pasar a JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  ctx.drawImage(
    img,
    (img.naturalWidth - side) / 2,
    (img.naturalHeight - side) / 2,
    side,
    side,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE
  );

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
};

/** Iniciales para el placeholder cuando todavía no hay foto. */
export const getIniciales = (nombre: string): string =>
  nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase() ?? "")
    .join("");

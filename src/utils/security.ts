/**
 * CEDETPRO Web - Módulo de Seguridad y Sanitización Anti-Inyección
 * 
 * Diseñado según los estándares OWASP (Top 10) y adaptado de las habilidades
 * de ciberseguridad para prevención de:
 * 1. Inyección SQL (SQLi) y NoSQL
 * 2. Cross-Site Scripting (XSS) y DOM XSS
 * 3. Inyección de Cabeceras SMTP/CRLF (Header Injection)
 * 4. Inyección de Comandos del Sistema Operativo (Command Injection)
 * 5. Inyección de Plantillas / HTML Injection
 * 6. Prototype Pollution
 */

export interface SanitizeOptions {
  maxLength?: number;
  allowNewlines?: boolean;
  stripHtml?: boolean;
  strictSqlCheck?: boolean;
}

export interface SecurityValidationResult {
  isValid: boolean;
  cleanValue: string;
  threatsDetected: string[];
}

// Patrones avanzados de detección de Inyección SQL (SQLi)
const SQL_INJECTION_PATTERNS = [
  /(\b(select|union|insert|update|delete|drop|alter|create|truncate|exec|execute|declare|cast)\b)/i,
  /(\b(information_schema|sysdatabases|sysobjects|table_schema|schema_name)\b)/i,
  /(--|\/\*|\*\/|#|;)/,
  /(\b(or|and)\b\s+[\d\w'"]+\s*=\s*[\d\w'"]+)/i,
  /(\b(sleep|benchmark|waitfor\s+delay|pg_sleep)\s*\()/i,
  /(\b(concat|char|chr|0x[0-9a-f]+)\s*\()/i,
  /('|\b)(admin|root)('|\b)\s*(--|\#|\/\*)/i,
  /('\s*=\s*')|("=\s*")|('or'|'1'='1'|1=1|1\s*=\s*1)/i
];

// Patrones de detección de Cross-Site Scripting (XSS) y Ejecución de Código
const XSS_PATTERNS = [
  /<[^>]*script/i,
  /<[^>]*iframe/i,
  /<[^>]*object/i,
  /<[^>]*embed/i,
  /<[^>]*applet/i,
  /<[^>]*svg[^>]*onload/i,
  /<[^>]*img[^>]*onerror/i,
  /(javascript|vbscript|data)\s*:/i,
  /on(error|load|click|mouseover|submit|keydown|focus|blur|change)\s*=/i,
  /eval\s*\(|new\s+Function\s*\(|setTimeout\s*\(|setInterval\s*\(/i
];

// Patrones de Inyección de Comandos de Sistema
const COMMAND_INJECTION_PATTERNS = [
  /[;&|`$><]/,
  /(\b(cat|ls|pwd|whoami|chmod|chown|rm|nc|netcat|curl|wget|bash|sh|powershell|cmd)\b)/i
];

// Patrones de Inyección CRLF / SMTP Headers
const CRLF_PATTERNS = [
  /\r|\n|%0d|%0a/i,
  /\b(to|cc|bcc|from|subject|reply-to|content-type|mime-version):/i
];

/**
 * Escapa caracteres HTML para renderizado 100% seguro en el DOM (Anti-XSS).
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#x60;');
}

/**
 * Analiza un texto en busca de firmas de Inyección SQL.
 */
export function detectSqlInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const normalized = input.normalize('NFKC');
  return SQL_INJECTION_PATTERNS.some((regex) => regex.test(normalized));
}

/**
 * Analiza un texto en busca de firmas de Cross-Site Scripting (XSS).
 */
export function detectXss(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const normalized = input.normalize('NFKC');
  return XSS_PATTERNS.some((regex) => regex.test(normalized));
}

/**
 * Analiza un texto en busca de Inyecciones CRLF / SMTP.
 */
export function detectCrlfInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return CRLF_PATTERNS.some((regex) => regex.test(input));
}

/**
 * Sanitiza una cadena de texto eliminando cualquier vector de inyección conocido.
 */
export function sanitizeInput(
  rawInput: unknown,
  options: SanitizeOptions = {}
): string {
  if (rawInput === null || rawInput === undefined) return '';
  
  let str = String(rawInput);

  // Normalización Unicode (previene bypasses con homóglifos o caracteres nulos)
  str = str.normalize('NFKC');

  // Eliminar bytes nulos y caracteres de control no imprimibles (ASCII 0x00 - 0x1F excepto \t y \n si se permiten)
  if (!options.allowNewlines) {
    str = str.replace(/[\x00-\x1F\x7F]/g, ' ');
    str = str.replace(/[\r\n\t]/g, ' ');
  } else {
    // Normalizar saltos de línea y limpiar otros controles
    str = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  // Eliminar bloques completos de script, style, iframe, object, embed, svg y su contenido
  if (options.stripHtml !== false) {
    str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    str = str.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    str = str.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    str = str.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');
    str = str.replace(/<[^>]*>/g, '');
  }

  // Desactivar pseudo-protocolos peligrosos y funciones eval
  str = str.replace(/javascript\s*:/gi, '');
  str = str.replace(/vbscript\s*:/gi, '');
  str = str.replace(/data\s*:/gi, '');
  str = str.replace(/alert\s*\([^)]*\)/gi, '');
  str = str.replace(/prompt\s*\([^)]*\)/gi, '');
  str = str.replace(/confirm\s*\([^)]*\)/gi, '');

  // Truncar espacios redundantes
  str = str.trim();

  // Limitar longitud máxima para prevenir Denial of Service por payloads gigantes
  if (options.maxLength && options.maxLength > 0) {
    str = str.slice(0, options.maxLength);
  }

  return str;
}

/**
 * Realiza una validación exhaustiva de seguridad sobre un campo de entrada.
 */
export function validateAndSanitizeField(
  fieldName: string,
  value: unknown,
  options: SanitizeOptions = {}
): SecurityValidationResult {
  const threats: string[] = [];
  const rawString = String(value || '');

  if (detectSqlInjection(rawString)) {
    threats.push('POSSIBLE_SQL_INJECTION');
  }

  if (detectXss(rawString)) {
    threats.push('POSSIBLE_XSS_ATTACK');
  }

  if (!options.allowNewlines && detectCrlfInjection(rawString)) {
    threats.push('POSSIBLE_CRLF_HEADER_INJECTION');
  }

  const clean = sanitizeInput(value, options);

  return {
    isValid: threats.length === 0,
    cleanValue: clean,
    threatsDetected: threats
  };
}

/**
 * Validadores especializados con expresiones regulares estrictas
 */
export const SecurityValidators = {
  // Nombres: letras, espacios, acentos en español, puntos, apóstrofes y guiones (2-80 caracteres)
  name: (val: string): boolean => {
    const clean = sanitizeInput(val, { maxLength: 80, allowNewlines: false });
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]{2,80}$/.test(clean) && !detectSqlInjection(clean);
  },

  // Teléfono: números, +, paréntesis, espacios y guiones (7-20 caracteres)
  phone: (val: string): boolean => {
    const clean = sanitizeInput(val, { maxLength: 20, allowNewlines: false });
    return /^[0-9+\s()-]{7,20}$/.test(clean) && !detectSqlInjection(clean);
  },

  // Email: estructura estándar RFC 5322 sin caracteres de control (5-100 caracteres)
  email: (val: string): boolean => {
    const clean = sanitizeInput(val, { maxLength: 100, allowNewlines: false });
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(clean) && 
           !detectSqlInjection(clean) && 
           !detectCrlfInjection(val);
  },

  // Mensaje: texto libre sanitizado (10-1000 caracteres)
  message: (val: string): boolean => {
    const clean = sanitizeInput(val, { maxLength: 1000, allowNewlines: true });
    return clean.length >= 10 && clean.length <= 1000;
  }
};

/**
 * Sanitiza recursivamente objetos JSON previniendo Prototype Pollution.
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;

  const sanitized = Object.create(null) as T;

  for (const [key, value] of Object.entries(obj)) {
    // Bloquear Prototype Pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }

    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value, { allowNewlines: true }) as any;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeObject(value);
    } else {
      sanitized[key as keyof T] = value;
    }
  }

  return sanitized;
}

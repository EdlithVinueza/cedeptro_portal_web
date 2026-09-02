# Cedepro Ecuador (Web Oficial 2.0)

Sitio web oficial de **Cedepro Ecuador** reconstruido desde cero con **Astro v5**, **Tailwind CSS** y generación estática pura (SSG). 

Esta arquitectura elimina por completo el servidor PHP/WordPress y cualquier base de datos expuesta, logrando **100% de inmunidad contra inyecciones de código malicioso**, carga ultra rápida (< 1 segundo) y máxima puntuación de SEO en Google.

---

##  Inicio Rápido en Local

```bash
# 1. Entrar al proyecto
cd cedepro-web

# 2. Iniciar servidor de desarrollo local
npm run dev

# 3. Compilar para producción (carpeta dist/)
npm run build

# 4. Previsualizar la compilación de producción localmente
npm run preview
```

El servidor local estará disponible en: `http://localhost:4321/`

---

##  Estructura de las 5 Páginas

1. **`/` (Inicio):** Hero institucional, 3 pilares de servicio, sección «Somos Excelencia», Misión, grid de logos de instituciones aliadas y CTAs.
2. **`/sobre-nosotros`:** Identidad, historia, filosofía (*«No seguimos tendencias, las creamos»*) y liderazgo de J. Pablo Morales.
3. **`/portafolio`:** Servicios especializados (Diseño curricular, Acreditación CACES/CES, Consultoría de gestión y Formación continua).
4. **`/politicas-objetivos`:** Declaración de Política de Calidad institucional y 4 objetivos estratégicos.
5. **`/contacto`:** Formulario validado con honeypot anti-spam, canales de contacto oficiales y WhatsApp directo.

### Integraciones Externas
* **Cotizador Inteligente:** Enlazado al calculador oficial en Vercel (`https://calculadora-cedepro.vercel.app/`).
* **Botón Flotante de WhatsApp:** Conectado directamente a la línea oficial `+593 98 286 7413`.

---

##  Guía de Despliegue

### Opción A: Despliegue en Hostinger (Reemplazando WordPress)
1. En tu panel de Hostinger (hPanel), entra al **Administrador de Archivos** de `cedeproec.com`.
2. Ve a la carpeta `public_html/`.
3. **Elimina todos los archivos y carpetas anteriores de WordPress** (`wp-admin`, `wp-content`, `wp-includes`, `index.php`, `.htaccess`, etc.) para purgar definitivamente cualquier archivo infectado.
4. En tu computadora, compila el proyecto ejecutando:
   ```bash
   npm run build
   ```
5. Sube todo el contenido interior de la carpeta `dist/` a la raíz de `public_html/` en Hostinger.
6. ¡Listo! Tu sitio estará en vivo sin PHP ni base de datos, 100% seguro.



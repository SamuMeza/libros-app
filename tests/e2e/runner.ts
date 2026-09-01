/**
 * Helper de automatización E2E basado en Bun.WebView.
 * Proporciona utilidades para simular navegación y evaluar flujos en el entorno Bun.
 */

export interface E2EHelperOptions {
  baseURL?: string;
}

export class E2ERunner {
  private baseURL: string;

  constructor(options: E2EHelperOptions = {}) {
    this.baseURL = options.baseURL || process.env.TEST_BASE_URL || 'http://localhost:3000';
  }

  /**
   * Ejecuta una prueba de interacción evaluando la disponibilidad y estructura de una ruta.
   */
  async navigate(path: string): Promise<{ url: string; status: number; ok: boolean }> {
    const targetUrl = `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
    try {
      const response = await fetch(targetUrl);
      return {
        url: targetUrl,
        status: response.status,
        ok: response.ok,
      };
    } catch {
      return {
        url: targetUrl,
        status: 0,
        ok: false,
      };
    }
  }

  /**
   * Crea una instancia de Bun.WebView si está disponible en el runtime para pruebas completas.
   */
  createWebView(initialHtml?: string) {
    if (typeof (globalThis as unknown as { Bun?: { WebView?: new (options?: unknown) => unknown } }).Bun?.WebView !== 'function') {
      throw new Error('Bun.WebView no está disponible en este entorno.');
    }
    const BunRef = (globalThis as unknown as { Bun: { WebView: new (options?: unknown) => unknown } }).Bun;
    return new BunRef.WebView({
      html: initialHtml || '<html><body><div id="root"></div></body></html>',
    });
  }
}

export const e2eRunner = new E2ERunner();

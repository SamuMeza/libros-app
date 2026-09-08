/**
 * Helper de automatización E2E basado en Bun.WebView.
 * Proporciona utilidades para simular navegación y evaluar flujos en el entorno Bun.
 */

export interface E2EHelperOptions {
  baseURL?: string;
}

export interface NavigationResult {
  url: string;
  status: number;
  ok: boolean;
}

interface WebViewInstance {
  navigate(url: string): Promise<void>;
  url: string;
  title: string;
  loading: boolean;
  close(): void;
  scroll(pos: { x: number; y: number }): Promise<void>;
  evaluate(expression: string): Promise<unknown>;
  click(selector: string): Promise<void>;
  type(selector: string, text: string): Promise<void>;
}

export class E2ERunner {
  private baseURL: string;

  constructor(options: E2EHelperOptions = {}) {
    this.baseURL = options.baseURL || process.env.TEST_BASE_URL || 'http://localhost:3000';
  }

  /**
   * Verifica si Bun.WebView está disponible en el runtime.
   */
  static isWebViewAvailable(): boolean {
    return typeof (globalThis as unknown as { Bun?: { WebView?: new (options?: unknown) => unknown } }).Bun?.WebView === 'function';
  }

  /**
   * Navega a una ruta y retorna el resultado HTTP.
   */
  async navigate(path: string): Promise<NavigationResult> {
    const targetUrl = `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
    try {
      const response = await fetch(targetUrl, { redirect: 'manual' });
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
   * Crea una instancia de Bun.WebView para pruebas de navegador completas.
   */
  createWebView(initialHtml?: string): WebViewInstance {
    if (!E2ERunner.isWebViewAvailable()) {
      throw new Error('Bun.WebView no está disponible en este entorno.');
    }
    const BunRef = (globalThis as unknown as { Bun: { WebView: new (options?: unknown) => WebViewInstance } }).Bun;
    return new BunRef.WebView({
      html: initialHtml || '<html><body><div id="root"></div></body></html>',
    });
  }
}

export const e2eRunner = new E2ERunner();

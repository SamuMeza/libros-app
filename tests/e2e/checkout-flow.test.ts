import { describe, it, expect } from 'vitest';
import { E2ERunner } from './runner';

describe('E2E: Flujos Críticos de la Aplicación', () => {
  const runner = new E2ERunner();

  it('debe instanciar el runner y verificar soporte de WebView o fallback de navegación', () => {
    // ARRANGE & ACT
    expect(runner).toBeDefined();

    // ASSERT
    if (typeof (globalThis as unknown as { Bun?: { WebView?: unknown } }).Bun?.WebView === 'function') {
      const webview = runner.createWebView('<h1>Storefront</h1>');
      expect(webview).toBeDefined();
    } else {
      expect(typeof runner.navigate).toBe('function');
    }
  });

  it('debe estructurar los endpoints esperados para el flujo de Checkout y Autenticación', async () => {
    // ARRANGE
    const routesToTest = ['/login', '/registro', '/libros', '/kamcat'];

    // ACT & ASSERT
    for (const route of routesToTest) {
      const result = await runner.navigate(route);
      expect(result.url).toContain(route);
      expect(typeof result.status).toBe('number');
    }
  });
});

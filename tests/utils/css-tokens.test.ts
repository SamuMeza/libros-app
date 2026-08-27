import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const cssPath = path.resolve(__dirname, '../../src/styles/brand-variables.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

describe('CSS Token Utilities', () => {
  describe('Brand colors - Hecho Letras', () => {
    it('should define --hl-primary as #1E3A5F', () => {
      // ARRANGE & ACT
      const match = cssContent.match(/--hl-primary:\s*(#[0-9A-Fa-f]+);/);

      // ASSERT
      expect(match).not.toBeNull();
      expect(match?.[1].toUpperCase()).toBe('#1E3A5F');
    });

    it('should define --hl-secondary as #3B5998', () => {
      // ARRANGE & ACT
      const match = cssContent.match(/--hl-secondary:\s*(#[0-9A-Fa-f]+);/);

      // ASSERT
      expect(match).not.toBeNull();
      expect(match?.[1].toUpperCase()).toBe('#3B5998');
    });

    it('should define --hl-accent as #E8B923', () => {
      // ARRANGE & ACT
      const match = cssContent.match(/--hl-accent:\s*(#[0-9A-Fa-f]+);/);

      // ASSERT
      expect(match).not.toBeNull();
      expect(match?.[1].toUpperCase()).toBe('#E8B923');
    });
  });

  describe('Brand colors - KamCat', () => {
    it('should define --kc-primary as #7C3AED', () => {
      // ARRANGE & ACT
      const match = cssContent.match(/--kc-primary:\s*(#[0-9A-Fa-f]+);/);

      // ASSERT
      expect(match).not.toBeNull();
      expect(match?.[1].toUpperCase()).toBe('#7C3AED');
    });

    it('should define --kc-secondary as #A78BFA', () => {
      // ARRANGE & ACT
      const match = cssContent.match(/--kc-secondary:\s*(#[0-9A-Fa-f]+);/);

      // ASSERT
      expect(match).not.toBeNull();
      expect(match?.[1].toUpperCase()).toBe('#A78BFA');
    });

    it('should define --kc-accent as #F472B6', () => {
      // ARRANGE & ACT
      const match = cssContent.match(/--kc-accent:\s*(#[0-9A-Fa-f]+);/);

      // ASSERT
      expect(match).not.toBeNull();
      expect(match?.[1].toUpperCase()).toBe('#F472B6');
    });
  });

  describe('Dark mode variant', () => {
    it('should define dark mode overrides under [data-theme="dark"]', () => {
      // ARRANGE & ACT
      const hasDarkSelector = cssContent.includes('[data-theme="dark"]');

      // ASSERT
      expect(hasDarkSelector).toBe(true);
    });

    it('should override --bg-primary to #0F0F0F in dark mode', () => {
      // ARRANGE & ACT
      const darkSection = cssContent.split('[data-theme="dark"]')[1];
      const match = darkSection?.match(/--bg-primary:\s*(#[0-9A-Fa-f]+);/);

      // ASSERT
      expect(match).not.toBeNull();
      expect(match?.[1].toUpperCase()).toBe('#0F0F0F');
    });

    it('should override --text-primary to #F5F5F5 in dark mode', () => {
      // ARRANGE & ACT
      const darkSection = cssContent.split('[data-theme="dark"]')[1];
      const match = darkSection?.match(/--text-primary:\s*(#[0-9A-Fa-f]+);/);

      // ASSERT
      expect(match).not.toBeNull();
      expect(match?.[1].toUpperCase()).toBe('#F5F5F5');
    });
  });

  describe('Spacing tokens', () => {
    it('should define space-1 through space-24', () => {
      // ARRANGE & ACT
      const spaceTokens = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

      // ASSERT
      spaceTokens.forEach((token) => {
        expect(cssContent).toContain(`--space-${token}:`);
      });
    });

    it('should use rem units for spacing', () => {
      // ARRANGE & ACT
      const spaceMatches = cssContent.match(/--space-\d+:\s*[\d.]+rem;/g);

      // ASSERT
      expect(spaceMatches).not.toBeNull();
      expect(spaceMatches!.length).toBeGreaterThan(0);
    });
  });

  describe('Border radius tokens', () => {
    it('should define radius-sm, radius-md, radius-lg, radius-xl, radius-full', () => {
      // ARRANGE & ACT
      const radiusTokens = ['radius-sm', 'radius-md', 'radius-lg', 'radius-xl', 'radius-full'];

      // ASSERT
      radiusTokens.forEach((token) => {
        expect(cssContent).toContain(`--${token}:`);
      });
    });
  });

  describe('Shadow tokens', () => {
    it('should define shadow-sm, shadow-md, shadow-lg, shadow-card', () => {
      // ARRANGE & ACT
      const shadowTokens = ['shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-card'];

      // ASSERT
      shadowTokens.forEach((token) => {
        expect(cssContent).toContain(`--${token}:`);
      });
    });
  });

  describe('Typography tokens', () => {
    it('should define responsive font sizes with mobile overrides', () => {
      // ARRANGE & ACT
      const hasResponsiveBlock = cssContent.includes('max-width: 768px');

      // ASSERT
      expect(hasResponsiveBlock).toBe(true);
    });

    it('should define font-h1 through font-nav', () => {
      // ARRANGE & ACT
      const fontTokens = ['font-h1', 'font-h2', 'font-h3', 'font-body', 'font-caption', 'font-button', 'font-badge', 'font-price', 'font-nav'];

      // ASSERT
      fontTokens.forEach((token) => {
        expect(cssContent).toContain(`--${token}:`);
      });
    });
  });

  describe('Brand context classes', () => {
    it('should define .brand-hl class', () => {
      // ARRANGE & ACT
      const hasBrandHl = cssContent.includes('.brand-hl');

      // ASSERT
      expect(hasBrandHl).toBe(true);
    });

    it('should define .brand-kc class', () => {
      // ARRANGE & ACT
      const hasBrandKc = cssContent.includes('.brand-kc');

      // ASSERT
      expect(hasBrandKc).toBe(true);
    });
  });

  describe('No px values', () => {
    it('should not contain px values in spacing and font-size variables', () => {
      // ARRANGE & ACT
      const variableLines = cssContent.split('\n').filter(
        (line) => line.includes('--') && line.includes(':')
      );
      // Exclude radius-full (9999px is standard for pill shapes) and shadow definitions
      const pxLines = variableLines.filter((line) => {
        if (!/\d+px/.test(line)) return false;
        if (line.includes('radius-full')) return false;
        if (line.includes('shadow')) return false;
        return true;
      });

      // ASSERT
      expect(pxLines).toHaveLength(0);
    });
  });
});

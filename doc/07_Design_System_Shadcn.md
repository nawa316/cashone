# Cashone Design System & Shadcn UI Specification
## Project: Cashone Personal Finance Tracker
**Aesthetic Standard:** Modern Financial Terminal (Dark Mode First, Glassmorphism, Micro-Interactions)  
**Component Library:** shadcn/ui (Radix UI Primitives + Tailwind CSS v4)  
**Typography:** Catamaran (Tabular Numeric Display) + Inter (Interface & Body)  
**Iconography:** `lucide-react`  
**Document Version:** 2.0.0  

---

## 1. Design Principles & Visual Aesthetic Guidelines

Cashone adheres to an institutional-grade design language built to evoke the precision of a high-density financial terminal.

### Core Visual Tenets:
1. **Dark-Mode-First Precision:** Deep space slate (`#0B0F19`) canvas with layered elevated surfaces (`#111827`, `#1F2937`) to minimize eye strain.
2. **Glassmorphism & Depth:** Translucent backdrops (`backdrop-blur-md bg-slate-900/75`) with subtle border highlights (`border-slate-800/80`).
3. **Semantic Financial Accents:**
   * **Emerald (`#10B981`):** Net positive savings, cash inflows, income.
   * **Rose / Crimson (`#EF4444`):** Cash outflows, expenses, budget warnings.
   * **Electric Blue (`#3B82F6`):** Inter-account transfers, bank connections, primary CTAs.
   * **Neon Amber (`#F59E0B`):** Budget limit alerts and pending payments.
4. **Data Density & Tabular Typography:** `Catamaran` font with `font-variant-numeric: tabular-nums` keeps column figures strictly aligned.
5. **Fluid Micro-Interactions:** 150ms-250ms ease-out transitions for card hovers, modal overlays, and button presses.

---

## 2. Global CSS Theme Variables (`app/globals.css`)

```css
@layer base {
  :root {
    --background: #0b0f19;
    --foreground: #f8fafc;
    --card: #111827;
    --card-foreground: #f8fafc;
    --primary: #3b82f6;
    --profit: #10b981;
    --loss: #ef4444;
    --transfer: #3b82f6;
    --warning: #f59e0b;
  }
}
```

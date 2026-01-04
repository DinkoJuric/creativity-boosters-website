# Unicorn Studio Integration Guide

A comprehensive reference for working with Unicorn Studio WebGL assets in this project.

---

## The Why

### For Agents
Unicorn Studio produces **WebGL canvas scenes** that require a specific SDK to render. Unlike static images or videos, these are live, interactive graphics powered by shaders. Understanding this context prevents:
- Treating embed code as standard HTML (it requires JS initialization)
- Breaking responsive behavior by hardcoding dimensions
- Performance issues from incorrect SDK configuration

### For Dinko
You chose Unicorn Studio because it enables:
- **Interactive, animated backgrounds** without writing shader code
- **Built-in responsive breakpoints** (Desktop/Tablet/Mobile in one project)
- **No video hosting costs** — it's rendered client-side
- **Easy iteration** — edit in browser, republish, changes go live

---

## The How (For Agents)

### SDK Reference

| Item | Value |
| :--- | :--- |
| **CDN URL** | `https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.0/dist/unicornStudio.umd.js` |
| **GitHub** | [hiunicornstudio/unicornstudio.js](https://github.com/hiunicornstudio/unicornstudio.js) |
| **Current Version** | v2.0.0 |

### Embed Pattern (Recommended)

```html
<!-- In <head> -->
<script src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.0/dist/unicornStudio.umd.js"></script>

<!-- In <body> -->
<div class="unicorn-container"
     data-us-project="PROJECT_ID"
     data-us-production="true"
     data-us-scale="1"
     data-us-dpi="1.5"
     data-us-alttext="Description for accessibility">
</div>

<!-- Before </body> -->
<script>
  UnicornStudio.init().then(scenes => {
    console.log('Unicorn ready');
  });
</script>
```

### Key Parameters

| Attribute | Type | Purpose |
| :--- | :--- | :--- |
| `data-us-project` | string | Project ID from Unicorn Studio export |
| `data-us-production` | boolean | `true` = serve from CDN (faster) |
| `data-us-scale` | number | Render scale, 0.25-1.0 (lower = better perf) |
| `data-us-dpi` | number | Pixel ratio (1.0-2.0) |
| `data-us-lazyload` | boolean | `true` = init when scrolled into view |
| `data-us-fps` | number | Frame rate cap (0-120) |
| `data-us-alttext` | string | SEO/accessibility description |

### Scene Control (Post-Init)

```javascript
UnicornStudio.init().then(scenes => {
  const scene = scenes[0];
  scene.paused = true;   // Pause rendering
  scene.paused = false;  // Resume
  scene.resize();        // Call if container resizes
  scene.destroy();       // Remove scene
});
```

### Performance Checklist

- [x] Put SDK in `<head>` for above-fold scenes
- [x] Use `data-us-production="true"` always
- [x] Use `data-us-lazyload="true"` for below-fold scenes
- [x] Set `data-us-scale="0.75"` on mobile if needed
- [x] Avoid >10 scenes per page (WebGL context limit)

---

## The How (For Dinko)

### Publishing Workflow

1. Make changes in [unicorn.studio](https://unicorn.studio) editor
2. Click **Export** → **Embed**
3. Ensure **Production** toggle is ON ✅
4. Click **Publish**
5. Wait ~30 seconds for CDN propagation
6. Refresh your site — changes are live

> [!TIP]
> You don't need to update any code. The Project ID stays the same; republishing updates the CDN automatically.

### Responsive Breakpoints

| Icon | Breakpoint | Width |
| :--- | :--- | :--- |
| 🖥️ Desktop | Default | 992px+ |
| 📱 Tablet | `≤991px` | 576-991px |
| 📱 Mobile | `≤575px` | <576px |

Switch between icons in the Unicorn editor to design each breakpoint. The SDK auto-switches at runtime.

### What to Avoid

> [!CAUTION]
> **Effects/features that may cause issues on this website:**

| Avoid | Why |
| :--- | :--- |
| **Scroll-linked animations** | Conflicts with existing parallax in `script.js` |
| **Fixed position scenes** | Hero is already in normal flow |
| **Videos >15MB** | Only Legend plan supports, plus performance hit |
| **Excessive blur effects** | GPU-heavy, especially on mobile |
| **Many stacked effects (5+)** | Shader compilation slows load |
| **Custom fonts (without Legend)** | Won't render, falls back to default |

### Safe to Use

| Use Freely | Notes |
| :--- | :--- |
| **Images/Shapes** | Core functionality |
| **Mouse interactivity** | Hover, parallax effects |
| **Gradient backgrounds** | Performant |
| **Text (in canvas)** | If NOT needed for SEO |
| **Opacity animations** | Lightweight |
| **Noise/grain overlays** | Low GPU cost |

---

## Project-Specific Notes

- **Project ID**: `VrUy8qbZoWjpBfMb9Xrm`
- **Used in**: Hero section of [index.html](file:///c:/Users/dinko/Projects/Creativity-Boosters/creativity-boosters-website/index.html)
- **Text**: Rendered by Unicorn canvas; HTML text hidden with `sr-only` pattern for SEO
- **SEO Note**: The `.hero-text` div is visually hidden but remains in DOM for search engines

---

## Future Improvement Ideas

> [!TIP]
> **Silhouette → Brand Image Transition**
> 
> Dinko has an idea to apply an effect where the silhouette image transforms into the actual brand image. This could be:
> - A scroll-triggered morph effect
> - A hover-based reveal
> - A timed animation on page load
> 
> Explore Unicorn Studio's blend modes and image transitions to achieve this.

# Build and Deployment Guide

## Prerequisites

Before building the application, ensure you have:

- Node.js (v18 or higher)
- npm, yarn, or pnpm package manager

## Installation

Install all dependencies:

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Testing

Run all tests (unit, property-based, and integration):

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

## Production Build

### Build the Application

```bash
npm run build
```

This command will:
1. Run TypeScript compiler to check for type errors
2. Build the application using Vite
3. Generate optimized production files in the `dist/` directory

### Build Output

The build process creates:
- `dist/index.html` - Main HTML file
- `dist/assets/` - Optimized JavaScript, CSS, and other assets
  - JavaScript files are minified and code-split
  - CSS is extracted and minified
  - Assets are hashed for cache busting

### Expected Bundle Size

Target bundle sizes (gzipped):
- Main JavaScript bundle: ~150-200 KB
- CSS: ~10-20 KB
- Total initial load: ~160-220 KB

The application uses code splitting to load calculator modules on demand, reducing initial load time.

## Preview Production Build

Test the production build locally:

```bash
npm run preview
```

This starts a local server serving the production build at `http://localhost:4173`

## Build Verification Checklist

Before deploying, verify:

- ✅ All tests pass (`npm test`)
- ✅ TypeScript compilation succeeds (no type errors)
- ✅ Build completes without errors
- ✅ Bundle size is reasonable (< 500 KB total)
- ✅ Production build runs correctly (`npm run preview`)
- ✅ All calculators function correctly in production build
- ✅ Navigation works properly
- ✅ State persistence works across navigation
- ✅ Responsive design works on mobile, tablet, and desktop
- ✅ All formulas and calculations produce correct results

## Deployment

### Static Hosting Options

The application is a static site and can be deployed to any static hosting service:

#### Netlify

1. Connect your repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy

#### Vercel

1. Connect your repository to Vercel
2. Vercel auto-detects Vite configuration
3. Deploy

#### GitHub Pages

1. Build the application: `npm run build`
2. Deploy the `dist/` directory to GitHub Pages
3. Configure base path in `vite.config.ts` if needed:
   ```typescript
   export default defineConfig({
     base: '/repository-name/',
     // ... other config
   })
   ```

#### AWS S3 + CloudFront

1. Build the application: `npm run build`
2. Upload `dist/` contents to S3 bucket
3. Configure S3 for static website hosting
4. Set up CloudFront distribution for HTTPS and CDN

#### Other Options

- Firebase Hosting
- Azure Static Web Apps
- Cloudflare Pages
- Render

### Deployment Configuration

No special server configuration is required. The application:
- Runs entirely in the browser (client-side only)
- Requires no backend or database
- Performs all calculations locally
- Uses browser routing (may need redirect rules for SPA)

### SPA Routing Configuration

For proper routing, configure your hosting to redirect all requests to `index.html`:

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Apache** (`.htaccess`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Performance Optimization

The build includes:

- **Code Splitting:** Calculator modules are loaded on demand
- **Tree Shaking:** Unused code is eliminated
- **Minification:** JavaScript and CSS are minified
- **Asset Optimization:** Images and fonts are optimized
- **Cache Busting:** Asset filenames include content hashes
- **Compression:** Enable gzip/brotli compression on your server

## Browser Support

The application supports:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Environment Variables

No environment variables are required for production build.

## Monitoring and Analytics

Consider adding:
- Google Analytics or similar for usage tracking
- Error tracking (Sentry, Rollbar)
- Performance monitoring (Web Vitals)

## Security Considerations

- All calculations are performed client-side
- No sensitive data is transmitted
- No authentication required
- HTTPS recommended for production deployment
- Content Security Policy (CSP) can be configured

## Troubleshooting

### Build Fails

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check Node.js version:
   ```bash
   node --version  # Should be v18 or higher
   ```

### Large Bundle Size

1. Analyze bundle:
   ```bash
   npm run build -- --mode analyze
   ```

2. Check for duplicate dependencies
3. Ensure tree shaking is working

### Production Build Issues

1. Test locally with preview:
   ```bash
   npm run preview
   ```

2. Check browser console for errors
3. Verify all assets are loading correctly
4. Test on different devices and browsers

## Continuous Integration

Example GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        # Add your deployment step here
        run: echo "Deploy to hosting service"
```

## Post-Deployment Verification

After deployment, verify:

1. Application loads correctly
2. All calculators are accessible
3. Calculations produce correct results
4. Navigation works properly
5. State persists across navigation
6. Responsive design works on all devices
7. No console errors
8. Performance is acceptable (Lighthouse score > 90)

## Rollback Procedure

If issues are found after deployment:

1. Revert to previous deployment
2. Investigate issues locally
3. Fix and test thoroughly
4. Redeploy

## Support and Maintenance

- Monitor error logs regularly
- Update dependencies periodically
- Test after dependency updates
- Keep documentation up to date

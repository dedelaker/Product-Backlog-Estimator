# Domain Setup Guide - estimr.ovh

## Current Configuration

Your application is now configured for the domain: **estimr.ovh**

## Vercel Custom Domain Setup

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Domains" section
   - Add custom domain: `estimr.ovh`
   - Add www variant: `www.estimr.ovh` (optional)

2. **DNS Configuration** (at your OVH control panel):
   ```
   Type: A
   Name: @
   Value: 76.76.19.61 (Vercel IP)
   TTL: 300

   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   TTL: 300
   ```

3. **SSL Certificate**:
   - Vercel automatically provisions SSL certificates
   - Certificate will be ready within 24 hours after DNS propagation

## Application Features

- **Professional Domain**: estimr.ovh
- **SEO Optimized**: Complete meta tags and Open Graph support
- **Privacy Protected**: Comprehensive crawler blocking
- **Mobile Responsive**: Optimized for all devices
- **Secure**: HTTPS with automatic SSL renewal

## Post-Deployment Checklist

- [ ] DNS records configured at OVH
- [ ] Domain added in Vercel dashboard
- [ ] SSL certificate active (automatic)
- [ ] Application accessible at https://estimr.ovh
- [ ] All crawling protection verified
- [ ] Database connection functioning

## Technical Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript  
- **Database**: PostgreSQL (Neon)
- **Hosting**: Vercel
- **Domain**: OVH (.ovh TLD)

## Support

For domain-related issues:
- OVH support for DNS configuration
- Vercel support for deployment issues
- Application logs available in Vercel dashboard
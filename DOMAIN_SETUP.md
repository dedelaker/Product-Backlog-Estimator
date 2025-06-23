# Domain Setup Guide - estimr.ovh

## Current Configuration

Your application is now configured for the subdomain: **product-backlog-estimator.estimr.ovh**

This setup ensures users access your app via the custom subdomain while hiding the Vercel URL.

## Vercel Custom Domain Setup

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Domains" section
   - Add custom domain: `project-backlog-estimator.estimr.ovh`
   - Vercel will automatically handle SSL and redirects

2. **DNS Configuration** (at your OVH control panel):
   ```
   Type: CNAME
   Name: project-backlog-estimator
   Value: cname.vercel-dns.com
   TTL: 300
   
   Type: A (if CNAME doesn't work)
   Name: project-backlog-estimator
   Value: 76.76.19.61 (Vercel IP)
   TTL: 300
   ```

3. **URL Behavior**:
   - Users access: `https://project-backlog-estimator.estimr.ovh`
   - Vercel URL is hidden from users
   - Automatic redirects from Vercel URLs to custom domain
   - SSL automatically provisioned by Vercel

## Application Features

- **Custom Subdomain**: project-backlog-estimator.estimr.ovh
- **URL Masking**: Vercel URLs automatically redirect to custom domain
- **SEO Optimized**: Complete meta tags and Open Graph support
- **Privacy Protected**: Comprehensive crawler blocking
- **Mobile Responsive**: Optimized for all devices
- **Secure**: HTTPS with automatic SSL renewal

## Post-Deployment Checklist

- [ ] DNS CNAME record configured at OVH
- [ ] Custom domain added in Vercel dashboard
- [ ] SSL certificate active (automatic)
- [ ] Application accessible at https://project-backlog-estimator.estimr.ovh
- [ ] Vercel URL redirects working properly
- [ ] All crawling protection verified
- [ ] Database connection functioning

## URL Structure

**Primary Access URL**: https://project-backlog-estimator.estimr.ovh
**Hidden Vercel URL**: https://project-backlog-estimator-*.vercel.app (redirects automatically)

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
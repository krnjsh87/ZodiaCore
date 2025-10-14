# Production Domain and SSL Configuration Guide for ZodiaCore on Render

## Overview

This guide provides comprehensive step-by-step instructions for configuring a custom production domain (`https://app-zodiacore.onrender.com`) and SSL certificates for the ZodiaCore application deployed on Render. Render automatically handles SSL certificate provisioning and renewal, ensuring secure HTTPS connections without manual intervention.

## Prerequisites

Before proceeding, ensure you have:

- An active Render account with administrative access to the ZodiaCore service
- Ownership or administrative access to the domain registrar for `app-zodiacore.onrender.com`
- The ZodiaCore application successfully deployed on Render
- Basic familiarity with DNS management

## Step 1: Access Render Dashboard

1. Log in to your Render account at [https://dashboard.render.com](https://dashboard.render.com)
2. Navigate to your ZodiaCore service (web service or static site)
3. Click on the service name to open its settings

## Step 2: Configure Custom Domain in Render

1. In the service settings, locate the **Custom Domains** section
2. Click **Add Custom Domain**
3. Enter the domain: `app-zodiacore.onrender.com`
4. Click **Save** to add the domain

Render will generate DNS records that you need to configure with your domain registrar.

## Step 3: DNS Configuration

After adding the custom domain in Render, you'll see the required DNS records. Configure these in your domain registrar's DNS settings:

### CNAME Record

- **Type**: CNAME
- **Name/Host**: `app-zodiacore` (or `@` if using root domain)
- **Value/Target**: The CNAME target provided by Render (typically something like `your-service-name.onrender.com`)
- **TTL**: 300 (or default)

### Verification

- **Type**: TXT
- **Name/Host**: `_render_verification.app-zodiacore`
- **Value**: The verification code provided by Render
- **TTL**: 300

**Important Notes:**

- DNS changes may take up to 48 hours to propagate globally
- Do not modify the TTL values unless instructed by Render support
- Ensure no conflicting A, AAAA, or CNAME records exist for the domain

## Step 4: SSL Certificate Verification

Render automatically provisions and manages SSL certificates for custom domains:

1. Once DNS records are configured and propagated, Render will automatically:
   - Request an SSL certificate from Let's Encrypt
   - Validate domain ownership through the DNS records
   - Install and configure the certificate

2. Monitor the domain status in Render dashboard:
   - **Pending**: DNS propagation in progress
   - **Active**: Domain configured successfully with SSL
   - **Error**: Check DNS configuration or contact Render support

3. SSL certificates are:
   - Automatically renewed before expiration
   - Free of charge
   - Compatible with all modern browsers
   - Include proper security headers

## Step 5: Testing and Verification

After configuration:

1. **DNS Propagation Check**:
   - Use tools like `dig` or online DNS checkers to verify CNAME resolution
   - Command: `dig CNAME app-zodiacore.onrender.com`

2. **SSL Certificate Verification**:
   - Visit `https://app-zodiacore.onrender.com` in a browser
   - Check for the padlock icon indicating secure connection
   - Use SSL testing tools like SSL Labs' SSL Test

3. **Application Functionality**:
   - Ensure all ZodiaCore features work correctly over HTTPS
   - Test API endpoints if applicable
   - Verify no mixed content warnings

## Troubleshooting

### Common Issues

**Domain Not Resolving**:

- Wait for DNS propagation (up to 48 hours)
- Verify CNAME record is correctly configured
- Check for conflicting DNS records

**SSL Certificate Not Provisioned**:

- Ensure DNS records are fully propagated
- Verify the verification TXT record is present
- Contact Render support if issues persist after 72 hours

**Mixed Content Warnings**:

- Ensure all resources (images, scripts, stylesheets) use HTTPS URLs
- Update any hardcoded HTTP links in the application

**Certificate Authority Authorization (CAA) Issues**:

- If your domain has CAA records, ensure Let's Encrypt is authorized
- Add CAA record: `0 issue "letsencrypt.org"`

### Support Resources

- Render Documentation: [Custom Domains](https://docs.render.com/custom-domains)
- Render Support: [support@render.com](mailto:support@render.com)
- Let's Encrypt: [Certificate Compatibility](https://letsencrypt.org/docs/certificate-compatibility/)

## Security Considerations

- SSL certificates provided by Render are production-ready
- Regular certificate rotation is handled automatically
- Monitor for certificate expiration warnings in Render dashboard
- Implement HSTS headers in your application for enhanced security

## Maintenance

- No manual SSL certificate management required
- Monitor domain status in Render dashboard regularly
- Update DNS records only if instructed by Render
- Keep domain registrar contact information current

## Conclusion

Following this guide ensures your ZodiaCore application is securely accessible via the custom domain `https://app-zodiacore.onrender.com` with automatic SSL certificate management. Render's automated SSL handling reduces maintenance overhead while maintaining security standards.

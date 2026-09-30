# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x | Yes |

## Reporting a Vulnerability

If you discover a security vulnerability in Gift Buddy, please report it responsibly.

### How to report

1. **Do not** open a public GitHub issue for security vulnerabilities
2. Email the maintainer at the address listed in the repository owner's GitHub profile
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to expect

- Acknowledgment within 48 hours
- Assessment and severity classification within 1 week
- Fix timeline communicated based on severity:
  - **Critical**: Patch within 24-48 hours
  - **High**: Patch within 1 week
  - **Medium**: Patch within 2 weeks
  - **Low**: Included in next regular release

### After the fix

- A security advisory will be published with details
- Credit will be given to the reporter (unless they prefer anonymity)
- The fix will be released as a patch version

## Security Practices

### Secrets Management

- All secrets are stored in environment variables, never in source code
- `.env.example` contains variable names and descriptions only
- Production secrets are managed through GitHub Secrets or the deployment platform
- Firebase API keys (client-side config) are not secrets -- access is controlled by Security Rules

### Authentication and Authorization

- Admin access requires Firebase Authentication
- Admin authorization is enforced at both the application layer and Firestore Security Rules
- Security Rules default to deny-all
- Client-side route guards are complemented by server-side enforcement
- No reliance on hidden navigation or client-side flags for authorization

### Data Protection

- Customer personal data (phone, email, address) is stored only as needed
- WhatsApp message content is stored for operational purposes with defined retention
- Access tokens and credentials are never logged
- Phone numbers in logs are redacted
- Data retention and deletion procedures are documented

### Input Validation

- All external input is validated with Zod schemas at trust boundaries
- Output is encoded to prevent injection attacks
- File uploads (when implemented) are validated for type and size

### WhatsApp Integration Security

- Webhook requests are verified using HMAC signature validation
- Access tokens are server-only environment variables
- The fake adapter is the default -- no real API calls in development or tests
- Webhook event IDs are tracked for idempotent processing

### Dependency Management

- Dependencies are locked via `package-lock.json`
- `npm audit` is run as part of the CI pipeline
- Vulnerable dependencies are patched promptly

### Infrastructure

- Firebase Hosting provides HTTPS by default
- Firestore Security Rules are version-controlled and tested
- Service account keys are rotated periodically
- Billing alerts are configured to detect abuse

## Scope

This security policy covers the Gift Buddy application code, configuration, and deployment infrastructure. It does not cover:

- Firebase platform security (covered by Google's security practices)
- WhatsApp/Meta platform security
- Third-party dependencies (report to the respective maintainers)

## References

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [WhatsApp Cloud API Security](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

import Link from 'next/link';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'Corporate Gifting', href: '/corporate-gifting' },
    { name: 'Categories', href: '/categories' },
    { name: 'Collections', href: '/collections' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Track Order', href: '/track' },
    { name: 'Share Feedback', href: '/feedback' },
  ],
  policies: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cancellation & Refund', href: '/cancellation-policy' },
    { name: 'Delivery Info', href: '/delivery-info' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-primary">
              Gift Buddy
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Curated corporate gift hampers for every occasion. Making business gifting thoughtful,
              sustainable, and effortless.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Shop</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Policies</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.policies.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Gift Buddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

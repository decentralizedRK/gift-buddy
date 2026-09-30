export const metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your Gift Buddy store
        </p>
      </div>

      {/* Store Info */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Store Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-foreground mb-1">
              Store Name
            </label>
            <input
              id="storeName"
              type="text"
              defaultValue="Gift Buddy"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="storeCurrency" className="block text-sm font-medium text-foreground mb-1">
              Default Currency
            </label>
            <input
              id="storeCurrency"
              type="text"
              defaultValue="INR"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="storeEmail" className="block text-sm font-medium text-foreground mb-1">
              Contact Email
            </label>
            <input
              id="storeEmail"
              type="email"
              defaultValue="hello@giftbuddy.in"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="storePhone" className="block text-sm font-medium text-foreground mb-1">
              Contact Phone
            </label>
            <input
              id="storePhone"
              type="tel"
              defaultValue="+91 80000 00000"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="storeAddress" className="block text-sm font-medium text-foreground mb-1">
              Business Address
            </label>
            <textarea
              id="storeAddress"
              rows={2}
              defaultValue="Gift Buddy, Bangalore, Karnataka, India"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* WhatsApp Configuration */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          WhatsApp Configuration
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Connect your WhatsApp Business Platform account to enable order notifications and customer messaging.
        </p>

        <div className="rounded-lg border border-border bg-muted/50 p-4 mb-4">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-foreground">Not Configured</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                WhatsApp Business Platform credentials are required. Set these values in
                your environment configuration (never paste secrets here).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <label htmlFor="waPhoneNumberId" className="block text-sm font-medium text-foreground mb-1">
              Phone Number ID
            </label>
            <input
              id="waPhoneNumberId"
              type="text"
              placeholder="Set via WHATSAPP_PHONE_NUMBER_ID env var"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-muted text-muted-foreground focus:outline-none"
              disabled
            />
          </div>
          <div>
            <label htmlFor="waBusinessAccountId" className="block text-sm font-medium text-foreground mb-1">
              Business Account ID
            </label>
            <input
              id="waBusinessAccountId"
              type="text"
              placeholder="Set via WHATSAPP_BUSINESS_ACCOUNT_ID env var"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-muted text-muted-foreground focus:outline-none"
              disabled
            />
          </div>
          <div>
            <label htmlFor="waWebhookStatus" className="block text-sm font-medium text-foreground mb-1">
              Webhook Status
            </label>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 px-2.5 py-0.5 text-xs font-medium">
                Not Connected
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="waAdapterMode" className="block text-sm font-medium text-foreground mb-1">
              Adapter Mode
            </label>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-2.5 py-0.5 text-xs font-medium">
                Fake (Development)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Notification Preferences
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure which events trigger WhatsApp notifications to customers.
        </p>

        <div className="space-y-3 max-w-lg">
          {[
            { id: 'notif_inquiry', label: 'Inquiry Received', description: 'Confirm receipt of new inquiry', defaultChecked: true },
            { id: 'notif_quote', label: 'Quote Ready', description: 'Notify when quote is sent', defaultChecked: true },
            { id: 'notif_confirmed', label: 'Order Confirmed', description: 'Confirm order acceptance', defaultChecked: true },
            { id: 'notif_packing', label: 'Packing Started', description: 'Update on preparation progress', defaultChecked: false },
            { id: 'notif_dispatched', label: 'Order Dispatched', description: 'Share tracking details', defaultChecked: true },
            { id: 'notif_delivered', label: 'Order Delivered', description: 'Confirm delivery completion', defaultChecked: true },
            { id: 'notif_delay', label: 'Delay Notice', description: 'Inform about unexpected delays', defaultChecked: true },
            { id: 'notif_cancelled', label: 'Cancellation', description: 'Confirm order cancellation', defaultChecked: true },
          ].map((notif) => (
            <label
              key={notif.id}
              htmlFor={notif.id}
              className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <input
                id={notif.id}
                type="checkbox"
                defaultChecked={notif.defaultChecked}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-ring"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{notif.label}</p>
                <p className="text-xs text-muted-foreground">{notif.description}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </section>
    </div>
  );
}

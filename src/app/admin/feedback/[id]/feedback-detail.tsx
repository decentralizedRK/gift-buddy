'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { seedFeedback, type SeedFeedback } from '@/data/seed-feedback';
import { seedRecommendationRequests, type SeedRecommendationRequest } from '@/data/seed-feedback';


import {
  FEEDBACK_TYPES,
  VALID_FEEDBACK_TRANSITIONS,
  validateFeedbackTransition,
  BUDGET_RANGE_LABELS,
  QUANTITY_RANGE_LABELS,
  type FeedbackStatus,
  type FeedbackPriority,
  type Sentiment,
  type BudgetRange,
  type QuantityRange,
} from '@/domain/feedback';
import { formatDate } from '@/lib/format';

/* Style maps --------------------------------------------------------------- */

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  triaged: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-orange-100 text-orange-800',
  planned: 'bg-purple-100 text-purple-800',
  accepted: 'bg-green-100 text-green-800',
  implemented: 'bg-green-100 text-green-800',
  responded: 'bg-teal-100 text-teal-800',
  closed: 'bg-gray-100 text-gray-600',
  duplicate: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-800',
  spam: 'bg-red-100 text-red-800',
};

const PRIORITY_STYLES: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  normal: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

function statusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function renderStars(rating?: number): React.ReactNode {
  if (rating == null) return null;
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

/* Demo audit events -------------------------------------------------------- */

function buildDemoTimeline(item: SeedFeedback) {
  const events = [
    {
      id: 'evt_1',
      status: 'new' as FeedbackStatus,
      actor: 'System',
      note: 'Feedback submitted via ' + item.source,
      timestamp: item.createdAt,
    },
  ];

  if (item.status !== 'new') {
    events.push({
      id: 'evt_2',
      status: 'triaged' as FeedbackStatus,
      actor: 'Admin User',
      note: 'Triaged and assigned for review',
      timestamp: new Date(item.createdAt.getTime() + 2 * 60 * 60 * 1000),
    });
  }

  if (
    ['under_review', 'planned', 'accepted', 'implemented', 'responded', 'closed'].includes(
      item.status
    )
  ) {
    events.push({
      id: 'evt_3',
      status: item.status as FeedbackStatus,
      actor: 'Admin User',
      note: `Status updated to ${statusLabel(item.status)}`,
      timestamp: item.updatedAt,
    });
  }

  return events;
}

/* Page --------------------------------------------------------------------- */

export default function FeedbackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Look up from both seed collections
  const feedbackItem = seedFeedback.find((fb) => fb.id === id);
  const recommendationItem = seedRecommendationRequests.find((r) => r.id === id);

  // If it's a recommendation request, show a simpler view
  if (recommendationItem) {
    return <RecommendationDetailView item={recommendationItem} />;
  }

  if (!feedbackItem) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/feedback"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Feedback
        </Link>
        <div className="rounded-xl border border-border bg-background p-10 text-center">
          <h1 className="text-xl font-semibold text-foreground">Feedback not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The feedback item with ID &quot;{id}&quot; does not exist.
          </p>
        </div>
      </div>
    );
  }

  return <FeedbackDetailView item={feedbackItem} />;
}

/* Feedback detail ---------------------------------------------------------- */

function FeedbackDetailView({ item }: { item: SeedFeedback }) {
  const [status, setStatus] = useState<FeedbackStatus>(item.status);
  const [priority, setPriority] = useState<FeedbackPriority>(item.priority);
  const [sentiment, setSentiment] = useState<Sentiment>(item.sentiment);
  const [tags, setTags] = useState<string[]>(item.tags);
  const [newTag, setNewTag] = useState('');
  const [notes, setNotes] = useState<{ text: string; date: Date }[]>([]);
  const [newNote, setNewNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus | ''>('');
  const [selectedPriority, setSelectedPriority] = useState<FeedbackPriority>(priority);
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment>(sentiment);

  const validNextStatuses = VALID_FEEDBACK_TRANSITIONS[status];
  const timeline = buildDemoTimeline(item);

  function handleStatusUpdate() {
    if (selectedStatus && validateFeedbackTransition(status, selectedStatus)) {
      setStatus(selectedStatus);
      setSelectedStatus('');
    }
  }

  function handlePriorityUpdate() {
    setPriority(selectedPriority);
  }

  function handleSentimentUpdate() {
    setSentiment(selectedSentiment);
  }

  function handleAddTag() {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag('');
    }
  }

  function handleAddNote() {
    const trimmed = newNote.trim();
    if (trimmed) {
      setNotes([...notes, { text: trimmed, date: new Date() }]);
      setNewNote('');
    }
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/feedback"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Feedback
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
              {FEEDBACK_TYPES[item.type] ?? item.type}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground'}`}
            >
              {statusLabel(status)}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[priority] ?? 'bg-muted text-muted-foreground'}`}
            >
              {statusLabel(priority)}
            </span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message */}
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Message</h2>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {item.message}
            </p>
          </div>

          {/* Rating */}
          {item.rating != null && (
            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Rating</h2>
              <div className="flex items-center gap-2">
                {renderStars(item.rating)}
                <span className="text-sm text-muted-foreground">{item.rating} / 5</span>
              </div>
            </div>
          )}

          {/* Related Product */}
          {item.relatedProductSnapshot && (
            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Related Product</h2>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21" />
                  </svg>
                </div>
                <div>
                  <Link
                    href={`/admin/products/${item.relatedProductSnapshot.id}`}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {item.relatedProductSnapshot.title}
                  </Link>
                  <p className="text-xs text-muted-foreground font-mono">
                    {item.relatedProductSnapshot.sku}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Suggested Items */}
          {item.suggestedItems && item.suggestedItems.length > 0 && (
            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Suggested Items</h2>
              <ul className="list-disc list-inside space-y-1">
                {item.suggestedItems.map((si, i) => (
                  <li key={i} className="text-sm text-foreground">
                    {si}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-xs text-muted-foreground">No tags</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add a tag..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground"
                aria-label="New tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-5">
            <h2 className="text-sm font-semibold text-foreground">Actions</h2>

            {/* Status change */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Update Status</label>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as FeedbackStatus | '')}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  aria-label="Select new status"
                >
                  <option value="">Select status...</option>
                  {validNextStatuses.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  disabled={!selectedStatus}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Priority change */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Update Priority
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as FeedbackPriority)}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  aria-label="Select priority"
                >
                  {(['low', 'normal', 'high', 'urgent'] as const).map((p) => (
                    <option key={p} value={p}>
                      {statusLabel(p)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handlePriorityUpdate}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Update Priority
                </button>
              </div>
            </div>

            {/* Sentiment */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Update Sentiment
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedSentiment}
                  onChange={(e) => setSelectedSentiment(e.target.value as Sentiment)}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  aria-label="Select sentiment"
                >
                  {(
                    ['positive', 'neutral', 'negative', 'mixed', 'not_classified'] as const
                  ).map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleSentimentUpdate}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Internal Notes</label>
              {notes.length > 0 && (
                <div className="space-y-2 mb-2">
                  {notes.map((note, i) => (
                    <div key={i} className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-foreground">{note.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(note.date)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add an internal note..."
                  rows={2}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none"
                  aria-label="Internal note"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="self-end rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Timeline</h2>
            <div className="space-y-4">
              {timeline.map((evt, i) => (
                <div key={evt.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5" />
                    {i < timeline.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[evt.status] ?? 'bg-muted text-muted-foreground'}`}
                      >
                        {statusLabel(evt.status)}
                      </span>
                      <span className="text-xs text-muted-foreground">by {evt.actor}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{evt.note}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(evt.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Contact Information</h2>
            <dl className="space-y-3 text-sm">
              {item.anonymous ? (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Submitted</dt>
                  <dd className="text-foreground italic">Anonymous</dd>
                </div>
              ) : (
                <>
                  {item.companyName && (
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">Company</dt>
                      <dd className="text-foreground">{item.companyName}</dd>
                    </div>
                  )}
                  {item.contactName && (
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">Name</dt>
                      <dd className="text-foreground">{item.contactName}</dd>
                    </div>
                  )}
                  {item.email && (
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">Email</dt>
                      <dd className="text-foreground break-all">{item.email}</dd>
                    </div>
                  )}
                  {item.phone && (
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">Phone</dt>
                      <dd className="text-foreground">{item.phone}</dd>
                    </div>
                  )}
                </>
              )}
            </dl>
          </div>

          {/* Submission Details */}
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Submission Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Reference</dt>
                <dd className="text-foreground font-mono text-xs">{item.publicReference}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Source</dt>
                <dd className="text-foreground">{statusLabel(item.source)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Date</dt>
                <dd className="text-foreground">{formatDate(item.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Idempotency Hash</dt>
                <dd className="text-foreground font-mono text-xs">
                  {item.idempotencyKeyHash.slice(0, 12)}...
                </dd>
              </div>
            </dl>
          </div>

          {/* Additional Details (category, occasion, budget, quantity) */}
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Additional Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Category</dt>
                <dd className="text-foreground">{statusLabel(item.category)}</dd>
              </div>
              {item.occasion && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Occasion</dt>
                  <dd className="text-foreground capitalize">{item.occasion}</dd>
                </div>
              )}
              {item.budgetRange && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Budget Range</dt>
                  <dd className="text-foreground">
                    {BUDGET_RANGE_LABELS[item.budgetRange as BudgetRange] ?? item.budgetRange}
                  </dd>
                </div>
              )}
              {item.quantityRange && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Quantity Range</dt>
                  <dd className="text-foreground">
                    {QUANTITY_RANGE_LABELS[item.quantityRange as QuantityRange] ??
                      item.quantityRange}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Sentiment</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      sentiment === 'positive'
                        ? 'bg-green-100 text-green-800'
                        : sentiment === 'negative'
                          ? 'bg-red-100 text-red-800'
                          : sentiment === 'mixed'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {statusLabel(sentiment)}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Recommendation detail view ----------------------------------------------- */

function RecommendationDetailView({ item }: { item: SeedRecommendationRequest }) {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/feedback"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Feedback
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Recommendation Request</h1>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
            Recommendation Request
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[item.status] ?? 'bg-muted text-muted-foreground'}`}
          >
            {statusLabel(item.status)}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[item.priority] ?? 'bg-muted text-muted-foreground'}`}
          >
            {statusLabel(item.priority)}
          </span>
          <span className="font-mono text-xs text-muted-foreground">{item.publicReference}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Request Details</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Occasion</dt>
                <dd className="text-foreground capitalize">{item.occasion}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Recipient Group</dt>
                <dd className="text-foreground">{item.recipientGroup}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Number of Recipients</dt>
                <dd className="text-foreground">{item.numberOfRecipients}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Budget per Recipient</dt>
                <dd className="text-foreground">
                  {BUDGET_RANGE_LABELS[item.budgetPerRecipient as BudgetRange] ??
                    item.budgetPerRecipient}
                </dd>
              </div>
              {item.totalBudgetApprox && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    Approx. Total Budget
                  </dt>
                  <dd className="text-foreground">{item.totalBudgetApprox}</dd>
                </div>
              )}
              {item.requiredDate && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Required Date</dt>
                  <dd className="text-foreground">{item.requiredDate}</dd>
                </div>
              )}
              {item.deliveryCityOrRegion && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Delivery Location</dt>
                  <dd className="text-foreground">{item.deliveryCityOrRegion}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Preferences */}
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Preferences</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {item.dietaryPreferences && item.dietaryPreferences.length > 0 && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Dietary</dt>
                  <dd className="text-foreground">{item.dietaryPreferences.join(', ')}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Sustainability</dt>
                <dd className="text-foreground">
                  {item.sustainabilityPreference ? 'Yes' : 'No'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Personalization</dt>
                <dd className="text-foreground">
                  {item.personalizationRequired ? 'Required' : 'Not required'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Branding</dt>
                <dd className="text-foreground">
                  {item.brandingRequired ? 'Required' : 'Not required'}
                </dd>
              </div>
              {item.preferredCategories && item.preferredCategories.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-muted-foreground">
                    Preferred Categories
                  </dt>
                  <dd className="flex flex-wrap gap-1.5 mt-1">
                    {item.preferredCategories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
                      >
                        {cat}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {item.productsToAvoid && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-muted-foreground">Products to Avoid</dt>
                  <dd className="text-foreground">{item.productsToAvoid}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Additional Notes */}
          {item.additionalNotes && (
            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Additional Notes</h2>
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {item.additionalNotes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Contact Information</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Company</dt>
                <dd className="text-foreground">{item.companyName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Name</dt>
                <dd className="text-foreground">{item.contactName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Email</dt>
                <dd className="text-foreground break-all">{item.email}</dd>
              </div>
              {item.phone && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Phone</dt>
                  <dd className="text-foreground">{item.phone}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Submission Details */}
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Submission Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Reference</dt>
                <dd className="text-foreground font-mono text-xs">{item.publicReference}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Source</dt>
                <dd className="text-foreground">{statusLabel(item.source)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Date</dt>
                <dd className="text-foreground">{formatDate(item.createdAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useFeedbackItems, useRecommendations } from '@/hooks/use-data';
import { LoadingState } from '@/components/LoadingState';
import type { SeedFeedback } from '@/data/seed-feedback';
import {
  FEEDBACK_TYPES,
  sanitizeCsvValue,
  BUDGET_RANGE_LABELS,
  type BudgetRange,
} from '@/domain/feedback';
import { formatDate, truncate } from '@/lib/format';

/* Status badge color map --------------------------------------------------- */

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

const TYPE_STYLES = 'bg-primary/10 text-primary';

function statusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function renderStars(rating?: number): React.ReactNode {
  if (rating == null) return <span className="text-muted-foreground">--</span>;
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

/* CSV Export ---------------------------------------------------------------- */

function exportFeedbackCsv(feedbackData: SeedFeedback[]) {
  const headers = [
    'Reference',
    'Type',
    'Category',
    'Title',
    'Message',
    'Rating',
    'Status',
    'Priority',
    'Sentiment',
    'Company',
    'Contact',
    'Email',
    'Anonymous',
    'Source',
    'Created',
  ];

  const rows = feedbackData.map((fb) => [
    sanitizeCsvValue(fb.publicReference),
    sanitizeCsvValue(FEEDBACK_TYPES[fb.type] ?? fb.type),
    sanitizeCsvValue(statusLabel(fb.category)),
    sanitizeCsvValue(fb.title),
    sanitizeCsvValue(truncate(fb.message, 500)),
    fb.rating != null ? String(fb.rating) : '',
    sanitizeCsvValue(statusLabel(fb.status)),
    sanitizeCsvValue(statusLabel(fb.priority)),
    sanitizeCsvValue(statusLabel(fb.sentiment)),
    sanitizeCsvValue(fb.companyName ?? ''),
    sanitizeCsvValue(fb.contactName ?? ''),
    sanitizeCsvValue(fb.email ?? ''),
    fb.anonymous ? 'Yes' : 'No',
    sanitizeCsvValue(fb.source),
    formatDate(fb.createdAt),
  ]);

  const csvContent =
    '﻿' +
    [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `gift-buddy-feedback-export-${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* Page --------------------------------------------------------------------- */

type Tab = 'feedback' | 'recommendations';

export default function FeedbackListPage() {
  const { data: allFeedback, loading: fLoading } = useFeedbackItems();
  const { data: allRecommendations, loading: rLoading } = useRecommendations();
  const [activeTab, setActiveTab] = useState<Tab>('feedback');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  /* Filtered feedback */
  const filteredFeedback = useMemo(() => {
    let items = [...allFeedback];
    if (statusFilter) items = items.filter((fb) => fb.status === statusFilter);
    if (priorityFilter) items = items.filter((fb) => fb.priority === priorityFilter);
    if (categoryFilter) items = items.filter((fb) => fb.category === categoryFilter);
    if (typeFilter) items = items.filter((fb) => fb.type === typeFilter);
    if (sentimentFilter) items = items.filter((fb) => fb.sentiment === sentimentFilter);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (fb) =>
          fb.title.toLowerCase().includes(q) ||
          (fb.companyName ?? '').toLowerCase().includes(q) ||
          (fb.contactName ?? '').toLowerCase().includes(q)
      );
    }
    return items;
  }, [allFeedback, statusFilter, priorityFilter, categoryFilter, typeFilter, sentimentFilter, search]);

  /* Filtered recommendations */
  const filteredRecommendations = useMemo(() => {
    let items = [...allRecommendations];
    if (statusFilter) items = items.filter((r) => r.status === statusFilter);
    if (priorityFilter) items = items.filter((r) => r.priority === priorityFilter);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) =>
          r.occasion.toLowerCase().includes(q) ||
          r.companyName.toLowerCase().includes(q) ||
          r.contactName.toLowerCase().includes(q)
      );
    }
    return items;
  }, [allRecommendations, statusFilter, priorityFilter, search]);

  if (fLoading || rLoading) return <LoadingState />;

  const resultCount =
    activeTab === 'feedback' ? filteredFeedback.length : filteredRecommendations.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feedback</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer feedback and recommendation requests
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportFeedbackCsv(allFeedback)}
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'feedback'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          All Feedback
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'recommendations'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Recommendations
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {(
            [
              'new',
              'triaged',
              'under_review',
              'planned',
              'accepted',
              'implemented',
              'responded',
              'closed',
              'duplicate',
              'rejected',
              'spam',
            ] as const
          ).map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          {(['low', 'normal', 'high', 'urgent'] as const).map((p) => (
            <option key={p} value={p}>
              {statusLabel(p)}
            </option>
          ))}
        </select>

        {activeTab === 'feedback' && (
          <>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {(
                [
                  'product',
                  'packaging',
                  'website',
                  'order_process',
                  'delivery',
                  'pricing',
                  'personalization',
                  'catalog_gap',
                  'corporate_service',
                  'other',
                ] as const
              ).map((c) => (
                <option key={c} value={c}>
                  {statusLabel(c)}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              aria-label="Filter by type"
            >
              <option value="">All Types</option>
              {Object.entries(FEEDBACK_TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              aria-label="Filter by sentiment"
            >
              <option value="">All Sentiments</option>
              {(
                ['positive', 'neutral', 'negative', 'mixed', 'not_classified'] as const
              ).map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by title, company, or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            aria-label="Search feedback"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {resultCount} {resultCount === 1 ? 'result' : 'results'}
      </p>

      {/* Feedback table */}
      {activeTab === 'feedback' && (
        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th className="px-5 py-3 font-medium text-muted-foreground">Reference</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Priority</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Rating</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Contact</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Created</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map((fb) => (
                  <tr
                    key={fb.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs">{fb.publicReference}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_STYLES}`}
                      >
                        {FEEDBACK_TYPES[fb.type] ?? fb.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 max-w-[200px]">
                      <span className="text-foreground truncate block" title={fb.title}>
                        {truncate(fb.title, 40)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[fb.status] ?? 'bg-muted text-muted-foreground'}`}
                      >
                        {statusLabel(fb.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[fb.priority] ?? 'bg-muted text-muted-foreground'}`}
                      >
                        {statusLabel(fb.priority)}
                      </span>
                    </td>
                    <td className="px-5 py-3">{renderStars(fb.rating)}</td>
                    <td className="px-5 py-3">
                      {fb.anonymous ? (
                        <span className="text-xs text-muted-foreground italic">Anonymous</span>
                      ) : (
                        <div>
                          <p className="text-foreground text-xs">{fb.contactName ?? '--'}</p>
                          {fb.companyName && (
                            <p className="text-xs text-muted-foreground">{fb.companyName}</p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">
                      {formatDate(fb.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/feedback/${fb.id}`}
                        className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredFeedback.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-muted-foreground">
                      No feedback matches your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations table */}
      {activeTab === 'recommendations' && (
        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th className="px-5 py-3 font-medium text-muted-foreground">Reference</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Occasion</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Recipients</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Budget</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Company</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Contact</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Created</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecommendations.map((rec) => (
                  <tr
                    key={rec.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs">{rec.publicReference}</td>
                    <td className="px-5 py-3 text-foreground capitalize">{rec.occasion}</td>
                    <td className="px-5 py-3 text-foreground">{rec.numberOfRecipients}</td>
                    <td className="px-5 py-3 text-foreground text-xs">
                      {BUDGET_RANGE_LABELS[rec.budgetPerRecipient as BudgetRange] ??
                        rec.budgetPerRecipient}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[rec.status] ?? 'bg-muted text-muted-foreground'}`}
                      >
                        {statusLabel(rec.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-foreground text-xs">{rec.companyName}</td>
                    <td className="px-5 py-3 text-foreground text-xs">{rec.contactName}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">
                      {formatDate(rec.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/feedback/${rec.id}`}
                        className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredRecommendations.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-muted-foreground">
                      No recommendation requests match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useYard } from '@/context/YardContext';
import type { TrailerStatus } from '@/types';
import {
  C, Card, CardHeader, Badge, BtnPrimary, BtnSecondary,
  CountPill, FormGroup, Divider, SectionTitle,
  Mono, Muted, LoadTag,
  inputStyle, selectStyle, TableHead, TableRow,
} from '@/components/ui';

const TRAILER_TYPES = [
  "53' Flatbed", "48' Flatbed", "45' Flatbed", "30' Flatbed",
  'Stepdeck', 'Specialized', 'Exp. Flatbed', "40' Chassis", "53' Chassis", 'Flatrack', 'Cakeboxx',
];
const STATUS_OPTIONS: { value: TrailerStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'loaded',    label: 'Loaded' },
  { value: 'red',       label: 'Red Tag — OOS' },
  { value: 'dot',       label: 'DOT Needed' },
  { value: 'out',       label: 'Out of Yard' },
];

const PAGE_SIZE = 30;

export default function TrailerInventory() {
  const { trailers, updateTrailerStatus, updateTrailerNotes, addTrailer } = useYard();

  const [search,   setSearch]   = useState('');
  const [fType,    setFType]    = useState('');
  const [fStatus,  setFStatus]  = useState('');
  const [page,     setPage]     = useState(1);
  const [editNotes, setEditNotes] = useState<string | null>(null); // trailer num being edited
  const [notesDraft, setNotesDraft] = useState('');
  const [showAdd, setShowAdd]   = useState(false);
  const [newTrailer, setNewTrailer] = useState({
    num: '', year: '', make: '', type: "53' Flatbed",
    status: 'available' as TrailerStatus, load: '', notes: '',
  });

  const filtered = trailers.filter(t => {
    const searchMatch = !search.trim() || t.num.toLowerCase().includes(search.trim().toLowerCase());
    const typeMatch   = !fType   || t.type === fType;
    const statusMatch = !fStatus || t.status === fStatus;
    return searchMatch && typeMatch && statusMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleStatusChange = (num: string, val: string) => {
    updateTrailerStatus(num, val as TrailerStatus);
  };

  const startEditNotes = (num: string, current: string) => {
    setEditNotes(num);
    setNotesDraft(current);
  };
  const saveNotes = (num: string) => {
    updateTrailerNotes(num, notesDraft);
    setEditNotes(null);
  };

  const handleAdd = () => {
    if (!newTrailer.num.trim()) return;
    addTrailer(newTrailer);
    setNewTrailer({ num: '', year: '', make: '', type: "53' Flatbed", status: 'available', load: '', notes: '' });
    setShowAdd(false);
  };

  const cols = '90px 80px 80px 1fr 155px 150px 80px';

  return (
    <Card>
      <CardHeader
        title="ATS trailer fleet — Jacksonville"
        subtitle="Full inventory. Search, filter, or update status inline."
        right={
          <>
            <CountPill>{trailers.length} trailers</CountPill>
            <BtnPrimary onClick={() => setShowAdd(v => !v)}>
              {showAdd ? 'Cancel' : '+ Add trailer'}
            </BtnPrimary>
          </>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 160 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: C.g400, pointerEvents: 'none' }}>
            ⌕
          </span>
          <input
            style={{ ...inputStyle, paddingLeft: 30 }}
            placeholder="Search trailer number…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select value={fType} onChange={e => { setFType(e.target.value); setPage(1); }} style={{ ...selectStyle, width: 160, fontSize: 12 }}>
          <option value="">All types</option>
          {TRAILER_TYPES.map(o => <option key={o}>{o}</option>)}
        </select>
        <select value={fStatus} onChange={e => { setFStatus(e.target.value); setPage(1); }} style={{ ...selectStyle, width: 155, fontSize: 12 }}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {(search || fType || fStatus) && (
          <BtnSecondary onClick={() => { setSearch(''); setFType(''); setFStatus(''); setPage(1); }}>
            Clear filters
          </BtnSecondary>
        )}
      </div>

      {/* Add trailer form */}
      {showAdd && (
        <div style={{ background: C.navyLight, border: `1px solid ${C.g200}`, borderLeft: `3px solid ${C.navy}`, borderRadius: 8, padding: '16px 18px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 12 }}>Add new trailer to fleet</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <FormGroup label="Trailer #">
              <input style={inputStyle} placeholder="Number" value={newTrailer.num} onChange={e => setNewTrailer(p => ({ ...p, num: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Year">
              <input style={inputStyle} placeholder="YYYY" value={newTrailer.year} onChange={e => setNewTrailer(p => ({ ...p, year: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Make">
              <input style={inputStyle} placeholder="Make" value={newTrailer.make} onChange={e => setNewTrailer(p => ({ ...p, make: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Type">
              <select style={selectStyle} value={newTrailer.type} onChange={e => setNewTrailer(p => ({ ...p, type: e.target.value }))}>
                {TRAILER_TYPES.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Status">
              <select style={selectStyle} value={newTrailer.status} onChange={e => setNewTrailer(p => ({ ...p, status: e.target.value as TrailerStatus }))}>
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Notes">
              <input style={inputStyle} placeholder="Optional" value={newTrailer.notes} onChange={e => setNewTrailer(p => ({ ...p, notes: e.target.value }))} />
            </FormGroup>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <BtnPrimary onClick={handleAdd}>Add trailer</BtnPrimary>
            <BtnSecondary onClick={() => setShowAdd(false)}>Cancel</BtnSecondary>
          </div>
        </div>
      )}

      {/* Results summary */}
      <div style={{ fontSize: 12, color: C.g400, marginBottom: 8 }}>
        Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} trailers
        {filtered.length !== trailers.length && ` (filtered from ${trailers.length})`}
      </div>

      {/* Table */}
      <TableHead cols={cols}>
        <span>Trailer #</span>
        <span>Year</span>
        <span>Make</span>
        <span>Type / Notes</span>
        <span>Status</span>
        <span>Update status</span>
        <span>Notes</span>
      </TableHead>

      {pageItems.map(t => (
        <TableRow
          key={t.num}
          cols={cols}
          hl={t.status === 'red' ? 'red' : t.status === 'dot' ? 'amber' : undefined}
        >
          <Mono>{t.num}</Mono>
          <Muted>{t.year || '—'}</Muted>
          <Muted>{t.make || '—'}</Muted>
          <span>
            {t.load
              ? <LoadTag>{t.load}</LoadTag>
              : <><Muted>{t.type}</Muted>{t.notes && <span style={{ marginLeft: 6, fontSize: 11, color: C.g400 }}>· {t.notes}</span>}</>
            }
          </span>
          <span><Badge type={t.status} /></span>
          <select
            value={t.status}
            onChange={e => handleStatusChange(t.num, e.target.value)}
            style={{ ...selectStyle, fontSize: 12 }}
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Inline notes edit */}
          <span>
            {editNotes === t.num ? (
              <div style={{ display: 'flex', gap: 4 }}>
                <input
                  autoFocus
                  style={{ ...inputStyle, fontSize: 11, padding: '4px 7px' }}
                  value={notesDraft}
                  onChange={e => setNotesDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveNotes(t.num); if (e.key === 'Escape') setEditNotes(null); }}
                />
                <button onClick={() => saveNotes(t.num)} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 5, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}>✓</button>
              </div>
            ) : (
              <button
                onClick={() => startEditNotes(t.num, t.notes)}
                title="Edit notes"
                style={{ background: 'transparent', border: `1px solid ${C.g200}`, color: C.g400, borderRadius: 5, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}
              >
                {t.notes || '+ note'}
              </button>
            )}
          </span>
        </TableRow>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, justifyContent: 'center' }}>
          <BtnSecondary onClick={() => setPage(p => Math.max(1, p - 1))} style={{ padding: '6px 14px' }}>
            ← Prev
          </BtnSecondary>
          <span style={{ fontSize: 12, color: C.g500 }}>
            Page {safePage} of {totalPages}
          </span>
          <BtnSecondary onClick={() => setPage(p => Math.min(totalPages, p + 1))} style={{ padding: '6px 14px' }}>
            Next →
          </BtnSecondary>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 20px', color: C.g400, fontSize: 13 }}>
          No trailers match the current filters.
        </div>
      )}
    </Card>
  );
}

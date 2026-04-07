'use client';

import { useState, useRef } from 'react';
import { useYard } from '@/context/YardContext';
import type { MechanicStatus } from '@/types';
import {
  C, Card, CardHeader, Badge, BtnPrimary, BtnSecondary, BtnSuccess, BtnDanger,
  CountPill, FormGroup, Divider, SectionTitle, Mono, Muted, Label,
  inputStyle, selectStyle, TableHead, TableRow,
} from '@/components/ui';

const STATUS_MAP: Record<string, MechanicStatus> = {
  'Red tag — out of service':  'redtag',
  'DOT inspection needed':     'dotn',
  'Cleared — back in service': 'cleared',
};

const TRAILER_TYPES = [
  "53' Flatbed", "30' Flatbed", "45' Flatbed", "48' Flatbed",
  'Stepdeck', 'Specialized', 'RGN', 'Flatrack', 'Cakeboxx',
];

export default function MechanicBoard() {
  const { mechanic, userInitials, addMechanicRecord, clearMechanicRecord, deleteMechanicRecord } = useYard();

  const [showCleared, setShowCleared] = useState(false);
  const [form, setForm] = useState({
    trailer: '', trailerType: "53' Flatbed", issue: '',
    statusLabel: 'Red tag — out of service', initials: '',
  });
  const formRef = useRef<HTMLDivElement>(null);

  const active  = mechanic.filter(r => r.status !== 'cleared');
  const cleared = mechanic.filter(r => r.status === 'cleared');

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = () => {
    if (!form.trailer.trim()) return;
    addMechanicRecord({
      trailer:     form.trailer,
      trailerType: form.trailerType,
      issue:       form.issue,
      status:      STATUS_MAP[form.statusLabel] ?? 'redtag',
      initials:    form.initials || userInitials,
    });
    setForm({ trailer: '', trailerType: "53' Flatbed", issue: '', statusLabel: 'Red tag — out of service', initials: '' });
  };

  const cols = '90px 120px 1fr 175px 100px 110px';

  return (
    <div>
      <Card>
        <CardHeader
          title="Mechanic board — red tags & repairs"
          subtitle="Digital red tag system — status changes sync to Trailer Inventory"
          right={
            <>
              <CountPill>{active.length} active</CountPill>
              <BtnPrimary onClick={scrollToForm}>+ Tag trailer</BtnPrimary>
            </>
          }
        />

        {/* Active red-tag/DOT banner */}
        {active.filter(r => r.status === 'redtag').length > 0 && (
          <div style={{
            background: C.redLight, border: `1px solid ${C.redMid}`,
            borderLeft: `4px solid ${C.red}`, borderRadius: 8,
            padding: '10px 14px', fontSize: 12, color: C.redDark, fontWeight: 500, marginBottom: 14,
          }}>
            {active.filter(r => r.status === 'redtag').length} red-tagged trailer{active.filter(r => r.status === 'redtag').length !== 1 ? 's' : ''} currently out of service.
            Clearing a record here will automatically set the trailer back to Available in inventory.
          </div>
        )}

        {active.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: C.g400, fontSize: 13 }}>
            No active red tags or DOT flags.
          </div>
        )}

        {active.length > 0 && (
          <>
            <TableHead cols={cols}>
              <span>Trailer</span>
              <span>Type</span>
              <span>Issue</span>
              <span>Status</span>
              <span>Logged</span>
              <span>Actions</span>
            </TableHead>
            {active.map(r => (
              <TableRow
                key={r.id}
                cols={cols}
                hl={r.status === 'redtag' ? 'red' : r.status === 'dotn' ? 'amber' : undefined}
              >
                <Mono>{r.trailer}</Mono>
                <Muted>{r.trailerType}</Muted>
                <Label>{r.issue}</Label>
                <Badge type={r.status} />
                <span>
                  {r.initials && (
                    <span style={{ background: C.navyLight, color: C.navy, fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginBottom: 3 }}>
                      {r.initials}
                    </span>
                  )}
                  <div style={{ fontSize: 10, color: C.g400 }}>{r.timestamp}</div>
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <BtnSuccess onClick={() => clearMechanicRecord(r.id)}>Clear</BtnSuccess>
                  <BtnDanger  onClick={() => deleteMechanicRecord(r.id)}>✕</BtnDanger>
                </div>
              </TableRow>
            ))}
          </>
        )}

        {/* Cleared records toggle */}
        {cleared.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => setShowCleared(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.g500, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              {showCleared ? '▾' : '▸'} {cleared.length} cleared record{cleared.length !== 1 ? 's' : ''}
            </button>
            {showCleared && (
              <div style={{ marginTop: 8, opacity: 0.7 }}>
                {cleared.map(r => (
                  <TableRow key={r.id} cols={cols}>
                    <Mono>{r.trailer}</Mono>
                    <Muted>{r.trailerType}</Muted>
                    <Muted>{r.issue}</Muted>
                    <Badge type="cleared" />
                    <Muted>{r.clearedAt ?? r.timestamp}</Muted>
                    <BtnDanger onClick={() => deleteMechanicRecord(r.id)}>Remove</BtnDanger>
                  </TableRow>
                ))}
              </div>
            )}
          </div>
        )}

        <Divider />

        <div ref={formRef}>
          <SectionTitle>Tag a trailer</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <FormGroup label="Trailer #">
              <input style={inputStyle} placeholder="Trailer number" value={form.trailer} onChange={e => setForm(p => ({ ...p, trailer: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Trailer type">
              <select style={selectStyle} value={form.trailerType} onChange={e => setForm(p => ({ ...p, trailerType: e.target.value }))}>
                {TRAILER_TYPES.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Issue / reason">
              <input style={inputStyle} placeholder="Describe the issue" value={form.issue} onChange={e => setForm(p => ({ ...p, issue: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Status">
              <select style={selectStyle} value={form.statusLabel} onChange={e => setForm(p => ({ ...p, statusLabel: e.target.value }))}>
                {Object.keys(STATUS_MAP).map(o => <option key={o}>{o}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Mechanic initials">
              <input
                style={inputStyle}
                placeholder={userInitials || 'e.g. J.D.'}
                maxLength={6}
                value={form.initials}
                onChange={e => setForm(p => ({ ...p, initials: e.target.value }))}
              />
            </FormGroup>
          </div>
          <div style={{ marginTop: 14 }}>
            <BtnPrimary onClick={handleSubmit}>Submit tag</BtnPrimary>
          </div>
        </div>
      </Card>
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
import { useYard } from '@/context/YardContext';
import type { InboundStatus } from '@/types';
import {
  C, Card, CardHeader, Badge, BtnPrimary, BtnSecondary, BtnSuccess, BtnDanger,
  FormGroup, Divider, SectionTitle,
  Mono, Muted, LoadTag, CountPill,
  inputStyle, selectStyle, TableHead, TableRow,
} from '@/components/ui';

const STATUS_OPTS: { value: InboundStatus; label: string }[] = [
  { value: 'arriving',   label: 'Arriving' },
  { value: 'inyard',     label: 'In yard' },
  { value: 'processing', label: 'Processing' },
  { value: 'complete',   label: 'Complete' },
];

const DISPOSITIONS = ['Storage', 'Transfer to outbound trailer', 'Transfer to PR port', 'Hold for sales'];

export default function InboundLoads() {
  const { inbound, addInbound, updateInboundStatus, completeInbound, deleteInbound } = useYard();

  const [showComplete, setShowComplete] = useState(false);
  const [form, setForm] = useState({ load: '', trailer: '', origin: '', disposition: 'Storage' });
  const formRef = useRef<HTMLDivElement>(null);

  const active    = inbound.filter(l => l.status !== 'complete');
  const completed = inbound.filter(l => l.status === 'complete');

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAdd = () => {
    if (!form.load.trim()) return;
    addInbound(form);
    setForm({ load: '', trailer: '', origin: '', disposition: 'Storage' });
  };

  const cols = '120px 100px 1fr 150px 160px 100px';

  return (
    <div>
      <Card>
        <CardHeader
          title="Inbound loads"
          subtitle="Loads arriving for storage or transfer"
          right={
            <>
              <CountPill>{active.length} active</CountPill>
              <BtnPrimary onClick={scrollToForm}>+ Log load</BtnPrimary>
            </>
          }
        />

        {active.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: C.g400, fontSize: 13 }}>
            No active inbound loads.
          </div>
        )}

        {active.length > 0 && (
          <>
            <TableHead cols={cols}>
              <span>Load #</span>
              <span>Trailer</span>
              <span>Origin</span>
              <span>Status</span>
              <span>Disposition</span>
              <span>Actions</span>
            </TableHead>
            {active.map(r => (
              <TableRow key={r.id} cols={cols}>
                <LoadTag>{r.load}</LoadTag>
                <Mono>{r.trailer}</Mono>
                <span>
                  <Muted>{r.origin}</Muted>
                  <div style={{ fontSize: 10, color: C.g400, marginTop: 2 }}>{r.timestamp}</div>
                </span>
                <select
                  value={r.status}
                  onChange={e => updateInboundStatus(r.id, e.target.value as InboundStatus)}
                  style={{ ...selectStyle, fontSize: 12 }}
                >
                  {STATUS_OPTS.filter(o => o.value !== 'complete').map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <Muted>{r.disposition}</Muted>
                <div style={{ display: 'flex', gap: 4 }}>
                  <BtnSuccess onClick={() => completeInbound(r.id)}>Done</BtnSuccess>
                  <BtnDanger  onClick={() => deleteInbound(r.id)}>✕</BtnDanger>
                </div>
              </TableRow>
            ))}
          </>
        )}

        {/* Completed loads toggle */}
        {completed.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => setShowComplete(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.g500, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              {showComplete ? '▾' : '▸'} {completed.length} completed load{completed.length !== 1 ? 's' : ''}
            </button>
            {showComplete && (
              <div style={{ marginTop: 8, opacity: 0.7 }}>
                {completed.map(r => (
                  <TableRow key={r.id} cols={cols}>
                    <LoadTag>{r.load}</LoadTag>
                    <Mono>{r.trailer}</Mono>
                    <Muted>{r.origin}</Muted>
                    <Badge type="complete" />
                    <Muted>{r.disposition}</Muted>
                    <BtnDanger onClick={() => deleteInbound(r.id)}>Remove</BtnDanger>
                  </TableRow>
                ))}
              </div>
            )}
          </div>
        )}

        <Divider />

        <div ref={formRef}>
          <SectionTitle>Log new inbound load</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <FormGroup label="Load #">
              <input style={inputStyle} placeholder="9071XXX" value={form.load} onChange={e => setForm(p => ({ ...p, load: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Trailer #">
              <input style={inputStyle} placeholder="Trailer number" value={form.trailer} onChange={e => setForm(p => ({ ...p, trailer: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Origin city">
              <input style={inputStyle} placeholder="City, State" value={form.origin} onChange={e => setForm(p => ({ ...p, origin: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Disposition">
              <select style={selectStyle} value={form.disposition} onChange={e => setForm(p => ({ ...p, disposition: e.target.value }))}>
                {DISPOSITIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormGroup>
            <FormGroup label=" ">
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                <BtnPrimary onClick={handleAdd}>Log load</BtnPrimary>
              </div>
            </FormGroup>
          </div>
        </div>
      </Card>
    </div>
  );
}

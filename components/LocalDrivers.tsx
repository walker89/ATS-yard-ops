'use client';

import { useState, useRef } from 'react';
import { useYard } from '@/context/YardContext';
import type { AssignmentStatus } from '@/types';
import {
  C, Card, CardHeader, Badge, BtnPrimary, BtnSecondary, BtnSuccess, BtnDanger,
  CountPill, FormGroup, Divider, SectionTitle, InfoBanner, Mono, Muted,
  inputStyle, selectStyle,
} from '@/components/ui';

const RETURN_OPTS = ['Return to yard', 'Return to port', 'Transfer load — hold for dispatch'];
const STATUS_OPTS: { value: AssignmentStatus; label: string }[] = [
  { value: 'assigned', label: 'Assigned' },
  { value: 'staging',  label: 'Staging' },
  { value: 'ready',    label: 'Ready' },
  { value: 'returned', label: 'Returned' },
];

export default function LocalDrivers() {
  const { local, addLocalAssignment, updateLocalStatus, deleteLocalAssignment } = useYard();

  const [showReturned, setShowReturned] = useState(false);
  const [form, setForm] = useState({ trailer: '', dest: '', ret: 'Return to yard', driver: '' });
  const formRef = useRef<HTMLDivElement>(null);

  const active   = local.filter(a => a.status !== 'returned');
  const returned = local.filter(a => a.status === 'returned');

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAssign = () => {
    if (!form.trailer.trim()) return;
    addLocalAssignment(form);
    setForm({ trailer: '', dest: '', ret: 'Return to yard', driver: '' });
  };

  return (
    <div>
      <Card>
        <CardHeader
          title="Outbound trailers — local driver pickup"
          subtitle="Empty trailers staged for drivers heading out of town"
          right={
            <>
              <CountPill>{active.length} active</CountPill>
              <BtnPrimary onClick={scrollToForm}>+ Assign trailer</BtnPrimary>
            </>
          }
        />

        <InfoBanner>
          Local drivers use empty outbound trailers to pick up loads from other cities.
          Those loads are then returned to the yard or taken directly to the port.
        </InfoBanner>

        {active.length === 0 && (
          <div style={{ textAlign: 'center', padding: '16px 0', color: C.g400, fontSize: 13 }}>
            No active driver assignments.
          </div>
        )}

        {active.map(a => (
          <div key={a.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px',
            background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 8, marginBottom: 8,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: C.navyLight, border: `2px solid ${C.navy}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600,
              color: C.navy, flexShrink: 0,
            }}>
              {a.trailer}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{a.dest}</div>
              <div style={{ fontSize: 12, color: C.g500, marginTop: 2 }}>{a.ret}</div>
              <div style={{ fontSize: 10, color: C.g400, marginTop: 2 }}>{a.timestamp}</div>
            </div>
            <div style={{ fontSize: 12, color: C.g500 }}>{a.driver}</div>
            <select
              value={a.status}
              onChange={e => updateLocalStatus(a.id, e.target.value as AssignmentStatus)}
              style={{ ...selectStyle, fontSize: 12, width: 130 }}
            >
              {STATUS_OPTS.filter(o => o.value !== 'returned').map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: 4 }}>
              <BtnSuccess onClick={() => updateLocalStatus(a.id, 'returned')}>Returned</BtnSuccess>
              <BtnDanger  onClick={() => deleteLocalAssignment(a.id)}>✕</BtnDanger>
            </div>
          </div>
        ))}

        {/* Returned toggle */}
        {returned.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => setShowReturned(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.g500, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              {showReturned ? '▾' : '▸'} {returned.length} returned driver{returned.length !== 1 ? 's' : ''}
            </button>
            {showReturned && (
              <div style={{ marginTop: 8 }}>
                {returned.map(a => (
                  <div key={a.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px',
                    background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 8, marginBottom: 6, opacity: 0.65,
                  }}>
                    <Mono>{a.trailer}</Mono>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: C.g700 }}>{a.dest}</div>
                      <Muted>{a.driver}</Muted>
                    </div>
                    <Badge type="returned" />
                    <BtnDanger onClick={() => deleteLocalAssignment(a.id)}>Remove</BtnDanger>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Divider />

        <div ref={formRef}>
          <SectionTitle>Stage trailer for local run</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <FormGroup label="Trailer #">
              <input style={inputStyle} placeholder="Trailer number" value={form.trailer} onChange={e => setForm(p => ({ ...p, trailer: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Destination city">
              <input style={inputStyle} placeholder="City, State" value={form.dest} onChange={e => setForm(p => ({ ...p, dest: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Return destination">
              <select style={selectStyle} value={form.ret} onChange={e => setForm(p => ({ ...p, ret: e.target.value }))}>
                {RETURN_OPTS.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Driver name">
              <input style={inputStyle} placeholder="Full name" value={form.driver} onChange={e => setForm(p => ({ ...p, driver: e.target.value }))} />
            </FormGroup>
            <FormGroup label=" ">
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                <BtnPrimary onClick={handleAssign}>Assign</BtnPrimary>
              </div>
            </FormGroup>
          </div>
        </div>
      </Card>
    </div>
  );
}

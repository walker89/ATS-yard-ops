'use client';

import { useState, useRef } from 'react';
import { useYard } from '@/context/YardContext';
import type { OutboundStatus } from '@/types';
import {
  C, Card, CardHeader, Badge, BtnPrimary, BtnSecondary, BtnSuccess, BtnDanger,
  PRTag, FormGroup, Divider, SectionTitle,
  Mono, Muted, LoadTag, CountPill,
  inputStyle, selectStyle, TableHead, TableRow,
} from '@/components/ui';

const STATUS_OPTS: { value: OutboundStatus; label: string }[] = [
  { value: 'scheduling', label: 'Scheduling' },
  { value: 'loading',    label: 'Loading' },
  { value: 'staged',     label: 'Staged' },
  { value: 'readyport',  label: 'Ready for port' },
  { value: 'departed',   label: 'Departed' },
];

export default function OutboundPR() {
  const { outbound, addOutbound, updateOutboundStatus, departOutbound, deleteOutbound } = useYard();

  const [showDeparted, setShowDeparted] = useState(false);
  const [form, setForm] = useState({ load: '', trailer: '', cargo: '', eta: '' });
  const formRef = useRef<HTMLDivElement>(null);

  const active   = outbound.filter(s => s.status !== 'departed');
  const departed = outbound.filter(s => s.status === 'departed');

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAdd = () => {
    if (!form.load.trim()) return;
    addOutbound(form);
    setForm({ load: '', trailer: '', cargo: '', eta: '' });
  };

  const cols = '120px 100px 1fr 160px 100px 110px';
  const colsMobile = '1fr';
  const colsTablet = '120px 100px 1fr 120px';
  const colsDesktop = '120px 100px 1fr 160px 100px 110px';

  return (
    <div>
      <Card>
        <CardHeader
          title="Outbound loads — Puerto Rico shipping"
          subtitle="Trailers prepared for port departure"
          right={
            <>
              <CountPill>{active.length} active</CountPill>
              <BtnPrimary onClick={scrollToForm}>+ Add outbound</BtnPrimary>
            </>
          }
        />

        {active.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: C.g400, fontSize: 13 }}>
            No active outbound shipments.
          </div>
        )}

        {active.length > 0 && (
          <>
            {/* Desktop Header */}
            <TableHead cols={colsDesktop} className="hidden lg:grid">
              <span>Load #</span>
              <span>Trailer</span>
              <span>Cargo</span>
              <span>Status</span>
              <span>Port ETA</span>
              <span>Actions</span>
            </TableHead>

            {/* Tablet Header */}
            <TableHead cols={colsTablet} className="hidden md:grid lg:hidden">
              <span>Load #</span>
              <span>Trailer</span>
              <span>Cargo / Status</span>
              <span>Actions</span>
            </TableHead>

            {active.map(s => (
              <>
                {/* Desktop Row */}
                <TableRow key={s.id} cols={colsDesktop} className="hidden lg:grid">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <LoadTag>{s.load}</LoadTag>
                  </span>
                  <Mono>{s.trailer}</Mono>
                  <span>
                    <span style={{ fontWeight: 500, fontSize: 13, color: C.g700 }}>{s.cargo}</span>
                    <div style={{ fontSize: 10, color: C.g400, marginTop: 2 }}>{s.timestamp}</div>
                  </span>
                  <select
                    value={s.status}
                    onChange={e => updateOutboundStatus(s.id, e.target.value as OutboundStatus)}
                    style={{ ...selectStyle, fontSize: 12 }}
                  >
                    {STATUS_OPTS.filter(o => o.value !== 'departed').map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <PRTag />
                    <Muted>{s.eta}</Muted>
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <BtnSuccess onClick={() => departOutbound(s.id)}>Departed</BtnSuccess>
                    <BtnDanger  onClick={() => deleteOutbound(s.id)}>✕</BtnDanger>
                  </div>
                </TableRow>

                {/* Tablet Row */}
                <TableRow key={`${s.id}-tablet`} cols={colsTablet} className="hidden md:grid lg:hidden">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <LoadTag>{s.load}</LoadTag>
                  </span>
                  <Mono>{s.trailer}</Mono>
                  <span>
                    <div style={{ fontWeight: 500, fontSize: 13, color: C.g700 }}>{s.cargo}</div>
                    <div style={{ marginTop: 4 }}>
                      <select
                        value={s.status}
                        onChange={e => updateOutboundStatus(s.id, e.target.value as OutboundStatus)}
                        style={{ ...selectStyle, fontSize: 12 }}
                      >
                        {STATUS_OPTS.filter(o => o.value !== 'departed').map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <PRTag />
                      <Muted>{s.eta}</Muted>
                    </div>
                    <div style={{ fontSize: 10, color: C.g400, marginTop: 2 }}>{s.timestamp}</div>
                  </span>
                  <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
                    <BtnSuccess onClick={() => departOutbound(s.id)}>Departed</BtnSuccess>
                    <BtnDanger  onClick={() => deleteOutbound(s.id)}>✕</BtnDanger>
                  </div>
                </TableRow>

                {/* Mobile Card */}
                <div
                  key={`${s.id}-mobile`}
                  className="md:hidden"
                  style={{
                    background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 8,
                    padding: '14px', marginBottom: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                        <LoadTag>{s.load}</LoadTag>
                      </span>
                      <Mono>{s.trailer}</Mono>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <BtnSuccess onClick={() => departOutbound(s.id)}>Departed</BtnSuccess>
                      <BtnDanger  onClick={() => deleteOutbound(s.id)}>✕</BtnDanger>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 500, fontSize: 13, color: C.g700 }}>{s.cargo}</span>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <PRTag />
                      <Muted>ETA: {s.eta}</Muted>
                    </span>
                    <div style={{ fontSize: 10, color: C.g400, marginTop: 2 }}>{s.timestamp}</div>
                  </div>
                  <select
                    value={s.status}
                    onChange={e => updateOutboundStatus(s.id, e.target.value as OutboundStatus)}
                    style={{ ...selectStyle, fontSize: 12, width: '100%' }}
                  >
                    {STATUS_OPTS.filter(o => o.value !== 'departed').map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </>
            ))}
          </>
        )}

        {/* Departed toggle */}
        {departed.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => setShowDeparted(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.g500, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              {showDeparted ? '▾' : '▸'} {departed.length} departed shipment{departed.length !== 1 ? 's' : ''}
            </button>
            {showDeparted && (
              <div style={{ marginTop: 8, opacity: 0.7 }}>
                {/* Desktop Header for Departed */}
                <TableHead cols={colsDesktop} className="hidden lg:grid">
                  <span>Load #</span>
                  <span>Trailer</span>
                  <span>Cargo</span>
                  <span>Status</span>
                  <span>Port ETA</span>
                  <span>Actions</span>
                </TableHead>

                {/* Tablet Header for Departed */}
                <TableHead cols={colsTablet} className="hidden md:grid lg:hidden">
                  <span>Load #</span>
                  <span>Trailer</span>
                  <span>Cargo / Status</span>
                  <span>Actions</span>
                </TableHead>

                {departed.map(s => (
                  <>
                    {/* Desktop Departed Row */}
                    <TableRow key={s.id} cols={colsDesktop} className="hidden lg:grid">
                      <LoadTag>{s.load}</LoadTag>
                      <Mono>{s.trailer}</Mono>
                      <Muted>{s.cargo}</Muted>
                      <Badge type="departed" />
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <PRTag />
                        <Muted>{s.eta}</Muted>
                      </span>
                      <BtnDanger onClick={() => deleteOutbound(s.id)}>Remove</BtnDanger>
                    </TableRow>

                    {/* Tablet Departed Row */}
                    <TableRow key={`${s.id}-tablet`} cols={colsTablet} className="hidden md:grid lg:hidden">
                      <LoadTag>{s.load}</LoadTag>
                      <Mono>{s.trailer}</Mono>
                      <span>
                        <div><Muted>{s.cargo}</Muted></div>
                        <div style={{ marginTop: 4 }}><Badge type="departed" /></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <PRTag />
                          <Muted>{s.eta}</Muted>
                        </div>
                      </span>
                      <BtnDanger onClick={() => deleteOutbound(s.id)}>Remove</BtnDanger>
                    </TableRow>

                    {/* Mobile Departed Card */}
                    <div
                      key={`${s.id}-mobile`}
                      className="md:hidden"
                      style={{
                        background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 8,
                        padding: '14px', marginBottom: 8, opacity: 0.7,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <LoadTag>{s.load}</LoadTag>
                          <div style={{ marginTop: 4 }}><Mono>{s.trailer}</Mono></div>
                        </div>
                        <BtnDanger onClick={() => deleteOutbound(s.id)}>Remove</BtnDanger>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Muted>Cargo: {s.cargo}</Muted>
                      </div>
                      <div>
                        <Badge type="departed" />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <PRTag />
                          <Muted>ETA: {s.eta}</Muted>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            )}
          </div>
        )}

        <Divider />

        <div ref={formRef}>
          <SectionTitle>Add outbound shipment</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <FormGroup label="Load #">
              <input style={inputStyle} placeholder="9071XXX" value={form.load} onChange={e => setForm(p => ({ ...p, load: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Trailer #">
              <input style={inputStyle} placeholder="Trailer number" value={form.trailer} onChange={e => setForm(p => ({ ...p, trailer: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Cargo description">
              <input style={inputStyle} placeholder="Describe cargo" value={form.cargo} onChange={e => setForm(p => ({ ...p, cargo: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Port ETA">
              <input style={inputStyle} type="date" value={form.eta} onChange={e => setForm(p => ({ ...p, eta: e.target.value }))} />
            </FormGroup>
            <FormGroup label=" ">
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                <BtnPrimary onClick={handleAdd}>Add shipment</BtnPrimary>
              </div>
            </FormGroup>
          </div>
        </div>
      </Card>
    </div>
  );
}

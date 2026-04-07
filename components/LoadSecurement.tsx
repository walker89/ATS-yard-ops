'use client';

import { useState, useRef } from 'react';
import { useYard } from '@/context/YardContext';
import {
  C, Card, CardHeader, BtnPrimary, BtnSecondary, BtnDanger, CountPill,
  FormGroup, Divider, SectionTitle, Mono, Muted, LoadTag,
  inputStyle, selectStyle,
} from '@/components/ui';

const SECUREMENT_TYPES = ['Chains', 'Straps', 'Chains + Straps', 'Wire rope', 'Blocked & braced', 'Chains + Blocked'];

export default function LoadSecurement() {
  const { securement, userInitials, addSecurement, deleteSecurement } = useYard();

  const [form, setForm] = useState({
    trailer: '', load: '', type: 'Chains', count: '',
    tarp: 'no', tarpCount: '', bungees: '', edge: 'No', notes: '',
  });
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = () => {
    if (!form.trailer.trim() || !form.load.trim()) return;
    addSecurement({
      trailer: form.trailer,
      load: '#' + form.load.replace('#', ''),
      type: form.type,
      count: Number(form.count) || 0,
      tarps: form.tarp === 'yes' ? (Number(form.tarpCount) || 0) : 0,
      bungees: Number(form.bungees) || 0,
      edge: form.edge,
      notes: form.notes,
      initials: userInitials,
    });
    setForm({ trailer: '', load: '', type: 'Chains', count: '', tarp: 'no', tarpCount: '', bungees: '', edge: 'No', notes: '' });
  };

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    const headers = ['Trailer', 'Load #', 'Securement Type', 'Count', 'Tarps', 'Bungees', 'Edge Protectors', 'Notes', 'Initials', 'Timestamp'];
    const rows = securement.map(r => [
      r.trailer, r.load, r.type, r.count, r.tarps, r.bungees, r.edge,
      `"${r.notes.replace(/"/g, '""')}"`, r.initials, r.timestamp,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `securement-records-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Form */}
      <Card>
        <CardHeader
          title="Load securement form"
          subtitle="Log chain, strap and tarp details for each load"
          right={<CountPill>Replaces manual entry</CountPill>}
        />
        <div ref={formRef}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <FormGroup label="Trailer #">
              <input style={inputStyle} placeholder="Trailer number" value={form.trailer} onChange={e => setForm(p => ({ ...p, trailer: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Load #">
              <input style={inputStyle} placeholder="9071XXX" value={form.load} onChange={e => setForm(p => ({ ...p, load: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Securement type">
              <select style={selectStyle} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                {SECUREMENT_TYPES.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="# of securements">
              <input style={inputStyle} type="number" placeholder="0" min="0" value={form.count} onChange={e => setForm(p => ({ ...p, count: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Tarp required?">
              <select style={selectStyle} value={form.tarp} onChange={e => setForm(p => ({ ...p, tarp: e.target.value }))}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </FormGroup>
            {form.tarp === 'yes' && (
              <FormGroup label="# of tarps">
                <input style={inputStyle} type="number" placeholder="0" min="0" value={form.tarpCount} onChange={e => setForm(p => ({ ...p, tarpCount: e.target.value }))} />
              </FormGroup>
            )}
            <FormGroup label="Bungees used">
              <input style={inputStyle} type="number" placeholder="0" min="0" value={form.bungees} onChange={e => setForm(p => ({ ...p, bungees: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Edge protectors?">
              <select style={selectStyle} value={form.edge} onChange={e => setForm(p => ({ ...p, edge: e.target.value }))}>
                <option>No</option>
                <option>Yes</option>
              </select>
            </FormGroup>
            <FormGroup label="Initials">
              <input style={inputStyle} placeholder={userInitials || 'e.g. J.D.'} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </FormGroup>
            <div style={{ gridColumn: '1 / -1' }}>
              <FormGroup label="Load notes / special instructions">
                <textarea
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                  rows={2}
                  placeholder="e.g. oversized, requires escort, fragile..."
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                />
              </FormGroup>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <BtnPrimary onClick={handleSubmit}>Submit securement record</BtnPrimary>
            <BtnSecondary onClick={() => setForm({ trailer: '', load: '', type: 'Chains', count: '', tarp: 'no', tarpCount: '', bungees: '', edge: 'No', notes: '' })}>
              Clear form
            </BtnSecondary>
          </div>
        </div>
      </Card>

      {/* Records */}
      <Card>
        <CardHeader
          title="Securement records"
          subtitle="All logged entries for this session"
          right={
            <>
              <CountPill>{securement.length} records</CountPill>
              <BtnSecondary onClick={handleExportCSV} style={{ fontSize: 12 }}>Export CSV</BtnSecondary>
              <BtnSecondary onClick={handlePrint} style={{ fontSize: 12 }}>Print</BtnSecondary>
            </>
          }
        />

        {securement.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: C.g400, fontSize: 13 }}>
            No records yet. Submit the form above to log securement.
          </div>
        )}

        {securement.length > 0 && (
          <div id="securement-print-area">
            <div style={{
              display: 'grid', gridTemplateColumns: '80px 110px 1fr 60px 60px 70px 80px 80px 70px',
              gap: 10, padding: '6px 14px', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase', color: C.g400, marginBottom: 6,
            }}>
              <span>Trailer</span>
              <span>Load #</span>
              <span>Securement</span>
              <span>Count</span>
              <span>Tarps</span>
              <span>Bungees</span>
              <span>Edge</span>
              <span>By</span>
              <span>Remove</span>
            </div>
            {securement.map(r => (
              <div key={r.id} style={{
                display: 'grid', gridTemplateColumns: '80px 110px 1fr 60px 60px 70px 80px 80px 70px',
                gap: 10, padding: '10px 14px', background: C.g50,
                border: `1px solid ${C.g200}`, borderRadius: 8,
                alignItems: 'center', fontSize: 13, marginBottom: 6,
              }}>
                <Mono>{r.trailer}</Mono>
                <LoadTag>{r.load}</LoadTag>
                <span>
                  <Muted>{r.type}</Muted>
                  {r.notes && <div style={{ fontSize: 11, color: C.g400, marginTop: 2 }}>{r.notes}</div>}
                </span>
                <span style={{ fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{r.count}</span>
                <span style={{ fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{r.tarps}</span>
                <span style={{ fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{r.bungees}</span>
                <Muted>{r.edge}</Muted>
                <span>
                  {r.initials && (
                    <span style={{ background: C.navyLight, color: C.navy, fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4 }}>
                      {r.initials}
                    </span>
                  )}
                  <div style={{ fontSize: 10, color: C.g400, marginTop: 2 }}>{r.timestamp}</div>
                </span>
                <BtnDanger onClick={() => deleteSecurement(r.id)}>✕</BtnDanger>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

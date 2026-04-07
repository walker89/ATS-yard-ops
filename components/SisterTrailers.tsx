'use client';

import { useState, useRef } from 'react';
import { useYard } from '@/context/YardContext';
import type { SisterStatus } from '@/types';
import {
  C, Card, CardHeader, Badge, BtnPrimary, BtnSecondary, BtnDanger,
  CountPill, FormGroup, Divider, SectionTitle, Mono, Muted,
  inputStyle, selectStyle, TableHead, TableRow,
} from '@/components/ui';

const COMPANIES = ['ATS Logistics', 'ATS International', 'ATS Brokerage', 'Other'];
const TRAILER_TYPES = ['Flatbed', 'Stepdeck', 'RGN', 'Stretch Flatbed', "30' Flatbed", "45' Flatbed"];
const STATUS_OPTS: { value: SisterStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'loaded',    label: 'Loaded' },
  { value: 'pending',   label: 'Pending pickup' },
  { value: 'hold',      label: 'On hold' },
];

export default function SisterTrailers() {
  const { sister, addSisterTrailer, updateSisterStatus, removeSisterTrailer } = useYard();

  const [showRemoved, setShowRemoved] = useState(false);
  const [removed, setRemoved] = useState<string[]>([]); // track removed IDs for undo (optional)
  const [form, setForm] = useState({ num: '', company: 'ATS Logistics', type: 'Flatbed', notes: '', status: 'available' as SisterStatus });
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLog = () => {
    if (!form.num.trim()) return;
    addSisterTrailer(form);
    setForm({ num: '', company: 'ATS Logistics', type: 'Flatbed', notes: '', status: 'available' });
  };

  const cols = '100px 160px 120px 1fr 150px 80px';

  return (
    <div>
      <Card>
        <CardHeader
          title="Sister company trailers in yard"
          subtitle="Trailers from ATS partner companies currently on-site"
          right={
            <>
              <CountPill>{sister.length} on-site</CountPill>
              <BtnPrimary onClick={scrollToForm}>+ Log trailer</BtnPrimary>
            </>
          }
        />

        {sister.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: C.g400, fontSize: 13 }}>
            No sister company trailers logged.
          </div>
        )}

        {sister.length > 0 && (
          <>
            <TableHead cols={cols}>
              <span>Trailer #</span>
              <span>Company</span>
              <span>Type</span>
              <span>Location / Notes</span>
              <span>Status</span>
              <span>Remove</span>
            </TableHead>
            {sister.map(t => (
              <TableRow key={t.id} cols={cols}>
                <Mono>{t.num}</Mono>
                <span style={{ fontWeight: 500, fontSize: 13, color: C.navy }}>{t.company}</span>
                <Muted>{t.type}</Muted>
                <span>
                  <Muted>{t.notes}</Muted>
                  <div style={{ fontSize: 10, color: C.g400, marginTop: 2 }}>{t.timestamp}</div>
                </span>
                <select
                  value={t.status}
                  onChange={e => updateSisterStatus(t.id, e.target.value as SisterStatus)}
                  style={{ ...selectStyle, fontSize: 12 }}
                >
                  {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <BtnDanger onClick={() => removeSisterTrailer(t.id)}>Check out</BtnDanger>
              </TableRow>
            ))}
          </>
        )}

        <Divider />

        <div ref={formRef}>
          <SectionTitle>Log incoming sister company trailer</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <FormGroup label="Trailer #">
              <input style={inputStyle} placeholder="TR-XXXX" value={form.num} onChange={e => setForm(p => ({ ...p, num: e.target.value }))} />
            </FormGroup>
            <FormGroup label="Company">
              <select style={selectStyle} value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}>
                {COMPANIES.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Trailer type">
              <select style={selectStyle} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                {TRAILER_TYPES.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Location / notes">
              <input style={inputStyle} placeholder="Where parked, notes" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </FormGroup>
            <FormGroup label=" ">
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                <BtnPrimary onClick={handleLog}>Log trailer</BtnPrimary>
              </div>
            </FormGroup>
          </div>
        </div>
      </Card>
    </div>
  );
}

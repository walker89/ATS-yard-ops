'use client';

import { useState, useEffect } from 'react';
import { C, inputStyle } from '@/components/ui';
import { useYard } from '@/context/YardContext';
import Dashboard from '@/components/Dashboard';
import TrailerInventory from '@/components/TrailerInventory';
import InboundLoads from '@/components/InboundLoads';
import OutboundPR from '@/components/OutboundPR';
import LoadSecurement from '@/components/LoadSecurement';
import MechanicBoard from '@/components/MechanicBoard';
import LocalDrivers from '@/components/LocalDrivers';
import SisterTrailers from '@/components/SisterTrailers';

const TABS = [
  { id: 'dashboard',   label: 'Dashboard' },
  { id: 'trailers',    label: 'Trailer Inventory' },
  { id: 'inbound',     label: 'Inbound Loads' },
  { id: 'outbound',    label: 'Outbound / Puerto Rico' },
  { id: 'securement',  label: 'Load Securement' },
  { id: 'mechanic',    label: 'Mechanic Board' },
  { id: 'local',       label: 'Local Drivers' },
  { id: 'sister',      label: 'Sister Co. Trailers' },
];

export default function AppShell() {
  const [tab, setTab] = useState('dashboard');
  const [date, setDate] = useState('');
  const { userInitials, setUserInitials } = useYard();

  useEffect(() => {
    const d = new Date();
    setDate(d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: C.g50, minHeight: '100vh', color: C.g900 }}>

      {/* ── Header ── */}
      <div style={{
        background: C.navy, height: 56, display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 16, position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }} className="no-print">
        <span style={{
          background: C.red, color: '#fff', fontWeight: 600, fontSize: 13,
          letterSpacing: '0.08em', padding: '5px 12px', borderRadius: 6,
        }}>
          ATS
        </span>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.15)' }} />
        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: 500 }}>
          Yard Operations Center
        </span>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* User initials input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Initials:</span>
            <input
              value={userInitials}
              onChange={e => setUserInitials(e.target.value.toUpperCase().slice(0, 5))}
              placeholder="e.g. J.D."
              style={{
                ...inputStyle,
                width: 64, padding: '4px 8px', fontSize: 12,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', borderRadius: 6,
              }}
            />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
            {date}
          </span>
          <span style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 500,
            padding: '4px 12px', borderRadius: 6,
          }}>
            Jacksonville Yard
          </span>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div style={{
        background: C.white, borderBottom: `1.5px solid ${C.g200}`,
        display: 'flex', padding: '0 24px', overflowX: 'auto',
        position: 'sticky', top: 56, zIndex: 99,
        boxShadow: '0 1px 3px rgba(27,42,74,0.07)',
      }} className="no-print">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '14px 18px', fontSize: 13, fontWeight: 500,
              fontFamily: 'inherit', whiteSpace: 'nowrap',
              color: tab === t.id ? C.red : C.g500,
              borderBottom: tab === t.id ? `2px solid ${C.red}` : '2px solid transparent',
              transition: 'color 0.15s', letterSpacing: '0.01em',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }} className="page-enter">
        {tab === 'dashboard'  && <Dashboard />}
        {tab === 'trailers'   && <TrailerInventory />}
        {tab === 'inbound'    && <InboundLoads />}
        {tab === 'outbound'   && <OutboundPR />}
        {tab === 'securement' && <LoadSecurement />}
        {tab === 'mechanic'   && <MechanicBoard />}
        {tab === 'local'      && <LocalDrivers />}
        {tab === 'sister'     && <SisterTrailers />}
      </div>
    </div>
  );
}

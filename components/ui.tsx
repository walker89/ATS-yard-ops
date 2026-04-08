'use client';

import React from 'react';

// ─── Color tokens ────────────────────────────────────────────────────────────
export const C = {
  navy: '#1B2A4A', navyMid: '#253B65', navyLight: '#EBF0F8',
  red: '#C8102E', redDark: '#9E0B22', redLight: '#FDEAED', redMid: '#F5B8C2',
  green: '#1A7A4A', greenBg: '#E8F5EE', greenMid: '#A8D8BC',
  blue: '#1558A8', blueBg: '#EBF2FB', blueMid: '#A0C0E8',
  amber: '#A05A00', amberBg: '#FFF4E0', amberMid: '#F5C878',
  purple: '#6B3FA0', purpleBg: '#F3EDFB', purpleMid: '#D4B8F0',
  g50: '#F8F9FB', g100: '#F0F2F6', g200: '#E2E6EE', g300: '#C8CEDC',
  g400: '#9AA3B8', g500: '#6B7590', g700: '#374162', g900: '#1A1F35',
  white: '#FFFFFF',
} as const;

// ─── Badge ───────────────────────────────────────────────────────────────────
const BADGE_STYLES: Record<string, { bg: string; color: string; border: string; dot: string; label: string }> = {
  available:   { bg: C.greenBg,  color: C.green,   border: C.greenMid,  dot: C.green,   label: 'Available' },
  loaded:      { bg: C.blueBg,   color: C.blue,    border: C.blueMid,   dot: C.blue,    label: 'Loaded' },
  red:         { bg: C.redLight, color: C.redDark, border: C.redMid,    dot: C.red,     label: 'Red tag — OOS' },
  dot:         { bg: C.amberBg,  color: C.amber,   border: C.amberMid,  dot: C.amber,   label: 'DOT needed' },
  out:         { bg: C.purpleBg, color: C.purple,  border: C.purpleMid, dot: C.purple,  label: 'Out of yard' },
  arriving:    { bg: C.blueBg,   color: C.blue,    border: C.blueMid,   dot: C.blue,    label: 'Arriving' },
  inyard:      { bg: C.greenBg,  color: C.green,   border: C.greenMid,  dot: C.green,   label: 'In yard' },
  processing:  { bg: C.amberBg,  color: C.amber,   border: C.amberMid,  dot: C.amber,   label: 'Processing' },
  complete:    { bg: C.g100,     color: C.g500,    border: C.g300,      dot: C.g400,    label: 'Complete' },
  readyport:   { bg: C.greenBg,  color: C.green,   border: C.greenMid,  dot: C.green,   label: 'Ready for port' },
  loading:     { bg: C.amberBg,  color: C.amber,   border: C.amberMid,  dot: C.amber,   label: 'Loading' },
  staged:      { bg: C.blueBg,   color: C.blue,    border: C.blueMid,   dot: C.blue,    label: 'Staged' },
  scheduling:  { bg: C.amberBg,  color: C.amber,   border: C.amberMid,  dot: C.amber,   label: 'Scheduling' },
  departed:    { bg: C.g100,     color: C.g500,    border: C.g300,      dot: C.g400,    label: 'Departed' },
  redtag:      { bg: C.redLight, color: C.redDark, border: C.redMid,    dot: C.red,     label: 'Red tag — OOS' },
  dotn:        { bg: C.amberBg,  color: C.amber,   border: C.amberMid,  dot: C.amber,   label: 'DOT needed' },
  cleared:     { bg: C.greenBg,  color: C.green,   border: C.greenMid,  dot: C.green,   label: 'Cleared' },
  ready:       { bg: C.greenBg,  color: C.green,   border: C.greenMid,  dot: C.green,   label: 'Ready' },
  staging:     { bg: C.amberBg,  color: C.amber,   border: C.amberMid,  dot: C.amber,   label: 'Staging' },
  assigned:    { bg: C.blueBg,   color: C.blue,    border: C.blueMid,   dot: C.blue,    label: 'Assigned' },
  returned:    { bg: C.g100,     color: C.g500,    border: C.g300,      dot: C.g400,    label: 'Returned' },
  pending:     { bg: C.amberBg,  color: C.amber,   border: C.amberMid,  dot: C.amber,   label: 'Pending pickup' },
  hold:        { bg: C.purpleBg, color: C.purple,  border: C.purpleMid, dot: C.purple,  label: 'On hold' },
};

export function Badge({ type, label }: { type: string; label?: string }) {
  const s = BADGE_STYLES[type] ?? BADGE_STYLES.available;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {label ?? s.label}
    </span>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.g200}`, borderRadius: 12,
      padding: '20px 22px', marginBottom: 18,
      boxShadow: '0 1px 3px rgba(27,42,74,0.07)', ...style,
    }}>
      {children}
    </div>
  );
}

export function CardHeader({
  title, subtitle, right,
}: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.g900 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: C.g400, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{right}</div>}
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
export function StatCard({ label, value, color, sub }: { label: string; value: number | string; color?: string; sub?: string }) {
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.g200}`, borderRadius: 12,
      padding: '16px 18px', boxShadow: '0 1px 3px rgba(27,42,74,0.07)',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: C.g400, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: color ?? C.g900, lineHeight: 1, fontFamily: "'DM Mono', monospace" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: C.g400, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── Buttons ─────────────────────────────────────────────────────────────────
export function BtnPrimary({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{
      background: C.red, color: '#fff', border: 'none',
      padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
      fontFamily: "'DM Sans', system-ui, sans-serif", cursor: 'pointer',
      whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(200,16,46,0.22)', ...style,
    }}>
      {children}
    </button>
  );
}

export function BtnSecondary({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{
      background: C.white, color: C.g700, border: `1.5px solid ${C.g200}`,
      padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
      fontFamily: "'DM Sans', system-ui, sans-serif", cursor: 'pointer', whiteSpace: 'nowrap', ...style,
    }}>
      {children}
    </button>
  );
}

export function BtnDanger({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', color: C.redDark, border: `1px solid ${C.redMid}`,
      padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
      fontFamily: "'DM Sans', system-ui, sans-serif", cursor: 'pointer', whiteSpace: 'nowrap',
    }}>
      {children}
    </button>
  );
}

export function BtnSuccess({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', color: C.green, border: `1px solid ${C.greenMid}`,
      padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
      fontFamily: "'DM Sans', system-ui, sans-serif", cursor: 'pointer', whiteSpace: 'nowrap',
    }}>
      {children}
    </button>
  );
}

// ─── Form primitives ─────────────────────────────────────────────────────────
export const inputStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13,
  color: C.g900, background: C.white,
  border: `1.5px solid ${C.g200}`, borderRadius: 8,
  padding: '9px 12px', width: '100%', outline: 'none',
};

export const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none', WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239AA3B8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 30,
};

export function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.g500 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Typography helpers ───────────────────────────────────────────────────────
export const Mono = ({ children, style, ...props }: { children: React.ReactNode; style?: React.CSSProperties } & React.HTMLAttributes<HTMLSpanElement>) => (
  <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, fontSize: 13, color: C.g900, ...style }} {...props}>{children}</span>
);
export const Muted = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: C.g500, fontSize: 12 }}>{children}</span>
);
export const Label = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontWeight: 500, color: C.g700 }}>{children}</span>
);
export const LoadTag = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: C.blue, background: C.blueBg, padding: '2px 7px', borderRadius: 4 }}>
    {children}
  </span>
);
export const PRTag = () => (
  <span style={{ background: C.navy, color: 'rgba(255,255,255,0.9)', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 4 }}>
    Puerto Rico
  </span>
);
export const CountPill = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontSize: 11, fontWeight: 600, color: C.g500, background: C.g100, padding: '3px 10px', borderRadius: 20, border: `1px solid ${C.g200}` }}>
    {children}
  </span>
);
export const Divider = () => (
  <div style={{ height: 1, background: C.g200, margin: '18px 0' }} />
);
export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: C.g700, marginBottom: 12 }}>
    {children}<span style={{ flex: 1, height: 1, background: C.g200 }} />
  </div>
);
export const InfoBanner = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 13, color: C.g500, marginBottom: 14, lineHeight: 1.6, padding: '10px 14px', background: C.navyLight, borderLeft: `3px solid ${C.navy}`, borderRadius: '0 8px 8px 0' }}>
    {children}
  </div>
);

// ─── Table header / row ───────────────────────────────────────────────────────
export function TableHead({ cols, children, className, style }: { cols: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: cols, gap: 10,
      padding: '6px 14px', fontSize: 10, fontWeight: 700,
      letterSpacing: '0.07em', textTransform: 'uppercase', color: C.g400, marginBottom: 6,
      ...style,
    }} className={className}>
      {children}
    </div>
  );
}

export function TableRow({
  cols, hl, children, className, style,
}: { cols: string; hl?: 'red' | 'amber'; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const bg   = hl === 'red' ? C.redLight : hl === 'amber' ? C.amberBg : C.g50;
  const bc   = hl === 'red' ? C.redMid   : hl === 'amber' ? C.amberMid : C.g200;
  const bl   = hl === 'red' ? `3px solid ${C.red}` : hl === 'amber' ? `3px solid ${C.amber}` : `1px solid ${C.g200}`;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: cols, gap: 10,
      padding: '10px 14px', background: bg, border: `1px solid ${bc}`,
      borderLeft: bl, borderRadius: 8, alignItems: 'center', fontSize: 13, marginBottom: 6,
      ...style,
    }} className={className}>
      {children}
    </div>
  );
}

'use client';

import { useYard } from '@/context/YardContext';
import { C, StatCard, Card, CardHeader, Badge, PRTag, Muted } from '@/components/ui';

export default function Dashboard() {
  const { trailers, inbound, outbound, recentActivity } = useYard();

  // Compute all stats from live state
  const total    = trailers.length;
  const avail    = trailers.filter(t => t.status === 'available').length;
  const loaded   = trailers.filter(t => t.status === 'loaded').length;
  const redCount = trailers.filter(t => t.status === 'red').length;
  const dotCount = trailers.filter(t => t.status === 'dot').length;
  const outCount = trailers.filter(t => t.status === 'out').length;
  const inboundActive  = inbound.filter(l => l.status !== 'complete').length;
  const prOutbound     = outbound.filter(s => s.status !== 'departed').length;

  // Outbound staged/ready for pickup panel
  const readyShipments = outbound.filter(s =>
    s.status === 'readyport' || s.status === 'staged' || s.status === 'loading'
  );

  return (
    <div>
      {/* Red-tag alert banner */}
      {redCount > 0 && (
        <div style={{
          background: C.redLight, border: `1px solid ${C.redMid}`,
          borderLeft: `4px solid ${C.red}`, borderRadius: 8,
          padding: '11px 16px', display: 'flex', alignItems: 'center',
          gap: 10, fontSize: 13, color: C.redDark, fontWeight: 500, marginBottom: 20,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.red, flexShrink: 0, animation: 'pulse 2s infinite' }} />
          {redCount} trailer{redCount !== 1 ? 's' : ''} currently tagged red — out of service.
          Sales team: verify inventory availability before booking.
        </div>
      )}

      {/* Stat grid — responsive: 4 cols on mobile, 8 on wide */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <StatCard label="Total Trailers"  value={total}    sub="Fleet total" />
        <StatCard label="Available"       value={avail}    color={C.green}  sub="Ready to load" />
        <StatCard label="Loaded"          value={loaded}   color={C.blue}   sub="Assigned loads" />
        <StatCard label="Red Tagged"      value={redCount} color={C.red}    sub="Out of service" />
        <StatCard label="DOT Due"         value={dotCount} color={C.amber}  sub="Needs inspection" />
        <StatCard label="Out / Missing"   value={outCount} color={C.amber}  sub="Not in yard" />
        <StatCard label="Inbound Active"  value={inboundActive}             sub="Open loads" />
        <StatCard label="PR Outbound"     value={prOutbound}                sub="Port-bound" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent activity — live, drawn from context */}
        <Card>
          <CardHeader title="Recent activity" subtitle="Status changes & new records" />
          {recentActivity.length === 0 && (
            <div style={{ padding: '24px 0', textAlign: 'center', color: C.g400, fontSize: 13 }}>
              No activity yet — changes will appear here.
            </div>
          )}
          {recentActivity.slice(0, 8).map(ev => (
            <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, fontSize: 13, minWidth: 52, color: C.g900 }}>
                {ev.trailerNum}
              </span>
              <Badge type={ev.badgeType} label={ev.label} />
              {ev.initials && (
                <span style={{ fontSize: 11, background: C.navyLight, color: C.navy, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                  {ev.initials}
                </span>
              )}
              <span style={{ fontSize: 11, color: C.g400, marginLeft: 'auto', fontFamily: "'DM Mono', monospace" }}>
                {ev.timestamp}
              </span>
            </div>
          ))}
        </Card>

        {/* Outbound — ready for pickup */}
        <Card>
          <CardHeader
            title="Outbound — ready for pickup"
            subtitle="Staged & awaiting port departure"
          />
          {readyShipments.length === 0 && (
            <div style={{ padding: '24px 0', textAlign: 'center', color: C.g400, fontSize: 13 }}>
              No shipments staged or ready.
            </div>
          )}
          {readyShipments.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.g200}`, background: C.g50, marginBottom: 8 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, fontSize: 13, minWidth: 52 }}>
                {s.trailer}
              </span>
              <PRTag />
              <span style={{ fontSize: 12, color: C.g700, flex: 1 }}>{s.cargo}</span>
              <Badge type={s.status} />
              <Muted>ETA {s.eta}</Muted>
            </div>
          ))}
        </Card>
      </div>

      {/* Fleet breakdown by type */}
      <Card style={{ marginTop: 4 }}>
        <CardHeader title="Fleet snapshot by type" subtitle="Live count from trailer inventory" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            "53' Flatbed", "Stepdeck", "30' Flatbed", "45' Flatbed",
            "Specialized", "Exp. Flatbed", "40' Chassis", "53' Chassis", "Flatrack", "Cakeboxx",
          ].map(type => {
            const all   = trailers.filter(t => t.type === type);
            const avl   = all.filter(t => t.status === 'available').length;
            const oos   = all.filter(t => t.status === 'red' || t.status === 'dot').length;
            if (all.length === 0) return null;
            return (
              <div key={type} style={{
                background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 10,
                padding: '12px 14px',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.g500, marginBottom: 6 }}>{type}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600, color: C.g900 }}>
                  {all.length}
                </div>
                <div style={{ fontSize: 11, color: C.g400, marginTop: 4 }}>
                  <span style={{ color: C.green }}>{avl} avail</span>
                  {oos > 0 && <span style={{ color: C.red, marginLeft: 6 }}>{oos} OOS</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

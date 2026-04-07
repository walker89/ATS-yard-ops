'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  Trailer, TrailerStatus,
  InboundLoad, InboundStatus,
  OutboundShipment, OutboundStatus,
  SecurementRecord,
  MechanicRecord, MechanicStatus,
  LocalAssignment, AssignmentStatus,
  SisterTrailer, SisterStatus,
  ActivityEvent,
} from '@/types';
import {
  INITIAL_TRAILERS,
  INITIAL_INBOUND,
  INITIAL_OUTBOUND,
  INITIAL_SECUREMENT,
  INITIAL_MECHANIC,
  INITIAL_LOCAL,
  INITIAL_SISTER,
} from '@/data/initial';

function now() {
  return new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

interface YardContextValue {
  // State
  trailers: Trailer[];
  inbound: InboundLoad[];
  outbound: OutboundShipment[];
  securement: SecurementRecord[];
  mechanic: MechanicRecord[];
  local: LocalAssignment[];
  sister: SisterTrailer[];
  recentActivity: ActivityEvent[];
  userInitials: string;

  // Trailer actions
  updateTrailerStatus: (num: string, status: TrailerStatus) => void;
  updateTrailerNotes: (num: string, notes: string) => void;
  addTrailer: (t: Omit<Trailer, 'lastUpdated' | 'updatedBy'>) => void;

  // Inbound actions
  addInbound: (load: Omit<InboundLoad, 'id' | 'timestamp' | 'status'>) => void;
  updateInboundStatus: (id: string, status: InboundStatus) => void;
  completeInbound: (id: string) => void;
  deleteInbound: (id: string) => void;

  // Outbound actions
  addOutbound: (s: Omit<OutboundShipment, 'id' | 'timestamp' | 'status'>) => void;
  updateOutboundStatus: (id: string, status: OutboundStatus) => void;
  departOutbound: (id: string) => void;
  deleteOutbound: (id: string) => void;

  // Securement actions
  addSecurement: (r: Omit<SecurementRecord, 'id' | 'timestamp'>) => void;
  deleteSecurement: (id: string) => void;

  // Mechanic actions
  addMechanicRecord: (r: Omit<MechanicRecord, 'id' | 'timestamp'>) => void;
  clearMechanicRecord: (id: string) => void;
  deleteMechanicRecord: (id: string) => void;

  // Local driver actions
  addLocalAssignment: (a: Omit<LocalAssignment, 'id' | 'timestamp' | 'status'>) => void;
  updateLocalStatus: (id: string, status: AssignmentStatus) => void;
  deleteLocalAssignment: (id: string) => void;

  // Sister trailer actions
  addSisterTrailer: (t: Omit<SisterTrailer, 'id' | 'timestamp'>) => void;
  updateSisterStatus: (id: string, status: SisterStatus) => void;
  removeSisterTrailer: (id: string) => void;

  // User
  setUserInitials: (initials: string) => void;
}

const YardContext = createContext<YardContextValue | null>(null);

export function YardProvider({ children }: { children: React.ReactNode }) {
  const [trailers, setTrailers] = useState<Trailer[]>(INITIAL_TRAILERS);
  const [inbound, setInbound] = useState<InboundLoad[]>(INITIAL_INBOUND);
  const [outbound, setOutbound] = useState<OutboundShipment[]>(INITIAL_OUTBOUND);
  const [securement, setSecurement] = useState<SecurementRecord[]>(INITIAL_SECUREMENT);
  const [mechanic, setMechanic] = useState<MechanicRecord[]>(INITIAL_MECHANIC);
  const [local, setLocal] = useState<LocalAssignment[]>(INITIAL_LOCAL);
  const [sister, setSister] = useState<SisterTrailer[]>(INITIAL_SISTER);
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([
    { id: '1', trailerNum: '24008', action: 'Red tagged — airbags',      badgeType: 'red',       label: 'Red — OOS',     timestamp: '2h ago' },
    { id: '2', trailerNum: '24026', action: 'Loaded #9071158',           badgeType: 'loaded',    label: 'Loaded',        timestamp: '4h ago' },
    { id: '3', trailerNum: '49641', action: 'DOT inspection flagged',    badgeType: 'dot',       label: 'DOT Needed',    timestamp: 'Yesterday' },
    { id: '4', trailerNum: '24019', action: 'Cleared — back in service', badgeType: 'available', label: 'Available',     timestamp: 'Yesterday' },
  ]);
  const [userInitials, setUserInitials] = useState('');

  const logActivity = useCallback((event: Omit<ActivityEvent, 'id'>) => {
    setRecentActivity(prev => [{ id: uid(), ...event }, ...prev].slice(0, 25));
  }, []);

  // Trailer actions
  const updateTrailerStatus = useCallback((num: string, status: TrailerStatus) => {
    setTrailers(prev => prev.map(t =>
      t.num === num ? { ...t, status, lastUpdated: now(), updatedBy: userInitials || undefined } : t
    ));
    const statusLabels: Record<TrailerStatus, string> = {
      available: 'Available', loaded: 'Loaded', red: 'Red — OOS', dot: 'DOT Needed', out: 'Out of Yard',
    };
    logActivity({ trailerNum: num, action: `Status → ${statusLabels[status]}`, badgeType: status === 'dot' ? 'dot' : status, label: statusLabels[status], timestamp: now(), initials: userInitials });
  }, [userInitials, logActivity]);

  const updateTrailerNotes = useCallback((num: string, notes: string) => {
    setTrailers(prev => prev.map(t => t.num === num ? { ...t, notes } : t));
  }, []);

  const addTrailer = useCallback((t: Omit<Trailer, 'lastUpdated' | 'updatedBy'>) => {
    setTrailers(prev => [...prev, { ...t, lastUpdated: now(), updatedBy: userInitials || undefined }]);
    logActivity({ trailerNum: t.num, action: 'Added to fleet', badgeType: t.status, label: t.status, timestamp: now(), initials: userInitials });
  }, [userInitials, logActivity]);

  // Inbound actions
  const addInbound = useCallback((load: Omit<InboundLoad, 'id' | 'timestamp' | 'status'>) => {
    setInbound(prev => [...prev, { id: uid(), ...load, status: 'inyard', timestamp: now() }]);
  }, []);

  const updateInboundStatus = useCallback((id: string, status: InboundStatus) => {
    setInbound(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  }, []);

  const completeInbound = useCallback((id: string) => {
    setInbound(prev => prev.map(l => l.id === id ? { ...l, status: 'complete' } : l));
  }, []);

  const deleteInbound = useCallback((id: string) => {
    setInbound(prev => prev.filter(l => l.id !== id));
  }, []);

  // Outbound actions
  const addOutbound = useCallback((s: Omit<OutboundShipment, 'id' | 'timestamp' | 'status'>) => {
    setOutbound(prev => [...prev, { id: uid(), ...s, status: 'scheduling', timestamp: now() }]);
  }, []);

  const updateOutboundStatus = useCallback((id: string, status: OutboundStatus) => {
    setOutbound(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  }, []);

  const departOutbound = useCallback((id: string) => {
    setOutbound(prev => prev.map(s => s.id === id ? { ...s, status: 'departed' } : s));
  }, []);

  const deleteOutbound = useCallback((id: string) => {
    setOutbound(prev => prev.filter(s => s.id !== id));
  }, []);

  // Securement actions
  const addSecurement = useCallback((r: Omit<SecurementRecord, 'id' | 'timestamp'>) => {
    setSecurement(prev => [{ id: uid(), ...r, initials: r.initials || userInitials, timestamp: now() }, ...prev]);
  }, [userInitials]);

  const deleteSecurement = useCallback((id: string) => {
    setSecurement(prev => prev.filter(r => r.id !== id));
  }, []);

  // Mechanic actions
  const addMechanicRecord = useCallback((r: Omit<MechanicRecord, 'id' | 'timestamp'>) => {
    const record: MechanicRecord = { id: uid(), ...r, initials: r.initials || userInitials, timestamp: now() };
    setMechanic(prev => [record, ...prev]);
    // Sync trailer status
    if (r.status === 'redtag') {
      setTrailers(prev => prev.map(t => t.num === r.trailer ? { ...t, status: 'red', lastUpdated: now() } : t));
      logActivity({ trailerNum: r.trailer, action: `Red tagged — ${r.issue}`, badgeType: 'red', label: 'Red — OOS', timestamp: now(), initials: r.initials || userInitials });
    } else if (r.status === 'dotn') {
      setTrailers(prev => prev.map(t => t.num === r.trailer ? { ...t, status: 'dot', lastUpdated: now() } : t));
      logActivity({ trailerNum: r.trailer, action: 'DOT inspection flagged', badgeType: 'dot', label: 'DOT Needed', timestamp: now(), initials: r.initials || userInitials });
    }
  }, [userInitials, logActivity]);

  const clearMechanicRecord = useCallback((id: string) => {
    setMechanic(prev => prev.map(r => {
      if (r.id !== id) return r;
      // Sync trailer back to available
      setTrailers(t => t.map(tr => tr.num === r.trailer ? { ...tr, status: 'available', lastUpdated: now() } : tr));
      logActivity({ trailerNum: r.trailer, action: 'Cleared — back in service', badgeType: 'available', label: 'Available', timestamp: now(), initials: userInitials });
      return { ...r, status: 'cleared' as MechanicStatus, clearedAt: now() };
    }));
  }, [userInitials, logActivity]);

  const deleteMechanicRecord = useCallback((id: string) => {
    setMechanic(prev => prev.filter(r => r.id !== id));
  }, []);

  // Local driver actions
  const addLocalAssignment = useCallback((a: Omit<LocalAssignment, 'id' | 'timestamp' | 'status'>) => {
    setLocal(prev => [...prev, { id: uid(), ...a, status: 'assigned', timestamp: now() }]);
  }, []);

  const updateLocalStatus = useCallback((id: string, status: AssignmentStatus) => {
    setLocal(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const deleteLocalAssignment = useCallback((id: string) => {
    setLocal(prev => prev.filter(a => a.id !== id));
  }, []);

  // Sister trailer actions
  const addSisterTrailer = useCallback((t: Omit<SisterTrailer, 'id' | 'timestamp'>) => {
    setSister(prev => [...prev, { id: uid(), ...t, timestamp: now() }]);
  }, []);

  const updateSisterStatus = useCallback((id: string, status: SisterStatus) => {
    setSister(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }, []);

  const removeSisterTrailer = useCallback((id: string) => {
    setSister(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <YardContext.Provider value={{
      trailers, inbound, outbound, securement, mechanic, local, sister, recentActivity, userInitials,
      updateTrailerStatus, updateTrailerNotes, addTrailer,
      addInbound, updateInboundStatus, completeInbound, deleteInbound,
      addOutbound, updateOutboundStatus, departOutbound, deleteOutbound,
      addSecurement, deleteSecurement,
      addMechanicRecord, clearMechanicRecord, deleteMechanicRecord,
      addLocalAssignment, updateLocalStatus, deleteLocalAssignment,
      addSisterTrailer, updateSisterStatus, removeSisterTrailer,
      setUserInitials,
    }}>
      {children}
    </YardContext.Provider>
  );
}

export function useYard() {
  const ctx = useContext(YardContext);
  if (!ctx) throw new Error('useYard must be used within YardProvider');
  return ctx;
}

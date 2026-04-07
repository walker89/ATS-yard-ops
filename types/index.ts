export type TrailerStatus = 'available' | 'loaded' | 'red' | 'dot' | 'out';

export interface Trailer {
  num: string;
  year: string;
  make: string;
  type: string;
  status: TrailerStatus;
  load: string;
  notes: string;
  lastUpdated?: string;
  updatedBy?: string;
}

export type InboundStatus = 'arriving' | 'inyard' | 'processing' | 'complete';

export interface InboundLoad {
  id: string;
  load: string;
  trailer: string;
  origin: string;
  status: InboundStatus;
  disposition: string;
  timestamp: string;
}

export type OutboundStatus = 'scheduling' | 'loading' | 'staged' | 'readyport' | 'departed';

export interface OutboundShipment {
  id: string;
  load: string;
  trailer: string;
  cargo: string;
  status: OutboundStatus;
  eta: string;
  timestamp: string;
}

export interface SecurementRecord {
  id: string;
  trailer: string;
  load: string;
  type: string;
  count: number;
  tarps: number;
  bungees: number;
  edge: string;
  notes: string;
  timestamp: string;
  initials: string;
}

export type MechanicStatus = 'redtag' | 'dotn' | 'cleared';

export interface MechanicRecord {
  id: string;
  trailer: string;
  trailerType: string;
  issue: string;
  status: MechanicStatus;
  initials: string;
  timestamp: string;
  clearedAt?: string;
}

export type AssignmentStatus = 'assigned' | 'staging' | 'ready' | 'returned';

export interface LocalAssignment {
  id: string;
  trailer: string;
  dest: string;
  ret: string;
  driver: string;
  status: AssignmentStatus;
  timestamp: string;
}

export type SisterStatus = 'available' | 'loaded' | 'pending' | 'hold';

export interface SisterTrailer {
  id: string;
  num: string;
  company: string;
  type: string;
  notes: string;
  status: SisterStatus;
  timestamp: string;
}

export interface ActivityEvent {
  id: string;
  trailerNum: string;
  action: string;
  badgeType: string;
  label: string;
  timestamp: string;
  initials?: string;
}

export interface ActivePole {
  enforcers: string[];
  lawyersActivePole: string[];
}

export interface PassivePole {
  defendants: string[];
  lawyersPassivePole: string[];
}

export interface ProcessCharacteristics {
  processNumber: string;
  courtClass: string;
  subject: string;
  referenceProcess: string;
  jurisdiction: string;
  assessment: string;
  lastDistribution: string;
  municipalityOfProcess: string;
  nativeClass: string;
  causeValue: string;
  justiceSecret: string;
  justiceFree: string;
  guardianshipInjunction: string;
  priority: string;
  judgingBody: string;
  judicialPosition: string;
  competence: string;
}

export interface Process {
  processCharacteristics: ProcessCharacteristics;
  activePole: ActivePole;
  passivePole: PassivePole;
}

export interface ProcessCSV {
  processNumber: string;
  courtClass: string;
  subject: string;
  referenceProcess: string;
  jurisdiction: string;
  assessment: string;
  lastDistribution: string;
  causeValue: string;
  justiceSecret: string;
  justiceFree: string;
  guardianshipInjunction: string;
  priority: string;
  judgingBody: string;
  judicialPosition: string;
  competence: string;
  enforcers: string;
  quantEnforcers: string;
  lawyersActivePole: string;
  defendants: string;
  lawyersPassivePole: string;
  nativeClass: string;
  municipalityOfProcess: string;
}

// lista cronologica
export interface ISearchMG {
  input: string;
  hinput: string;
}
export interface ITJMGList {
  chronologicalOrder: string;
  openSuspended: string;
  value: string;
  NProcess: string;
  NSEI: string;
  origin: string;
  action: string;
  saleOff: string;
  protocolDateTime: string;
  protocolNumberYear: string;
}

export interface LogEntry {
  timestamp: string;
  icon: string;
  title: string;
  tool: string;
  input?: string;
  result: string;
  status: string;
}

let lastTrace: LogEntry[] = [];
let lastUpdated: string = "";

export const saveTrace = (trace: LogEntry[]) => {
  lastTrace = trace;
  lastUpdated = new Date().toLocaleTimeString();
};

export const getTrace = () => ({
  trace: [...lastTrace],
  lastUpdated
});

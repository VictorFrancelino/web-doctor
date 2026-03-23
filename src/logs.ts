export enum DiagnosticLevel {
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info'
};

export type DiagnosticLog = {
	type: DiagnosticLevel;
	title: string;
	msg: string;
}

export function addLog(
	logList: DiagnosticLog[],
	{ type, title, msg }: DiagnosticLog
): void {
	const logExists = logList.some(log => log.title === title);
	if (!logExists) logList.push({ type, title, msg });
}

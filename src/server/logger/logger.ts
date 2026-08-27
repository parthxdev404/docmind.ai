type LogContext = Record<string, unknown>;

function formatContext(context?: LogContext) {
  if (!context || Object.keys(context).length === 0) {
    return '';
  }

  return `${JSON.stringify(context)}`;
}

export const logger = {
  info(message: string, context?: LogContext) {
    console.log(
      `[INFO] ${new Date().toISOString()} - ${message}${formatContext(context)}`,
    );
  },

  warn(message: string, context?: LogContext) {
    console.warn(
      `[WARN] ${new Date().toISOString()} - ${message}${formatContext(context)}`,
    );
  },

  error(message: string, context?: LogContext) {
    console.error(
      `[ERROR] ${new Date().toISOString()} - ${message}${formatContext(context)}`,
    );
  },

  debug(message: string, context?: LogContext) {
    console.debug(
      `[DEBUG] ${new Date().toISOString()} - ${message}${formatContext(context)}`,
    );
  },
};

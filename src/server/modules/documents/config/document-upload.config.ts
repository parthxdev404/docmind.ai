export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20 MB

export const ALLOWED_DOCUMENT_EXTENSIONS = new Set([
  '.pdf',
  '.docx',
  '.txt',
  '.md',

  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.py',
  '.java',
  '.c',
  '.cpp',
  '.cs',
  '.go',
  '.rs',
]);

export const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
]);

export const MAX_FILENAME_LENGTH = 255;

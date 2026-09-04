import path from 'node:path';

import {
  ALLOWED_DOCUMENT_EXTENSIONS,
  ALLOWED_DOCUMENT_MIME_TYPES,
  MAX_DOCUMENT_SIZE,
  MAX_FILENAME_LENGTH,
} from '../config/document-upload.config';

export interface DocumentFileInput {
  originalName: string;
  mimeType: string;
  size: number;
}

export function validateDocumentFile(file: DocumentFileInput): void {
  validateFilename(file.originalName);
  validateFileSize(file.size);

  const extension = path.extname(file.originalName).toLowerCase();

  validateExtension(extension);
  validateMimeType(extension, file.mimeType);
}

function validateFilename(filename: string): void {
  if (!filename || !filename.trim()) {
    throw new Error('Filename is required');
  }

  if (filename.length > MAX_FILENAME_LENGTH) {
    throw new Error('Filename is too long');
  }

  if (
    filename.includes('\0') ||
    filename.includes('/') ||
    filename.includes('\\')
  ) {
    throw new Error('Invalid filename');
  }
}

function validateFileSize(size: number): void {
  if (!Number.isFinite(size) || size <= 0) {
    throw new Error('Invalid file size');
  }

  if (size > MAX_DOCUMENT_SIZE) {
    throw new Error('File size exceeds the allowed limit');
  }
}

function validateExtension(extension: string): void {
  if (!extension) {
    throw new Error('File extension is required');
  }

  if (!ALLOWED_DOCUMENT_EXTENSIONS.has(extension)) {
    throw new Error('Unsupported file type');
  }
}

function validateMimeType(extension: string, mimeType: string): void {
  const normalizedMimeType = mimeType.split(';')[0].trim().toLowerCase();

  const codeExtensions = new Set([
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

  // Source-code files commonly arrive as text/plain
  // or another generic MIME type.
  if (codeExtensions.has(extension)) {
    return;
  }

  if (!ALLOWED_DOCUMENT_MIME_TYPES.has(normalizedMimeType)) {
    throw new Error('Invalid MIME type');
  }
}

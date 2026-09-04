import { DocumentModel } from '@/server/models/document.model';

export async function createDocument(data: {
  userId: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  extension: string;
  size: number;
}) {
  return DocumentModel.create(data);
}

export async function findDocumentById(documentId: string) {
  return DocumentModel.findById(documentId);
}

export async function findDocumentByIdAndUser(
  documentId: string,
  userId: string,
) {
  return DocumentModel.findOne({
    _id: documentId,
    userId,
  });
}

export async function findUserDocuments(
  userId: string,
  options?: {
    status?: 'UPLOADED' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    limit?: number;
    skip?: number;
  },
) {
  const filter = {
    userId,
    ...(options?.status && {
      status: options.status,
    }),
  };

  return DocumentModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(options?.skip ?? 0)
    .limit(options?.limit ?? 20);
}

export async function updateDocumentStatus(
  documentId: string,
  status: 'UPLOADED' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED',
  processingError?: string | null,
) {
  return DocumentModel.findByIdAndUpdate(
    documentId,
    {
      $set: {
        status,
        processingError: processingError ?? null,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
}

export async function deleteDocumentByIdAndUser(
  documentId: string,
  userId: string,
) {
  return DocumentModel.findOneAndDelete({
    _id: documentId,
    userId,
  });
}

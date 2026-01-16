// src/core/entities/Material.ts

export interface Material {
    id: string;
    unitId: string;
    fileName: string;
    fileType: string;
    content: string; // Texto extraído do arquivo
    createdAt: string;
}

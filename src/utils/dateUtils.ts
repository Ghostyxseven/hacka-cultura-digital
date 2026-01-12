/**
 * Utilitários para manipulação de dados
 */

/**
 * Faz o parse de uma string JSON e converte strings de data ISO em objetos Date.
 * Útil para recuperar dados do LocalStorage onde as datas são salvas como string.
 * 
 * @param jsonString String JSON a ser parseada
 * @returns Objeto ou array parseado com datas convertidas, ou array vazio com erro
 */
export function parseJSONWithDates<T>(jsonString: string | null): T[] {
    if (!jsonString) return [];

    try {
        const data = JSON.parse(jsonString);

        if (Array.isArray(data)) {
            return data.map(item => convertDates(item));
        }

        return [convertDates(data)] as unknown as T[];
    } catch (error) {
        console.error('Erro ao parsear JSON:', error);
        return [];
    }
}

/**
 * Percorre recursivamente um objeto e converte strings de data em objetos Date
 */
function convertDates(obj: any): any {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
        return obj;
    }

    for (const key of Object.keys(obj)) {
        const value = obj[key];

        // Verifica se é uma string de data ISO
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            obj[key] = new Date(value);
        } else if (typeof value === 'object') {
            convertDates(value);
        }
    }

    return obj;
}

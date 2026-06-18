import type { ElementDefinition } from '../types/ElementDefinition.js';

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export function validateElementDefinition(definition: ElementDefinition): ValidationResult {
    const errors: string[] = [];

    if (!definition.type) {
        errors.push('type is required');
    }

    if (!definition.title) {
        errors.push('title is required');
    }

    if (!definition.category) {
        errors.push('category is required');
    }

    if (!definition.version) {
        errors.push('version is required');
    }

    if (!definition.defaults) {
        errors.push('defaults is required');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
import type { FC } from 'react';
import type { ElementNode } from '../../../../core/src/types/index.js';

interface HeadingPropertiesProps {
    node: ElementNode;
    onUpdate: (attributes: Record<string, unknown>) => void;
}

export const HeadingProperties: FC<HeadingPropertiesProps> = ({ node, onUpdate }) => {
    const text = (node.attributes.text as string) || 'Heading';
    const level = (node.attributes.level as number) || 2;

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold mb-1">Text</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => onUpdate({ text: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold mb-1">Tag</label>
                <select
                    value={level}
                    onChange={(e) => onUpdate({ level: parseInt(e.target.value) })}
                    className="w-full border rounded px-2 py-1 text-sm"
                >
                    <option value={1}>H1</option>
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                    <option value={4}>H4</option>
                    <option value={5}>H5</option>
                    <option value={6}>H6</option>
                </select>
            </div>
        </div>
    );
};
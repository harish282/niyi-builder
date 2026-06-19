import { useEditorStore } from '../../store/EditorStore.js';
import type { FC } from 'react';

interface CanvasNodeProps {
    node: {
        id: string;
        type: string;
        attributes: Record<string, unknown>;
        children: CanvasNodeProps['node'][];
    };
}

export const CanvasNode: FC<CanvasNodeProps> = ({ node }) => {
    const { selectElement, selectedElementId } = useEditorStore();
    const isSelected = selectedElementId === node.id;

    const text = (node.attributes.text as string) || 'Heading';

    return (
        <div
            className={`p-4 border rounded cursor-pointer mb-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            onClick={() => selectElement(node.id)}
        >
            <h2 className="font-bold">{text}</h2>
        </div>
    );
};
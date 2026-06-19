import type { FC } from 'react';
import type { ElementNode } from '../../../../core/src/types/index.js';

interface HeadingCanvasProps {
    node: ElementNode;
    onSelect: () => void;
}

export const HeadingCanvas: FC<HeadingCanvasProps> = ({ node, onSelect }) => {
    const text = (node.attributes.text as string) || headingDefaults.text;
    
    return (
        <h2 
            className="wp-block-heading cursor-pointer hover:outline hover:outline-1 hover:outline-blue-500"
            onClick={onSelect}
        >
            {text}
        </h2>
    );
};

import { headingDefaults } from './defaults.js';
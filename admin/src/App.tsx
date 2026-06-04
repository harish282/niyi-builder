import { createEmptyDocument } from '@niyi-builder/core';

export function App() {
  const document = createEmptyDocument();

  return (
    <div className="niyi-builder-app">
      <p className="niyi-builder-app__lead">
        Gutenberg visual builder — React shell loaded successfully.
      </p>
      <p className="niyi-builder-app__meta">
        Document version: {document.version} · Root block: {document.root.type}
      </p>
    </div>
  );
}

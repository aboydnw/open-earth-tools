const LIBRARIES = [
  { name: 'MapLibre GL JS', kind: 'Web map renderer', license: 'BSD-3', url: 'https://maplibre.org/', desc: 'Vector-tile maps in the browser, the open fork of Mapbox GL JS.' },
  { name: 'deck.gl', kind: 'Data visualisation', license: 'MIT', url: 'https://deck.gl/', desc: 'GPU-powered layers for large datasets on top of a basemap.' },
  { name: 'OpenLayers', kind: 'Web map library', license: 'BSD-2', url: 'https://openlayers.org/', desc: 'A full-featured mapping library with strong OGC service support.' },
  { name: 'Leaflet', kind: 'Web map library', license: 'BSD-2', url: 'https://leafletjs.com/', desc: 'A small, simple library for interactive maps.' },
  { name: 'TiTiler', kind: 'Tile server', license: 'MIT', url: 'https://developmentseed.org/titiler/', desc: 'Serves map tiles straight from Cloud-Optimized GeoTIFFs and STAC.' },
  { name: 'Lonboard', kind: 'Notebook mapping', license: 'MIT', url: 'https://developmentseed.org/lonboard/', desc: 'Fast maps of large vector data inside Jupyter.' },
];

/** Open libraries visitors can use to build their own version of a tool. */
export function LibrariesSection() {
  return (
    <section id="libraries" aria-labelledby="libraries-heading" className="border-b border-rule">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8 px-4 pb-20 pt-[88px] sm:px-8">
        <div className="flex max-w-[640px] flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[.12em] text-graphite">Build your own</p>
          <h2 id="libraries-heading" className="font-wide text-4xl font-[520] leading-[1.05] tracking-[-0.02em]">
            The open libraries underneath
          </h2>
          <p className="text-[17px] leading-relaxed text-slate">
            Most tools above are finished products, but many are built from the same open parts. If you want your own
            version, start here.
          </p>
        </div>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] border-t border-ink">
          {LIBRARIES.map(lib => (
            <li key={lib.name} className="flex flex-col gap-2 border-b border-rule pb-[26px] pr-6 pt-[22px]">
              <span className="flex items-baseline justify-between gap-3">
                <a href={lib.url} className="text-[19px] font-semibold text-ink underline-offset-[3px]">
                  {lib.name}
                </a>
                <span className="font-mono text-[11.5px] text-graphite">{lib.license}</span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[.08em] text-rust">{lib.kind}</span>
              <span className="text-[15px] leading-[1.55] text-slate">{lib.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

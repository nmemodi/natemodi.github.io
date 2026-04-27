/* ═══════════════════════════════════════════════════════════════
   LOGO TOOLS — Canonical Registry
   Single source of truth for the 9 tools. Consumed by:
     - /logo/index.html         (landing doc sections)
     - /shared/tools-nav.js     (inter-tool dropdown switcher)

   Each entry:
     slug     — URL segment; path is /logo/<slug>/
     name     — display name
     svg      — inline SVG mark using currentColor (themeable)
     tagline  — one-line summary for landing section subheader
     blurb    — paragraph of prose for landing section (plain text)
     defaultSeed — seed used by the landing's embedded preview
     credit   — inspiration citation (historical logo). Fields:
                  work      — original logo title/company
                  designers — list of { name, url? } objects (url is the
                              logobook.com /designer/<slug>/ page when one
                              exists, otherwise null/omitted)
                  year      — year published
                  url       — logobook.com /logo/<slug>/ link for the work
                              itself (null when unlisted)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const TOOLS = [
    {
      slug: 'line-warp',
      name: 'Line Warp',
      tagline: 'Horizontal lines displaced by a letter heightmap.',
      blurb: 'Stack horizontal lines across the canvas, then lift each one by the brightness of the letter underneath. The result reads as a letterform that emerges from the weave rather than sits on top of it. Good for marks that should feel topographic — mountains, contour maps, and the cover of every vaguely-1970s paperback.',
      defaultSeed: '42',
      variants: [
        'v=1',
        'v=1&f=Futura&g=0.7&iv=1&ls=1&lt=V&n=6&oy=114&rd=100',
        'v=1&f=Futura&g=0.7&iv=1&ls=1&lt=K&m=34&n=23&oy=86&rd=100',
        'v=1&cr=0&f=Futura&g=0.7&ls=1&lt=O&m=34&n=9&oy=86&rd=100'
      ],
      credit: {
        work: 'Solfer',
        designers: [
          { name: 'Francesco Burcini', url: 'https://logobook.com/designer/francesco-burcini/' }
        ],
        year: 1978,
        url: 'https://logobook.com/logo/solfer/'
      },
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><line x1="0" y1="8" x2="80" y2="8"/><line x1="0" y1="16" x2="30" y2="16"/><path d="M30 16 Q40 6 50 16"/><line x1="50" y1="16" x2="80" y2="16"/><line x1="0" y1="24" x2="25" y2="24"/><path d="M25 24 Q40 8 55 24"/><line x1="55" y1="24" x2="80" y2="24"/><line x1="0" y1="32" x2="22" y2="32"/><path d="M22 32 Q40 10 58 32"/><line x1="58" y1="32" x2="80" y2="32"/><line x1="0" y1="40" x2="20" y2="40"/><path d="M20 40 Q40 12 60 40"/><line x1="60" y1="40" x2="80" y2="40"/><line x1="0" y1="48" x2="22" y2="48"/><path d="M22 48 Q40 14 58 48"/><line x1="58" y1="48" x2="80" y2="48"/><line x1="0" y1="56" x2="25" y2="56"/><path d="M25 56 Q40 20 55 56"/><line x1="55" y1="56" x2="80" y2="56"/><line x1="0" y1="64" x2="30" y2="64"/><path d="M30 64 Q40 40 50 64"/><line x1="50" y1="64" x2="80" y2="64"/><line x1="0" y1="72" x2="80" y2="72"/></svg>'
    },
    {
      slug: 'brutalist-letters',
      name: 'Brutalist Letters',
      tagline: 'Cut letters out of solid blocks with right-angle paths.',
      blurb: 'Every character is a single path of right-angle turns carved out of a filled square. No curves, no optical corrections, no apology. The shapes that come out feel more like pictograms than typography, which is the point — they read as logos first and letters second.',
      defaultSeed: '7',
      variants: [
        'v=1&cr=16&dp=147&lw=18&pa=12',
        'v=1&bg=e0e0e0&ch=K&cr=16&dp=147&fg=8c00ff&lw=18&pa=12',
        'v=1&bg=cec1cd&ch=L&cr=16&dp=132&fg=7e7987&lw=14&pa=12',
        'v=1&bg=12122b&ch=R&cr=16&dp=132&fg=ffc852&lw=14&pa=12'
      ],
      credit: {
        work: 'Hans-Joachim Gericke',
        designers: [
          { name: 'Klaus Grötzinger', url: 'https://logobook.com/designer/klaus-grozinger/' },
          { name: 'Peter Riefenstahl', url: 'https://logobook.com/designer/peter-riefenstahl/' }
        ],
        year: 1966,
        url: 'https://logobook.com/logo/hans-joachim-gericke/'
      },
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><line x1="20" y1="64" x2="40" y2="16"/><line x1="40" y1="16" x2="60" y2="64"/><line x1="28" y1="46" x2="52" y2="46"/><rect x="12" y="12" width="56" height="56" rx="2" stroke-dasharray="2 3" opacity="0.3"/></svg>'
    },
    {
      slug: 'interlocking-circles',
      name: 'Interlocking Circles',
      tagline: 'Overlapping rings with controlled break-and-weave.',
      blurb: 'Two or three circles, sized and spaced so the rings touch and pass through each other. A weave toggle decides which ring reads as on top at every crossing. The ancient version of this is the Olympic rings; the modern version is every fintech logo with a venn-diagram wink.',
      defaultSeed: '3',
      variants: [
        'v=1&bg=060d2d&br=0&fg=ebeaea&gp=0.5&ly=ring&n=7&r=75&ro=91&sp=91&sw=30',
        'v=1&ro=90&sw=46',
        'v=1&bg=72ff14&br=0&fg=000000&gp=2.9&ly=ring&n=5&nb=2&r=138&sp=161&sw=13',
        'v=1&bg=ffffff&br=0&fg=000000&gp=2.9&ly=ring&n=4&r=87&sp=68&sw=62'
      ],
      credit: {
        work: 'Ota Dental Clinic',
        designers: [
          { name: 'Koichi Watanabe', url: 'https://logobook.com/designer/koichi-watanabe/' }
        ],
        year: 1974,
        url: 'https://logobook.com/logo/ota-dental-clinic/'
      },
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><circle cx="32" cy="32" r="18"/><circle cx="48" cy="32" r="18"/><circle cx="40" cy="46" r="18"/></svg>'
    },
    {
      slug: 'parallel-letters',
      name: 'Parallel Letters',
      tagline: 'Letters drawn with vertical strip cuts through a solid fill.',
      blurb: 'Ignore the outline. A letter here is whatever shape you get when a dense grid of parallel vertical strips is punched through a colored block, then a second thin path weaves through the gaps. The typography is almost incidental — the field does the work.',
      defaultSeed: '12',
      variants: [
        'v=1&bg=673c40&jo=miter&n=10&sz=400&t=10',
        'v=1&bg=000000&ch=Y&f=Georgia&g=34.5&jo=miter&n=3&sz=400&t=10',
        'v=1&bg=ffffff&ch=M&fg=000000&g=2&n=7&sz=600&t=10',
        'v=1&bg=020066&ch=W&f=ArialBlack&g=1&jo=bevel&n=40&sz=900&t=5'
      ],
      credit: {
        work: 'Five G Marketing',
        designers: [
          { name: 'John B. Castle', url: 'https://logobook.com/designer/john-b-castle/' },
          { name: 'Castle, Chappell and Partners', url: null }
        ],
        year: 1966,
        url: 'https://logobook.com/logo/five-g/'
      },
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><line x1="16" y1="20" x2="16" y2="60"/><line x1="24" y1="20" x2="24" y2="60"/><line x1="32" y1="20" x2="32" y2="60"/><line x1="40" y1="20" x2="40" y2="60"/><line x1="48" y1="20" x2="48" y2="60"/><line x1="56" y1="20" x2="56" y2="60"/><line x1="64" y1="20" x2="64" y2="60"/><path d="M20 24 L40 24 L40 40 L24 40 L24 56 L44 56" stroke-width="3" opacity="0.4"/></svg>'
    },
    {
      slug: 'shape-tiles',
      name: 'Shape Tiles',
      tagline: 'A single shape tiled across a grid at deterministic rotations.',
      blurb: 'Pick a primitive — circle, cross, hexagon, square cut in half — and tile it. Rotation and gap are the only knobs that matter. Good for wordmark backgrounds, product grids, or the inevitable moment a brand needs a "pattern version" of its logo.',
      defaultSeed: '5',
      variants: [
        'v=1&g=120',
        'v=1&bg=000000&fg=ffffff&g=97&rt=45&sh=ring&sz=241',
        'v=1&bg=0b562f&fg=ffffff&g=97&rt=45&sh=petal&sz=241',
        'v=1&fg=4c4a43&g=85&rt=68&sh=diamond&sz=240'
      ],
      credit: {
        work: 'Dayton Hudson Corporation',
        designers: [
          { name: 'Vance Jonson', url: 'https://logobook.com/designer/vance-jonson/' }
        ],
        year: '1970s',
        url: 'https://logobook.com/logo/dayton-hudson-corporation/'
      },
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><circle cx="40" cy="40" r="13"/><path d="M53 8 A13 13 0 0 1 27 8"/><path d="M27 72 A13 13 0 0 1 53 72"/><path d="M8 27 A13 13 0 0 1 8 53"/><path d="M72 53 A13 13 0 0 1 72 27"/><path d="M8 21 A13 13 0 0 1 21 8"/><path d="M59 8 A13 13 0 0 1 72 21"/><path d="M72 59 A13 13 0 0 1 59 72"/><path d="M21 72 A13 13 0 0 1 8 59"/></svg>'
    },
    {
      slug: 'sliced-shapes',
      name: 'Sliced Shapes',
      tagline: 'Primitives cut by negative arcs to reveal the shape behind.',
      blurb: 'Every shape is two shapes — a foreground solid and a negative-space cut that carves an arc through it. The cut width becomes its own visual element. The whole thing feels like cafeteria-tray modernist graphics. You can get a surprising number of brand-adjacent marks out of it.',
      defaultSeed: '9',
      variants: [
        'v=1',
        'v=1&as=0&ba=-7&bg=000000&c=2&cu=0&fc=ffffff&gw=28&sh=diamond&sp=122&sz=128',
        'v=1&as=0&ba=-180&bg=d6ddff&c=2&cu=0&fc=000000&gw=28&lc=ffffff&sh=cross&sp=111&sz=103',
        'v=1&as=38&ba=-180&bg=f5f5f5&cu=0&fc=1a1a1a&gw=19.5&lc=ffffff&sh=shield&so=0.11&sp=238&sz=105&tp=0.57'
      ],
      credit: {
        work: 'Fujisankei Kokukusha',
        designers: [
          { name: 'Ippo Miyamoto', url: 'https://logobook.com/designer/ippo-miyamoto/' },
          { name: 'Tadashi Ishikawa', url: 'https://logobook.com/designer/tadashi-ishikawa/' }
        ],
        year: 1978,
        url: 'https://logobook.com/logo/fujisankei-kokukusha/'
      },
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><path d="M10,32 A12,12,0,1,1,34,32"/><path d="M10,32 A12,12,0,1,0,34,32"/><path d="M30,34 A12,12,0,1,1,54,28"/><path d="M30,28 A12,12,0,1,0,54,34"/><path d="M48,36 A12,12,0,1,1,72,26"/><path d="M48,26 A12,12,0,1,0,72,36"/></svg>'
    },
    {
      slug: 'slash-mark',
      name: 'Slash Mark',
      tagline: 'A containing shape striped with diagonals that match the ground.',
      blurb: 'A circle, square or hexagon, filled with a solid. Then diagonal slashes of the background color cut across it. When the slashes match the ground behind, the mark breathes — it reads as "shape with attitude" rather than "shape plus lines." Borderline cliché; useful because of it.',
      defaultSeed: '11',
      variants: [
        'v=1',
        'v=1&a=90&bg=0d0d0d&ex=60&lc=0d0d0d&lw=26&n=5&sc=c7f8ff&sp=86&tp=100',
        'v=1&a=135&bg=ffccf4&ex=60&lc=ffccf4&lw=40&n=9&sc=930b81&sp=10&tp=100',
        'v=1&a=45&bg=fbf7e5&ex=60&lc=fbf7e5&lw=40&n=9&sc=454545&sp=100&tp=100'
      ],
      credit: {
        work: 'Minami-nihon',
        designers: [
          { name: 'Kazumasa Nagai', url: 'https://logobook.com/designer/kazumasa-nagai/' }
        ],
        year: 1983,
        url: 'https://logobook.com/logo/minami-nihon/'
      },
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><circle cx="40" cy="40" r="26"/><line x1="30" y1="58" x2="38" y2="22"/><line x1="34" y1="58" x2="42" y2="22"/><line x1="38" y1="58" x2="46" y2="22"/><line x1="42" y1="58" x2="50" y2="22"/><line x1="46" y1="56" x2="52" y2="26"/></svg>'
    },
    {
      slug: 'polygon-rosette',
      name: 'Polygon Rosette',
      tagline: 'Concentric polygons connected by diagonals — geometric rosettes.',
      blurb: 'Start with a polygon, nest a smaller version inside it, draw the spokes between corresponding vertices. Every rotation setting produces a new mark; most of them look like the flag of a country that does not exist yet. Works well scaled down to a favicon.',
      defaultSeed: '6',
      variants: [
        'v=1&bg=ff4242&sw=18',
        'v=1&bg=1a1a1a&fg=ffffff&ir=0.1&n=14&r=261&sw=18',
        'v=1&bg=0e251b&fg=ffeedb&g=2.2&ir=0.5&n=3&r=260&rt=256&sk=1&sw=18',
        'v=1&bg=007bff&fg=ffffff&ir=0.54&n=17&r=262&sk=1&sw=14'
      ],
      credit: {
        work: 'Grace',
        designers: [
          { name: 'Koichi Nakai', url: 'https://logobook.com/designer/koichi-nakai/' },
          { name: 'Ichiro Nakai', url: 'https://logobook.com/designer/ichiro-nakai/' },
          { name: 'Tetsuo Hiro', url: 'https://logobook.com/designer/tetsuo-hiro/' },
          { name: 'Tetsuo Togasawa', url: 'https://logobook.com/designer/tetsuo-togasawa/' }
        ],
        year: 1982,
        url: 'https://logobook.com/logo/grace/'
      },
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.7"><polygon points="40,12 55.6,17 64.7,30 64.7,50 55.6,63 40,68 24.4,63 15.3,50 15.3,30 24.4,17"/><polygon points="40,24 49.4,27.6 53.8,36 53.8,44 49.4,52.4 40,56 30.6,52.4 26.2,44 26.2,36 30.6,27.6"/><line x1="40" y1="12" x2="53.8" y2="36"/><line x1="55.6" y1="17" x2="53.8" y2="44"/><line x1="64.7" y1="30" x2="49.4" y2="52.4"/><line x1="64.7" y1="50" x2="40" y2="56"/><line x1="55.6" y1="63" x2="30.6" y2="52.4"/><line x1="40" y1="68" x2="26.2" y2="44"/><line x1="24.4" y1="63" x2="26.2" y2="36"/><line x1="15.3" y1="50" x2="30.6" y2="27.6"/><line x1="15.3" y1="30" x2="40" y2="24"/><line x1="24.4" y1="17" x2="49.4" y2="27.6"/></svg>'
    },
    {
      slug: 'echo-stripes',
      name: 'Echo Stripes',
      tagline: 'Nested letters of horizontal stripes that thin out as they grow.',
      blurb: 'A core letter built from thick black bars, ringed by larger ghost letters drawn in progressively thinner stripes. Each ring extends past the last like a slow shutter — the shape stays put, the lines feather outward. The trick is alignment: every stripe sits at the same y, just thicker where the inner letter contains it.',
      defaultSeed: '1',
      variants: [
        'v=1&an=c&bg=1328c9&fg=ffffff&gr=1.47&rt=0.39&tk=90',
        'v=1&an=c&bg=280608&ch=J&fg=fffee0&gr=1.55&rt=0.57&st=20&tk=90',
        'v=1&ch=X&gr=1.55&rt=0.21',
        'v=1&bg=c913a7&ch=A&fg=ffffff&gr=2&lv=2&rt=0.09&st=4&tk=90'
      ],
      credit: {
        work: 'Bather Belrose Boje',
        designers: [
          { name: 'Tim Larsen', url: null }
        ],
        year: 1981,
        url: null
      },
      svg: '<svg viewBox="0 0 80 80" fill="currentColor" stroke="none"><rect x="22" y="16" width="36" height="6"/><rect x="22" y="28" width="36" height="6"/><rect x="22" y="40" width="36" height="6"/><rect x="22" y="52" width="36" height="6"/><rect x="22" y="64" width="36" height="6"/><rect x="10" y="18" width="60" height="2"/><rect x="10" y="30" width="60" height="2"/><rect x="10" y="42" width="60" height="2"/><rect x="10" y="54" width="60" height="2"/><rect x="10" y="66" width="60" height="2"/></svg>'
    },
    {
      slug: 'dot-grid',
      name: 'Dot Grid',
      tagline: 'Letters bitmap-rendered from a rounded-rectangle dot grid.',
      blurb: 'A grid of rounded squares, each either on or off depending on whether the letterform passes through it. Nudge the corner radius toward fifty percent and you get dots; leave it near zero and you get pixel blocks. Reads like a 1980s train-station split-flap display.',
      defaultSeed: '42',
      variants: [
        'v=1&bd=fcffe5&bg=000000&bs=circle&ch=X&dc=000000&ds=100&ff=Georgia&gc=22&ls=105&mg=7&oy=5&th=5',
        'v=1&bg=ffffff&dc=000000&ds=100&gc=7&ls=132&mg=5&ox=-3&oy=12&pa=0&th=9',
        'v=1&bd=85baff&bg=0f0449&ch=H&dc=17014b&ds=100&gc=13&ls=110&mg=4&oy=5&sh=hexagon&th=5',
        'v=1&bd=000000&bg=000000&ch=J&dc=d1ff52&ds=100&ff=Georgia&gc=20&ls=132&mg=5&oy=7&pa=0&sh=diamond&th=9'
      ],
      credit: {
        work: 'LaSalle Steel',
        designers: [
          { name: 'Morton Goldsholl', url: 'https://logobook.com/designer/morton-goldsholl/' }
        ],
        year: 1962,
        url: null
      },
      svg: '<svg viewBox="0 0 80 80" fill="currentColor" stroke="none"><circle cx="20" cy="20" r="5"/><circle cx="20" cy="34" r="5"/><circle cx="20" cy="48" r="5"/><circle cx="20" cy="62" r="5"/><circle cx="34" cy="62" r="5"/><circle cx="48" cy="62" r="5"/><circle cx="62" cy="62" r="5"/></svg>'
    }
  ];

  const INDEX_PATH = '/logo/';

  function toolPath(slug) { return INDEX_PATH + slug + '/'; }

  function findBySlug(slug) {
    return TOOLS.find(t => t.slug === slug) || null;
  }

  function currentIndex() {
    const parts = location.pathname.replace(/^\/|\/$/g, '').split('/');
    const i = parts.indexOf('logo');
    const slug = i >= 0 ? parts[i + 1] : parts[0];
    return TOOLS.findIndex(t => t.slug === slug);
  }

  window.LogoTools = {
    TOOLS: TOOLS,
    INDEX_PATH: INDEX_PATH,
    toolPath: toolPath,
    findBySlug: findBySlug,
    currentIndex: currentIndex
  };
})();

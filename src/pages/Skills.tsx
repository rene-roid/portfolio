import { useRef, useEffect, useState, useCallback } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';
import type { PageProps } from '../types';
import { SKILL_GROUPS } from '../data';
import { PageShell } from '../components/PageShell';

interface GraphNode {
  id: string;
  label: string;
  rank?: string;
  color: string;
  type: 'center' | 'category' | 'skill';
  nodeSize: number;
  x?: number;
  y?: number;
  z?: number;
}

interface GraphLink {
  source: string;
  target: string;
  linkColor: string;
}

function buildGraph() {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  nodes.push({ id: 'root', label: 'SKILLS', color: '#ffffff', type: 'center', nodeSize: 14 });

  for (const g of SKILL_GROUPS) {
    const catId = `cat_${g.name}`;
    nodes.push({ id: catId, label: g.name, color: g.color, type: 'category', nodeSize: 9 });
    links.push({ source: 'root', target: catId, linkColor: `${g.color}66` });

    for (const [name, rank] of g.items) {
      const skillId = `skill_${g.name}_${name}`;
      nodes.push({ id: skillId, label: name, rank, color: g.color, type: 'skill', nodeSize: 5 });
      links.push({ source: catId, target: skillId, linkColor: `${g.color}44` });
    }
  }

  return { nodes, links };
}

const GRAPH_DATA = buildGraph();

function makeNodeObject(node: GraphNode) {
  const group = new THREE.Group();

  const geo = new THREE.SphereGeometry(node.nodeSize * 0.5, 16, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(node.color),
    emissive: new THREE.Color(node.color),
    emissiveIntensity: node.type === 'center' ? 0.8 : 0.5,
    roughness: 0.3,
    metalness: 0.6,
  });
  group.add(new THREE.Mesh(geo, mat));

  if (node.type === 'category') {
    const ringGeo = new THREE.TorusGeometry(node.nodeSize * 0.65, 0.4, 8, 32);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: new THREE.Color(node.color), transparent: true, opacity: 0.5,
    }));
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  }

  const canvas = document.createElement('canvas');
  const isCategory = node.type === 'category';
  const isCenter = node.type === 'center';
  canvas.width = isCategory ? 256 : 220;
  canvas.height = node.rank ? 52 : 40;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const fontSize = isCenter ? 22 : isCategory ? 18 : 15;
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.fillStyle = node.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.label, canvas.width / 2, node.rank ? canvas.height / 2 - 8 : canvas.height / 2);

  if (node.rank) {
    ctx.font = '12px monospace';
    ctx.fillStyle = `${node.color}bb`;
    ctx.fillText(node.rank, canvas.width / 2, canvas.height / 2 + 12);
  }

  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  const scale = isCenter ? 30 : isCategory ? 26 : 20;
  sprite.scale.set(scale, scale * (canvas.height / canvas.width), 1);
  sprite.position.set(0, node.nodeSize * 0.7 + (isCategory ? 7 : 5), 0);
  group.add(sprite);

  return group;
}

export function SkillsPage({ item, onBack, onNext, onPrev }: PageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ReturnType<typeof ForceGraph3D> | null>(null);
  const animRef = useRef<number>(0);
  const [selected, setSelected] = useState<GraphNode | null>(null);

  const handleNodeClick = useCallback((node: object) => {
    const n = node as GraphNode;
    if (n.type === 'center') return;
    setSelected(prev => prev?.id === n.id ? null : n);

    if (graphRef.current) {
      const distance = 120;
      const nAny = node as any;
      const distRatio = 1 + distance / Math.hypot(nAny.x ?? 1, nAny.y ?? 1, nAny.z ?? 1);
      graphRef.current.cameraPosition(
        { x: (nAny.x ?? 0) * distRatio, y: (nAny.y ?? 0) * distRatio, z: (nAny.z ?? 0) * distRatio },
        nAny as any,
        800
      );
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (w === 0 || h === 0) return;

    const Graph = ForceGraph3D({ antialias: true, alpha: true })(el)
      .width(w)
      .height(h)
      .backgroundColor('rgba(0,0,0,0)')
      .graphData(GRAPH_DATA as any)
      .nodeThreeObject((node: object) => makeNodeObject(node as GraphNode))
      .nodeThreeObjectExtend(false)
      .linkColor((link: object) => (link as GraphLink).linkColor)
      .linkWidth(0.8)
      .linkOpacity(0.6)
      .linkDirectionalParticles(2)
      .linkDirectionalParticleWidth(1.2)
      .linkDirectionalParticleColor((link: object) => (link as GraphLink).linkColor)
      .nodeLabel('')
      .onNodeClick(handleNodeClick)
      .d3AlphaDecay(0.02)
      .d3VelocityDecay(0.3);

    // ambient + point lights
    const scene = Graph.scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pt = new THREE.PointLight(0xffffff, 1.2, 500);
    pt.position.set(50, 50, 50);
    scene.add(pt);

    graphRef.current = Graph;

    // slow auto-rotate
    let angle = 0;
    const rotate = () => {
      angle += 0.0015;
      Graph.cameraPosition({
        x: 250 * Math.sin(angle),
        z: 250 * Math.cos(angle),
      } as any);
      animRef.current = requestAnimationFrame(rotate);
    };
    animRef.current = requestAnimationFrame(rotate);

    const onResize = () => {
      Graph.width(el.offsetWidth).height(el.offsetHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      Graph._destructor?.();
      el.innerHTML = '';
      graphRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageShell item={item} onBack={onBack} onNext={onNext} onPrev={onPrev}>
      <div className="flex flex-col h-full gap-4">
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.7 }}>
            skills.graph()
          </div>
          <div className="font-display italic" style={{
            marginTop: 6,
            fontSize: 'clamp(40px, 5vw, 80px)', lineHeight: 0.9,
            letterSpacing: '-0.04em', transform: 'skewX(-6deg)',
          }}>
            STACK <span style={{ color: item.color }}>/</span> TOOLKIT
          </div>
        </div>

        <div ref={containerRef} className="flex-1 relative" style={{ minHeight: 0 }} />

        {selected && (
          <div
            className="font-mono"
            style={{
              alignSelf: 'center',
              background: 'rgba(5,12,32,0.85)',
              border: `1px solid ${selected.color}`,
              padding: '8px 20px',
              letterSpacing: '0.12em',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ color: selected.color, fontSize: 13 }}>{selected.label}</span>
            {selected.rank && (
              <span style={{ marginLeft: 14, fontSize: 11, opacity: 0.7 }}>
                RANK · <span style={{ color: selected.color }}>{selected.rank}</span>
              </span>
            )}
          </div>
        )}

        <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.45 }}>
          drag · rotate · scroll to zoom · click node to inspect
        </div>
      </div>
    </PageShell>
  );
}

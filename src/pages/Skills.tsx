import { useRef, useEffect, useState, useCallback } from 'react';
import ForceGraph3D from '3d-force-graph';
import type { ForceGraph3DInstance, ConfigOptions } from '3d-force-graph';
import type { NodeObject, LinkObject, GraphData } from 'three-forcegraph';
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
  depth: number;
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

interface SkillMenuEntry {
  id: string;
  label: string;
  color: string;
  depth: number;
  rank?: string;
}

type FG3DFactory = (config?: ConfigOptions) => (el: HTMLElement) => ForceGraph3DInstance;
const GRAPH_BLEED = 120;

function buildGraph() {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  nodes.push({ id: 'root', label: 'SKILLS', color: '#ffffff', type: 'center', depth: 0, nodeSize: 14 });

  for (const g of SKILL_GROUPS) {
    const catId = `cat_${g.name}`;
    nodes.push({ id: catId, label: g.name, color: g.color, type: 'category', depth: 1, nodeSize: 9 });
    links.push({ source: 'root', target: catId, linkColor: `${g.color}66` });

    for (const [name, rank] of g.items) {
      const skillId = `skill_${g.name}_${name}`;
      nodes.push({ id: skillId, label: name, rank, color: g.color, type: 'skill', depth: 2, nodeSize: 5 });
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
  canvas.width = isCenter ? 300 : isCategory ? 340 : 280;
  canvas.height = node.rank ? 72 : 56;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const fontSize = isCenter ? 32 : isCategory ? 26 : 20;
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.fillStyle = node.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.label, canvas.width / 2, node.rank ? canvas.height / 2 - 10 : canvas.height / 2);

  if (node.rank) {
    ctx.font = '16px monospace';
    ctx.fillStyle = `${node.color}bb`;
    ctx.fillText(node.rank, canvas.width / 2, canvas.height / 2 + 16);
  }

  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  const scale = isCenter ? 44 : isCategory ? 40 : 32;
  sprite.scale.set(scale, scale * (canvas.height / canvas.width), 1);
  sprite.position.set(0, node.nodeSize * 0.7 + (isCategory ? 9 : 6), 0);
  group.add(sprite);

  return group;
}

function getOrbitDistance(node: GraphNode) {
  return Math.max(84, 250 - node.depth * 58);
}

function getFocusDistance(node: GraphNode) {
  return Math.max(56, 140 - node.depth * 36);
}

function buildSkillMenuEntries() {
  const entries: SkillMenuEntry[] = [];

  for (const group of SKILL_GROUPS) {
    entries.push({
      id: `cat_${group.name}`,
      label: group.name,
      color: group.color,
      depth: 1,
    });

    for (const [name, rank] of group.items) {
      entries.push({
        id: `skill_${group.name}_${name}`,
        label: name,
        color: group.color,
        depth: 2,
        rank,
      });
    }
  }

  return entries;
}

const SKILL_MENU_ENTRIES = buildSkillMenuEntries();

export function SkillsPage({ item, onBack, onNext, onPrev }: PageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const graphRef = useRef<ForceGraph3DInstance | null>(null);
  const animRef = useRef<number>(0);
  const autoRotateRef = useRef(true);
  const orbitTargetRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const desiredOrbitTargetRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const orbitDistanceRef = useRef(250);
  const desiredOrbitDistanceRef = useRef(250);
  const [selected, setSelected] = useState<GraphNode | null>(null);

  const focusNode = useCallback((node: GraphNode & NodeObject) => {
    if (node.type === 'center') {
      setSelected(null);
      desiredOrbitTargetRef.current = { x: 0, y: 0, z: 0 };
      desiredOrbitDistanceRef.current = 250;

      if (graphRef.current) {
        graphRef.current.cameraPosition(
          { x: 0, y: 0, z: 250 },
          { x: 0, y: 0, z: 0 },
          800
        );
      }

      return;
    }

    let deselecting = false;
    setSelected(prev => {
      deselecting = prev?.id === node.id;
      return deselecting ? null : node;
    });

    if (deselecting) {
      desiredOrbitTargetRef.current = { x: 0, y: 0, z: 0 };
      desiredOrbitDistanceRef.current = 250;
      return;
    }

    desiredOrbitTargetRef.current = { x: node.x ?? 0, y: node.y ?? 0, z: node.z ?? 0 };
    desiredOrbitDistanceRef.current = getOrbitDistance(node);

    if (graphRef.current) {
      const distance = getFocusDistance(node);
      const distRatio = 1 + distance / Math.hypot(node.x ?? 1, node.y ?? 1, node.z ?? 1);
      graphRef.current.cameraPosition(
        { x: (node.x ?? 0) * distRatio, y: (node.y ?? 0) * distRatio, z: (node.z ?? 0) * distRatio },
        desiredOrbitTargetRef.current,
        800
      );
    }
  }, []);

  const handleNodeClick = useCallback((node: object) => {
    focusNode(node as GraphNode & NodeObject);
  }, [focusNode]);

  const handleMenuSelect = useCallback((id: string) => {
    const liveGraphData = graphRef.current?.graphData() as GraphData<NodeObject, LinkObject> | undefined;
    const node = liveGraphData?.nodes.find(candidate => candidate.id === id) ?? GRAPH_DATA.nodes.find(candidate => candidate.id === id);
    if (!node) return;
    focusNode(node as GraphNode & NodeObject);
  }, [focusNode]);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (w === 0 || h === 0) return;

    const Graph = (ForceGraph3D as unknown as FG3DFactory)({ rendererConfig: { antialias: true, alpha: true } })(el)
      .width(w)
      .height(h)
      .backgroundColor('rgba(0,0,0,0)')
      .graphData(GRAPH_DATA as GraphData<NodeObject, LinkObject>)
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

    const controls = Graph.controls() as { enableZoom?: boolean; noZoom?: boolean };
    if ('enableZoom' in controls) controls.enableZoom = false;
    if ('noZoom' in controls) controls.noZoom = true;

    graphRef.current = Graph;

    // slow auto-rotate
    let angle = 0;
    const rotate = () => {
      if (autoRotateRef.current) {
        const target = orbitTargetRef.current;
        const desiredTarget = desiredOrbitTargetRef.current;
        target.x += (desiredTarget.x - target.x) * 0.06;
        target.y += (desiredTarget.y - target.y) * 0.06;
        target.z += (desiredTarget.z - target.z) * 0.06;
        orbitDistanceRef.current += (desiredOrbitDistanceRef.current - orbitDistanceRef.current) * 0.06;
        const distance = orbitDistanceRef.current;
        angle += 0.0005;
        Graph.cameraPosition({
          x: target.x + distance * Math.sin(angle),
          y: target.y,
          z: target.z + distance * Math.cos(angle),
        }, target);
      }
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

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const stopScroll = (e: WheelEvent) => e.stopPropagation();
    el.addEventListener('wheel', stopScroll);
    return () => el.removeEventListener('wheel', stopScroll);
  }, []);

  return (
    <PageShell item={item} onBack={onBack} onNext={onNext} onPrev={onPrev}>
      <div className="relative h-full" style={{ minHeight: 0 }}>
        <div
          ref={containerRef}
          className="absolute"
          style={{
            inset: -GRAPH_BLEED,
            zIndex: 1,
          }}
        />

        <div className="relative flex h-full flex-col gap-4" style={{ zIndex: 3, pointerEvents: 'none', minHeight: 0 }}>
          <div style={{ pointerEvents: 'auto', maxWidth: 'min(60%, 720px)' }}>
            <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.7 }}>
              skills.graph()
            </div>
            <div className="font-display italic" style={{
              marginTop: 6,
              fontSize: 'clamp(36px, 4vw, 58px)', lineHeight: 0.9,
              letterSpacing: '-0.04em', transform: 'skewX(-6deg)',
              color: '#fff', textShadow: `4px 4px 0 ${item.color}`,
            }}>
              STACK <span style={{ color: item.color }}>/</span> TOOLKIT
            </div>
          </div>

          <div className="relative flex-1" style={{ minHeight: 0 }}>
            <aside
              ref={menuRef}
              className="absolute font-mono"
              style={{
                pointerEvents: 'auto',
                zIndex: 4,
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(320px, 32vw)',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                padding: '18px 18px 22px',
                background: 'rgba(5,12,32,0.6)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 45px rgba(0,0,0,0.22)',
                backdropFilter: 'blur(10px)',
              }}
            >
            <div style={{ fontSize: 11, letterSpacing: '0.24em', opacity: 0.55, marginBottom: 14 }}>
              skill.index
            </div>
            <div className="flex flex-col" style={{ gap: 6 }}>
              {SKILL_MENU_ENTRIES.map(entry => {
                const isActive = selected?.id === entry.id;

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => handleMenuSelect(entry.id)}
                    className="text-left cursor-pointer"
                    style={{
                      background: isActive ? `${entry.color}22` : 'transparent',
                      border: `1px solid ${isActive ? entry.color : 'transparent'}`,
                      color: isActive ? '#ffffff' : '#d6def3',
                      padding: entry.depth === 1 ? '10px 12px' : '8px 12px 8px 24px',
                      letterSpacing: entry.depth === 1 ? '0.14em' : '0.08em',
                      fontSize: entry.depth === 1 ? 12 : 11,
                      textTransform: 'uppercase',
                      transition: 'background 180ms ease, border-color 180ms ease, transform 180ms ease',
                      transform: isActive ? 'translateX(-4px)' : 'translateX(0)',
                    }}
                  >
                    <div style={{ color: entry.color }}>{entry.label}</div>
                    {entry.rank && (
                      <div style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.62, marginTop: 4 }}>
                        rank {entry.rank}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            </aside>
          </div>

          <div
            className="font-mono"
            style={{
              pointerEvents: 'none',
              alignSelf: 'center',
              background: selected ? 'rgba(5,12,32,0.85)' : 'transparent',
              border: `1px solid ${selected ? selected.color : 'transparent'}`,
              padding: '8px 20px',
              letterSpacing: '0.12em',
              backdropFilter: selected ? 'blur(8px)' : 'none',
              visibility: selected ? 'visible' : 'hidden',
            }}
          >
            <span style={{ color: selected?.color, fontSize: 13 }}>{selected?.label ?? '\u00A0'}</span>
            {selected?.rank && (
              <span style={{ marginLeft: 14, fontSize: 11, opacity: 0.7 }}>
                RANK · <span style={{ color: selected.color }}>{selected.rank}</span>
              </span>
            )}
          </div>

          <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.45, pointerEvents: 'none' }}>
            drag · rotate · scroll page to navigate · click node to inspect
          </div>
        </div>
      </div>
    </PageShell>
  );
}

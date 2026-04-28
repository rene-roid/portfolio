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
  // selectedRef kept in sync synchronously so rAF loop always reads latest value
  const selectedRef = useRef<GraphNode | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const focusNode = useCallback((node: GraphNode & NodeObject) => {
    if (node.type === 'center') {
      setSelected(null);
      selectedRef.current = null;
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

    const deselecting = selectedRef.current?.id === node.id;

    if (deselecting) {
      setSelected(null);
      selectedRef.current = null;
      desiredOrbitTargetRef.current = { x: 0, y: 0, z: 0 };
      desiredOrbitDistanceRef.current = 250;
      return;
    }

    const graphNode = node as unknown as GraphNode;
    setSelected(graphNode);
    selectedRef.current = graphNode;

    desiredOrbitTargetRef.current = { x: node.x ?? 0, y: node.y ?? 0, z: node.z ?? 0 };
    desiredOrbitDistanceRef.current = getOrbitDistance(graphNode);

    if (graphRef.current) {
      const distance = getFocusDistance(graphNode);
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

    const scene = Graph.scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pt = new THREE.PointLight(0xffffff, 1.2, 500);
    pt.position.set(50, 50, 50);
    scene.add(pt);

    const controls = Graph.controls() as { enableZoom?: boolean; noZoom?: boolean };
    if ('enableZoom' in controls) controls.enableZoom = false;
    if ('noZoom' in controls) controls.noZoom = true;

    graphRef.current = Graph;

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

      // Project selected node to 2D screen coords and move tooltip DOM node directly (no React re-render)
      const node = selectedRef.current;
      const tip = tooltipRef.current;
      const container = containerRef.current;
      if (node?.x !== undefined && node.y !== undefined && node.z !== undefined && tip && container && graphRef.current) {
        const camera = (graphRef.current as unknown as { camera: () => THREE.PerspectiveCamera }).camera();
        const vec = new THREE.Vector3(node.x, node.y, node.z);
        vec.project(camera);

        if (vec.z < 1) {
          // NDC → container px → outer-div px (subtract bleed offset)
          const px = (vec.x + 1) / 2 * container.offsetWidth - GRAPH_BLEED;
          const py = (-vec.y + 1) / 2 * container.offsetHeight - GRAPH_BLEED;
          tip.style.left = `${px}px`;
          tip.style.top = `${py}px`;
          tip.style.opacity = '1';
        } else {
          tip.style.opacity = '0';
        }
      } else if (tip) {
        tip.style.opacity = '0';
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

  // Derive tooltip metadata from selected node
  const categoryLabel = selected?.type === 'skill'
    ? SKILL_GROUPS.find(g => selected.id.startsWith(`skill_${g.name}_`))?.name ?? null
    : null;
  const skillCount = selected?.type === 'category'
    ? (SKILL_GROUPS.find(g => g.name === selected.label)?.items.length ?? 0)
    : 0;

  return (
    <PageShell item={item} onBack={onBack} onNext={onNext} onPrev={onPrev}>
      <div className="relative h-full" style={{ minHeight: 0 }}>
        {/* 3D graph canvas */}
        <div
          ref={containerRef}
          className="absolute"
          style={{ inset: -GRAPH_BLEED, zIndex: 1 }}
        />

        {/* Floating tooltip — position driven by rAF, content driven by React state */}
        <div
          ref={tooltipRef}
          className="font-mono"
          style={{
            position: 'absolute',
            zIndex: 10,
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 180ms ease',
            // centers horizontally on the node, floats above it
            transform: 'translate(-50%, calc(-100% - 20px))',
            background: 'rgba(4,10,26,0.95)',
            border: `1px solid ${selected?.color ?? '#ffffff'}`,
            padding: '9px 14px 10px',
            backdropFilter: 'blur(14px)',
            boxShadow: `0 8px 28px rgba(0,0,0,0.65), 0 0 16px ${selected?.color ?? '#ffffff'}1a`,
            minWidth: 120,
            whiteSpace: 'nowrap',
          }}
        >
          {selected && (
            <>
              {/* Category breadcrumb for skill nodes */}
              {categoryLabel && (
                <div style={{
                  fontSize: 9,
                  letterSpacing: '0.24em',
                  color: selected.color,
                  opacity: 0.6,
                  textTransform: 'uppercase',
                  marginBottom: 5,
                }}>
                  {categoryLabel}
                </div>
              )}

              {/* Node label */}
              <div style={{
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                {selected.label}
              </div>

              {/* Rank badge */}
              {selected.rank && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 7 }}>
                  <span style={{ fontSize: 9, letterSpacing: '0.2em', opacity: 0.42, textTransform: 'uppercase' }}>
                    rank
                  </span>
                  <span style={{
                    fontSize: 10,
                    padding: '1px 7px',
                    background: `${selected.color}22`,
                    border: `1px solid ${selected.color}70`,
                    color: selected.color,
                    letterSpacing: '0.14em',
                  }}>
                    {selected.rank}
                  </span>
                </div>
              )}

              {/* Skill count for category nodes */}
              {selected.type === 'category' && skillCount > 0 && (
                <div style={{
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  opacity: 0.42,
                  marginTop: 6,
                  textTransform: 'uppercase',
                }}>
                  {skillCount} skills
                </div>
              )}
            </>
          )}

          {/* Arrow pointing down toward node */}
          <div style={{
            position: 'absolute',
            bottom: -5,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 8,
            height: 8,
            background: 'rgba(4,10,26,0.95)',
            borderRight: `1px solid ${selected?.color ?? '#ffffff'}`,
            borderBottom: `1px solid ${selected?.color ?? '#ffffff'}`,
          }} />
        </div>

        {/* Content layer */}
        <div className="relative flex h-full flex-col gap-4" style={{ zIndex: 3, pointerEvents: 'none', minHeight: 0 }}>
          {/* Page title */}
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
                width: 'min(272px, 30vw)',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                paddingTop: 14,
                paddingBottom: 22,
                background: 'rgba(4,10,26,0.75)',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '-16px 0 48px rgba(0,0,0,0.35)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Header */}
              <div style={{
                fontSize: 9,
                letterSpacing: '0.34em',
                opacity: 0.35,
                textTransform: 'uppercase',
                color: '#fff',
                padding: '0 16px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                marginBottom: 10,
              }}>
                // skill.index
              </div>

              {/* Grouped skill list */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {SKILL_GROUPS.map((group, gi) => {
                  const catId = `cat_${group.name}`;
                  const isCatActive = selected?.id === catId;

                  return (
                    <div
                      key={group.name}
                      style={{ marginBottom: gi < SKILL_GROUPS.length - 1 ? 6 : 0 }}
                    >
                      {/* ── Category header ── */}
                      <button
                        type="button"
                        onClick={() => handleMenuSelect(catId)}
                        className="w-full text-left cursor-pointer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '9px 14px',
                          background: isCatActive ? `${group.color}18` : 'transparent',
                          borderLeft: `3px solid ${isCatActive ? group.color : `${group.color}40`}`,
                          transition: 'background 180ms ease, border-color 180ms ease',
                        }}
                      >
                        <span style={{
                          flex: 1,
                          color: isCatActive ? '#ffffff' : group.color,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          transition: 'color 180ms ease',
                        }}>
                          {group.name}
                        </span>
                        {/* Skill count badge */}
                        <span style={{
                          fontSize: 9,
                          letterSpacing: '0.1em',
                          padding: '1px 5px',
                          background: `${group.color}18`,
                          border: `1px solid ${group.color}38`,
                          color: `${group.color}90`,
                          flexShrink: 0,
                        }}>
                          {group.items.length}
                        </span>
                      </button>

                      {/* ── Skill items ── */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '3px 0' }}>
                        {group.items.map(([name, rank]) => {
                          const skillId = `skill_${group.name}_${name}`;
                          const isActive = selected?.id === skillId;

                          return (
                            <button
                              key={skillId}
                              type="button"
                              onClick={() => handleMenuSelect(skillId)}
                              className="w-full text-left cursor-pointer"
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '5px 14px 5px 22px',
                                background: isActive ? `${group.color}14` : 'transparent',
                                borderLeft: `2px solid ${isActive ? group.color : 'transparent'}`,
                                transition: 'background 140ms ease, border-color 140ms ease',
                              }}
                            >
                              <span style={{
                                color: isActive ? '#ffffff' : 'rgba(165,185,225,0.65)',
                                fontSize: 10,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'color 140ms ease',
                              }}>
                                {name}
                              </span>
                              <span style={{
                                fontSize: 9,
                                padding: '1px 5px',
                                background: isActive ? `${group.color}28` : `${group.color}10`,
                                border: `1px solid ${isActive ? `${group.color}65` : `${group.color}28`}`,
                                color: isActive ? group.color : `${group.color}70`,
                                letterSpacing: '0.12em',
                                flexShrink: 0,
                                transition: 'all 140ms ease',
                              }}>
                                {rank}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>

          <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.45, pointerEvents: 'none' }}>
            drag · click node to inspect
          </div>
        </div>
      </div>
    </PageShell>
  );
}

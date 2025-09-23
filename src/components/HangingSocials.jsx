import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// --- Constants & Tunables ---
const ROPE_SEGMENTS = 15;
const SEGMENT_LENGTH = 18;
const GRAVITY = 980;
const DAMPING = 0.99;
const CONSTRAINT_ITERATIONS = 4;
const PENDULUM_SWAY = 0.01;
const MAX_STRETCH_FACTOR = 1.8;
const DRAG_START_THRESHOLD = 8;
const DRAG_HOLD_DURATION = 200;
const ROPE_COLOR = "#19d7c9";

function createRope(anchorX, anchorY) {
	const particles = Array.from({ length: ROPE_SEGMENTS + 1 }).map((_, i) => ({
		pos: new THREE.Vector2(anchorX, anchorY + i * 10),
		prev: new THREE.Vector2(anchorX, anchorY + i * 10),
	}));
	if (particles[1]) {
		particles[1].pos.x += (Math.random() * 2 - 1) * 5;
	}
	return {
		particles,
		segLen: SEGMENT_LENGTH,
		restLength: ROPE_SEGMENTS * SEGMENT_LENGTH,
	};
}

function useRopesPhysics(specs) {
	const ropesRef = useRef([]);
	const draggingState = useRef({ index: -1, offset: new THREE.Vector2() });

	useEffect(() => {
		ropesRef.current = specs.map((s) => createRope(s.anchorX, s.anchorY));
	}, [specs]);

	const startDrag = useCallback((ropeIndex, pointerX, pointerY) => {
		const rope = ropesRef.current[ropeIndex];
		if (!rope) return;
		const endpoint = rope.particles[rope.particles.length - 1].pos;
		draggingState.current.index = ropeIndex;
		draggingState.current.offset.set(endpoint.x - pointerX, endpoint.y - pointerY);
	}, []);

	const moveDrag = useCallback((pointerX, pointerY) => {
		const { index, offset } = draggingState.current;
		if (index === -1) return;
		const rope = ropesRef.current[index];
		const endpoint = rope.particles[rope.particles.length - 1];
		endpoint.pos.set(pointerX + offset.x, pointerY + offset.y);
	}, []);

	const endDrag = useCallback(() => {
		draggingState.current.index = -1;
	}, []);

	const step = useCallback((dt) => {
		ropesRef.current.forEach((rope, ropeIndex) => {
			const { particles, segLen, restLength } = rope;
			for (let i = 1; i < particles.length; i++) {
				const p = particles[i];
				const tempPos = p.pos.clone();
				const velocity = p.pos.clone().sub(p.prev).multiplyScalar(DAMPING);
				p.pos.add(velocity);
				p.pos.y += GRAVITY * dt * dt;
				p.pos.x += Math.sin(i * 0.1 + performance.now() * 0.001) * PENDULUM_SWAY;
				p.prev.copy(tempPos);
			}
			for (let iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
				for (let i = 0; i < particles.length - 1; i++) {
					const p1 = particles[i];
					const p2 = particles[i + 1];
					const delta = p2.pos.clone().sub(p1.pos);
					const dist = delta.length() || 1;
					const diff = (dist - segLen) / dist;
					const move1 = i === 0 ? 0 : 0.5;
					const move2 = 0.5;
					if (i !== 0) {
						p1.pos.add(delta.clone().multiplyScalar(move1 * diff));
					}
					p2.pos.sub(delta.clone().multiplyScalar(move2 * diff));
				}
			}
			if (draggingState.current.index === ropeIndex) {
				const anchor = particles[0];
				const endpoint = particles[particles.length - 1];
				const totalDelta = endpoint.pos.clone().sub(anchor.pos);
				const totalDist = totalDelta.length();
				const maxLen = restLength * MAX_STRETCH_FACTOR;
				if (totalDist > maxLen) {
					const stretchRatio = maxLen / totalDist;
					endpoint.pos.copy(anchor.pos).add(totalDelta.multiplyScalar(stretchRatio));
				}
			}
		});
	}, []);

	return { ropesRef, startDrag, moveDrag, endDrag, step };
}

function RopesRenderer({ anchors }) {
	const { size } = useThree();
	const [specs, setSpecs] = useState([]);
	const linesRef = useRef([]);
	const iconsRef = useRef([]);

	const { ropesRef, startDrag, moveDrag, endDrag, step } = useRopesPhysics(specs);

	useEffect(() => {
		const timer = setTimeout(() => {
			const iconNodes = Array.from(document.querySelectorAll(".social-icons a"));
			if (iconNodes.length === 0) return;
            iconsRef.current = iconNodes;

			const calculateSpecs = () => {
				const newSpecs = anchors.map((pageIndex, i) => {
					const el = iconNodes[i];
					const rect = el ? el.getBoundingClientRect() : { left: 50 + i * 50, width: 40, top: 50 };
					const anchorX = Math.round(rect.left + rect.width / 2);
					const anchorY = pageIndex * window.innerHeight + rect.top + rect.height / 2;
					return { anchorX, anchorY };
				});
				setSpecs(newSpecs);
			};
			calculateSpecs();

			iconNodes.forEach((el) => {
				el.style.position = "fixed";
				el.style.top = "0";
				el.style.left = "0";
				el.style.zIndex = "10000";
				el.style.willChange = "transform";
				el.style.userSelect = "none";
				el.style.touchAction = "none";
			});

			const pointerState = { isDown: false, hasMoved: false, holdTimer: null, candidateIndex: -1, startX: 0, startY: 0 };

			const onPointerMove = (e) => {
				if (!pointerState.isDown) return;
				const { clientX: x, clientY: y } = e;
				if (!pointerState.hasMoved) {
					const dist = Math.hypot(x - pointerState.startX, y - pointerState.startY);
					if (dist > DRAG_START_THRESHOLD) {
						clearTimeout(pointerState.holdTimer);
						startDrag(pointerState.candidateIndex, pointerState.startX, pointerState.startY); // Removed scrollY for fixed viewport
						pointerState.hasMoved = true;
					}
				}
				if (pointerState.hasMoved) {
					moveDrag(x, y); // Removed scrollY for fixed viewport
				}
			};

			const onPointerUp = (e) => {
				clearTimeout(pointerState.holdTimer);
				if (pointerState.hasMoved) {
					endDrag();
					e.preventDefault();
					e.stopPropagation();
				}
				pointerState.isDown = false;
				pointerState.hasMoved = false;
				window.removeEventListener("pointermove", onPointerMove);
				window.removeEventListener("pointerup", onPointerUp);
			};

			const onIconPointerDown = (e, iconIndex) => {
				e.stopPropagation();
				const { clientX: x, clientY: y } = e;
				pointerState.isDown = true;
				pointerState.hasMoved = false;
				pointerState.startX = x;
				pointerState.startY = y;
				pointerState.candidateIndex = iconIndex;
				pointerState.holdTimer = setTimeout(() => {
					startDrag(iconIndex, x, y); // Removed scrollY for fixed viewport
					pointerState.hasMoved = true;
				}, DRAG_HOLD_DURATION);
				window.addEventListener("pointermove", onPointerMove);
				window.addEventListener("pointerup", onPointerUp);
			};

			const handlers = iconNodes.map((node, index) => {
				const handler = (e) => onIconPointerDown(e, index);
				node.addEventListener("pointerdown", handler);
				return { node, handler };
			});

			window.addEventListener("resize", calculateSpecs);
			
			return () => {
				window.removeEventListener("resize", calculateSpecs);
				handlers.forEach(({ node, handler }) => {
					node.removeEventListener("pointerdown", handler);
				});
				window.removeEventListener("pointermove", onPointerMove);
				window.removeEventListener("pointerup", onPointerUp);
			};
		}, 100); 

        return () => clearTimeout(timer);

	}, [anchors, startDrag, moveDrag, endDrag]);

	useFrame((_, delta) => {
		step(Math.min(delta, 0.032));
		ropesRef.current.forEach((rope, i) => {
			const anchorSpec = specs[i];
			if (anchorSpec) {
				// Anchor position is now fixed relative to the viewport, so we don't add scrollY
				rope.particles[0].pos.set(anchorSpec.anchorX, anchorSpec.anchorY);
			}
			const points = rope.particles.map((p) => new THREE.Vector3(p.pos.x - size.width / 2, -(p.pos.y - size.height / 2), 0));
			const line = linesRef.current[i];
			if (line) {
				line.geometry.setFromPoints(points);
			}
			const icon = iconsRef.current[i];
			const endpoint = rope.particles[rope.particles.length - 1].pos;
			if (icon) {
				const w = icon.offsetWidth;
				const h = icon.offsetHeight;
				// Icon position is now fixed relative to the viewport
				icon.style.transform = `translate3d(${Math.round(endpoint.x - w / 2)}px, ${Math.round(endpoint.y - h / 2)}px, 0)`;
			}
		});
	});

	return specs.map((_, i) => (
		<line key={i} ref={(ref) => (linesRef.current[i] = ref)}>
			<bufferGeometry />
			<lineBasicMaterial color={ROPE_COLOR} linewidth={2} />
		</line>
	));
}


// THIS IS THE FIX: We provide a default value for the 'anchors' prop
export default function HangingSocials({ anchors = [0, 0, 0] }) {
	return (
		<div className="hanging-socials-canvas">
			<Canvas style={{ pointerEvents: 'none' }} orthographic>
				<RopesRenderer anchors={anchors} />
			</Canvas>
		</div>
	);
}
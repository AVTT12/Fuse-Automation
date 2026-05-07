/* ============================================================
   FUSE — 3D Voice Sphere
   A noise-displaced icosahedron pulsating like a voice waveform
   ============================================================ */

let _sphereInstance = null;

function initSphere() {
  const container = document.getElementById("sphere-canvas");
  if (!container || typeof THREE === "undefined") return;
  // Tear down previous instance (page transitions)
  if (_sphereInstance) {
    _sphereInstance.destroy();
    _sphereInstance = null;
  }

  const scene = new THREE.Scene();
  const w = container.clientWidth;
  const h = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.z = 3.6;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.setSize(w, h);
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  // Geometry: icosahedron with high subdivision so we can displace vertices
  const geometry = new THREE.IcosahedronGeometry(1.2, 32);
  const positionAttr = geometry.getAttribute("position");
  const basePositions = new Float32Array(positionAttr.array);

  // Custom shader-ish material — using MeshStandardMaterial with wireframe overlay
  const material = new THREE.MeshStandardMaterial({
    color: 0x0e1116,
    roughness: 0.55,
    metalness: 0.15,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Wireframe accent
  const wireGeo = new THREE.IcosahedronGeometry(1.22, 4);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xff5a36,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wireMesh);

  // Lights
  const key = new THREE.DirectionalLight(0xff8c66, 1.4);
  key.position.set(2, 2, 3);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xb8c4a8, 0.5);
  fill.position.set(-3, -1, 2);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0xf1ebe0, 0.35));

  // 3D simplex-lite noise (cheap pseudo-noise, good enough for displacement)
  function pseudoNoise(x, y, z, t) {
    return (
      Math.sin(x * 1.4 + t) * 0.35 +
      Math.cos(y * 1.7 - t * 0.8) * 0.32 +
      Math.sin(z * 1.3 + t * 1.2) * 0.33 +
      Math.sin((x + y + z) * 0.9 + t * 0.5) * 0.2
    );
  }

  let mouseX = 0, mouseY = 0;
  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }
  window.addEventListener("mousemove", onMouseMove);

  function onResize() {
    const W = container.clientWidth;
    const H = container.clientHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }
  window.addEventListener("resize", onResize);

  let raf;
  let t = 0;
  function animate() {
    t += 0.012;
    // Displace vertices
    const pos = geometry.getAttribute("position").array;
    for (let i = 0; i < basePositions.length; i += 3) {
      const x = basePositions[i];
      const y = basePositions[i + 1];
      const z = basePositions[i + 2];
      const n = pseudoNoise(x, y, z, t);
      const amp = 0.18 + Math.sin(t * 1.5) * 0.04;
      pos[i] = x + (x * n * amp);
      pos[i + 1] = y + (y * n * amp);
      pos[i + 2] = z + (z * n * amp);
    }
    geometry.getAttribute("position").needsUpdate = true;
    geometry.computeVertexNormals();

    // Gentle rotation, eased toward mouse
    mesh.rotation.x += (mouseY * 0.4 - mesh.rotation.x) * 0.04;
    mesh.rotation.y += (mouseX * 0.4 - mesh.rotation.y) * 0.04;
    mesh.rotation.y += 0.002;
    wireMesh.rotation.copy(mesh.rotation);
    wireMesh.rotation.y -= 0.005;
    wireMesh.scale.setScalar(1 + Math.sin(t * 1.3) * 0.03);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }
  animate();

  _sphereInstance = {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    },
  };
}

window.initSphere = initSphere;

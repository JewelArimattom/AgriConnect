import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Postprocessing composer
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // Bloom glow effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2, // intensity
      0.6,
      0.85
    );
    composer.addPass(bloomPass);

    // Particles (like floating grains in sunlight)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 80; // spread
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xfacc15, // warm golden (like grain dust)
      size: 0.5,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfff3c4, 1);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Mouse interaction (parallax effect)
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animate
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Floating particle motion
      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;

      // Camera parallax
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      composer.render();
    };

    animate();

    // Resize handling
    const handleResize = () => {
      if (canvasRef.current) {
        camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        composer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative bg-white min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-yellow-100">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center lg:justify-start h-screen">
        <div className="text-center lg:text-left z-10 w-full lg:w-1/2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-xl border border-gray-100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Fresh Farm Products
              <span className="block text-green-600 mt-2">Direct to You</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Source the finest produce, dairy, and meats directly from local farms.
              Quality you can taste, from farmers you can trust.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="flex-grow p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white text-gray-900 placeholder-gray-500 shadow-sm"
              />
              <button className="bg-green-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Search
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Popular:{" "}
              <button className="text-green-600 hover:text-green-700 font-medium transition-colors">
                Organic Vegetables
              </button>
              ,{" "}
              <button className="text-green-600 hover:text-green-700 font-medium transition-colors">
                Fresh Eggs
              </button>
              ,{" "}
              <button className="text-green-600 hover:text-green-700 font-medium transition-colors">
                Dairy Products
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

// HeroSection.tsx
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import * as THREE from 'three';

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create floating geometric shapes representing farm products
    const geometries = [
      new THREE.SphereGeometry(1, 16, 16),    // Fruits
      new THREE.CylinderGeometry(0.8, 0.8, 2, 16), // Vegetables
      new THREE.BoxGeometry(1.5, 1.5, 1.5),   // Packages
      new THREE.DodecahedronGeometry(1, 0),   // Organic shapes
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x4ade80, transparent: true, opacity: 0.8 }), // Green
      new THREE.MeshPhongMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 }), // Amber
      new THREE.MeshPhongMaterial({ color: 0x84cc16, transparent: true, opacity: 0.8 }), // Lime
      new THREE.MeshPhongMaterial({ color: 0x22c55e, transparent: true, opacity: 0.8 }), // Emerald
    ];

    const objects: THREE.Mesh[] = [];
    const objectCount = 12;

    for (let i = 0; i < objectCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)].clone();
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position objects in a sphere
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
      mesh.position.z = radius * Math.cos(phi);
      
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      scene.add(mesh);
      objects.push(mesh);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate objects
      objects.forEach((object, index) => {
        const speed = 0.2 + index * 0.05;
        object.rotation.x += 0.01;
        object.rotation.y += 0.008;
        
        // Floating animation
        object.position.y += Math.sin(elapsedTime * speed + index) * 0.01;
      });

      // Camera movement based on mouse
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (canvasRef.current) {
        camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometries.forEach(geom => geom.dispose());
      materials.forEach(mat => mat.dispose());
    };
  }, []);

  return (
    <div className="relative bg-white min-h-screen overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>
      
      {/* 3D Canvas */}
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
              Popular: {' '}
              <button className="text-green-600 hover:text-green-700 font-medium transition-colors">
                Organic Vegetables
              </button>
              , {' '}
              <button className="text-green-600 hover:text-green-700 font-medium transition-colors">
                Fresh Eggs
              </button>
              , {' '}
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
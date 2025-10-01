import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroSection = () => {
  const [location, setLocation] = useState('');
  const [product, setProduct] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    const shapes: THREE.Mesh[] = [];
    const geometries = [
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.TetrahedronGeometry(0.3),
      new THREE.OctahedronGeometry(0.3),
    ];

    for (let i = 0; i < 20; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.3 + Math.random() * 0.1, 0.6, 0.5),
        transparent: true,
        opacity: 0.4,
        shininess: 100,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (Math.random() - 0.5) * 10;
      mesh.position.y = (Math.random() - 0.5) * 10;
      mesh.position.z = (Math.random() - 0.5) * 5;

      mesh.userData = {
        velocity: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01,
        },
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
      };

      scene.add(mesh);
      shapes.push(mesh);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x22c55e, 1, 100);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      shapes.forEach((shape) => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.rotation.z += shape.userData.rotationSpeed.z;

        shape.position.x += shape.userData.velocity.x;
        shape.position.y += shape.userData.velocity.y;
        shape.position.z += shape.userData.velocity.z;

        if (Math.abs(shape.position.x) > 5) shape.userData.velocity.x *= -1;
        if (Math.abs(shape.position.y) > 5) shape.userData.velocity.y *= -1;
        if (Math.abs(shape.position.z) > 3) shape.userData.velocity.z *= -1;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometries.forEach(g => g.dispose());
      shapes.forEach(s => {
        if (s.geometry) s.geometry.dispose();
        // Type assertion to inform TypeScript about the material property
        if ((s as THREE.Mesh).material) {
            // Check if material is an array
            const material = (s as THREE.Mesh).material;
            if (Array.isArray(material)) {
                material.forEach(m => m.dispose());
            } else {
                material.dispose();
            }
        }
      });
    };
  }, []);

  const handleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Searching for:', { location, product });
  };

  return (
    <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-center py-12 px-4 sm:py-20 overflow-hidden min-h-screen flex items-center">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      <div className="relative z-10 w-full">
        <h1
          className={`text-4xl md:text-6xl font-bold text-gray-800 mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            transitionDelay: '200ms',
          }}
        >
          Connect Directly with Local Farmers
        </h1>

        <p
          className={`text-lg md:text-xl text-gray-600 mb-10 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          Find fresh, local produce right from the source.
        </p>

        <div
          className={`max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mb-10 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your Village/Town..."
            className="flex-grow p-4 border-2 border-green-200 rounded-lg backdrop-blur-sm bg-white/80 focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 focus:scale-105 hover:shadow-xl outline-none"
          />
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g., 'Organic Tomatoes'"
            className="p-4 border-2 border-green-200 rounded-lg backdrop-blur-sm bg-white/80 focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 focus:scale-105 hover:shadow-xl outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl active:scale-95"
          >
            Search
          </button>
        </div>

        <div
          className={`my-10 flex items-center justify-center transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <span className="h-px bg-gray-400 w-24 transition-all duration-500 hover:w-32"></span>
          <span className="mx-6 font-semibold text-gray-700 text-lg">OR</span>
          <span className="h-px bg-gray-400 w-24 transition-all duration-500 hover:w-32"></span>
        </div>

        <button
          onClick={() => (window.location.href = '/productspage')}
          className={`inline-block bg-white text-green-700 font-bold py-4 px-12 rounded-full border-2 border-green-600 hover:bg-green-600 hover:text-white transition-all duration-500 transform hover:scale-110 shadow-lg hover:shadow-2xl active:scale-95 cursor-pointer ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{
            transitionDelay: '1000ms',
            backdropFilter: 'blur(10px)',
          }}
        >
          Browse Full Collection
        </button>
      </div>

      <div className="absolute top-10 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
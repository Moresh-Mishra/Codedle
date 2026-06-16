import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Play, Zap, Lock, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Utility function
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

// Shader Background Hook
const useShaderBackground = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(undefined);
  const rendererRef = useRef(null);
  const pointersRef = useRef(null);

  class WebGLRenderer {
    constructor(canvas, scale) {
      this.canvas = canvas;
      this.scale = scale;
      this.gl = canvas.getContext("webgl2");
      if (!this.gl) {
        console.error("WebGL2 not supported");
        return;
      }
      this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
      this.shaderSource = defaultShaderSource;
      this.program = null;
      this.vs = null;
      this.fs = null;
      this.buffer = null;
      this.mouseMove = [0, 0];
      this.mouseCoords = [0, 0];
      this.pointerCoords = [0, 0];
      this.nbrOfPointers = 0;
      this.vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;
      this.vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
    }

    updateShader(source) {
      this.reset();
      this.shaderSource = source;
      this.setup();
      this.init();
    }

    updateMove(deltas) {
      this.mouseMove = deltas;
    }

    updateMouse(coords) {
      this.mouseCoords = coords;
    }

    updatePointerCoords(coords) {
      this.pointerCoords = coords;
    }

    updatePointerCount(nbr) {
      this.nbrOfPointers = nbr;
    }

    updateScale(scale) {
      this.scale = scale;
      this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
    }

    compile(shader, source) {
      const gl = this.gl;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        console.error("Shader compilation error:", error);
      }
    }

    test(source) {
      let result = null;
      const gl = this.gl;
      const shader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        result = gl.getShaderInfoLog(shader);
      }
      gl.deleteShader(shader);
      return result;
    }

    reset() {
      const gl = this.gl;
      if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
        if (this.vs) {
          gl.detachShader(this.program, this.vs);
          gl.deleteShader(this.vs);
        }
        if (this.fs) {
          gl.detachShader(this.program, this.fs);
          gl.deleteShader(this.fs);
        }
        gl.deleteProgram(this.program);
      }
    }

    setup() {
      const gl = this.gl;
      this.vs = gl.createShader(gl.VERTEX_SHADER);
      this.fs = gl.createShader(gl.FRAGMENT_SHADER);
      this.compile(this.vs, this.vertexSrc);
      this.compile(this.fs, this.shaderSource);
      this.program = gl.createProgram();
      gl.attachShader(this.program, this.vs);
      gl.attachShader(this.program, this.fs);
      gl.linkProgram(this.program);

      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(this.program));
      }
    }

    init() {
      const gl = this.gl;
      const program = this.program;

      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      program.resolution = gl.getUniformLocation(program, "resolution");
      program.time = gl.getUniformLocation(program, "time");
      program.move = gl.getUniformLocation(program, "move");
      program.touch = gl.getUniformLocation(program, "touch");
      program.pointerCount = gl.getUniformLocation(program, "pointerCount");
      program.pointers = gl.getUniformLocation(program, "pointers");
    }

    render(now = 0) {
      const gl = this.gl;
      const program = this.program;

      if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

      gl.uniform2f(program.resolution, this.canvas.width, this.canvas.height);
      gl.uniform1f(program.time, now * 1e-3);
      gl.uniform2f(program.move, this.mouseMove[0], this.mouseMove[1]);
      gl.uniform2f(program.touch, this.mouseCoords[0], this.mouseCoords[1]);
      gl.uniform1i(program.pointerCount, this.nbrOfPointers);
      gl.uniform2fv(program.pointers, this.pointerCoords);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  class PointerHandler {
    constructor(element, scale) {
      this.scale = scale;
      this.active = false;
      this.pointers = new Map();
      this.lastCoords = [0, 0];
      this.moves = [0, 0];

      const map = (element, scale, x, y) =>
        [x * scale, element.height - y * scale];

      element.addEventListener("pointerdown", (e) => {
        this.active = true;
        this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
      });

      element.addEventListener("pointerup", (e) => {
        if (this.count === 1) {
          this.lastCoords = this.first;
        }
        this.pointers.delete(e.pointerId);
        this.active = this.pointers.size > 0;
      });

      element.addEventListener("pointerleave", (e) => {
        if (this.count === 1) {
          this.lastCoords = this.first;
        }
        this.pointers.delete(e.pointerId);
        this.active = this.pointers.size > 0;
      });

      element.addEventListener("pointermove", (e) => {
        if (!this.active) return;
        this.lastCoords = [e.clientX, e.clientY];
        this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
        this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
      });
    }

    getScale() {
      return this.scale;
    }

    updateScale(scale) {
      this.scale = scale;
    }

    get count() {
      return this.pointers.size;
    }

    get move() {
      return this.moves;
    }

    get coords() {
      return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [0, 0];
    }

    get first() {
      return this.pointers.values().next().value || this.lastCoords;
    }
  }

  const resize = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    if (rendererRef.current) {
      rendererRef.current.updateScale(dpr);
    }
  };

  const loop = (now) => {
    if (!rendererRef.current || !pointersRef.current) return;

    rendererRef.current.updateMouse(pointersRef.current.first);
    rendererRef.current.updatePointerCount(pointersRef.current.count);
    rendererRef.current.updatePointerCoords(pointersRef.current.coords);
    rendererRef.current.updateMove(pointersRef.current.move);
    rendererRef.current.render(now);
    animationFrameRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    rendererRef.current = new WebGLRenderer(canvas, dpr);
    pointersRef.current = new PointerHandler(canvas, dpr);

    rendererRef.current.setup();
    rendererRef.current.init();

    resize();

    if (rendererRef.current.test(defaultShaderSource) === null) {
      rendererRef.current.updateShader(defaultShaderSource);
    }

    loop(0);

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.reset();
      }
    };
  }, []);

  return canvasRef;
};

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}

float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}

float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}

void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  O=vec4(col,1);
}`;

function CoddleLanding() {
  const canvasRef = useShaderBackground();
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Mystery", "Challenge", "Puzzle", "Quest"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover touch-none"
        style={{ background: "black" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full px-6 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <Code2 className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white tracking-tight">Codedle</span>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#features" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">
              How It Works
            </a>
            <a href="#leaderboard" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">
              Leaderboard
            </a>
          </motion.nav>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-300 font-medium">Daily Coding Challenge</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-none">
                Crack the Code
              </h1>
              <div className="h-20 md:h-24 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentWord}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                  >
                    {words[currentWord]}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Solve a new coding mystery every day. Analyze clues, deduce patterns, and unlock the solution. Are you
              ready to test your skills?
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                onClick={() => navigate('/game')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-lg text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Playing
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full font-semibold text-lg text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                View Demo
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              {[
                { icon: Lock, label: "New Mystery Daily", desc: "Fresh challenges every 24 hours" },
                { icon: Trophy, label: "Compete & Win", desc: "Climb the global leaderboard" },
                { icon: Users, label: "Join Community", desc: "10,000+ active solvers" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 float-animation"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <item.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">{item.label}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>

        <footer className="w-full px-6 py-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-sm text-gray-500"
          >
            © 2024 Codedle. A new mystery awaits.
          </motion.p>
        </footer>
      </div>
    </div>
  );
}

export default function CoddleLandingPage() {
  return <CoddleLanding />;
}

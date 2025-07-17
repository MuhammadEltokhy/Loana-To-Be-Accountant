
    const canvas = document.getElementById('graph');
    const ctx = canvas.getContext('2d');
    const btnSimple = document.getElementById('btn-simple');
    const btnCompound = document.getElementById('btn-compound');
    const sliders = {
      P: document.getElementById('slider-P'),
      r: document.getElementById('slider-r'),
      t: document.getElementById('slider-t'),
      n: document.getElementById('slider-n'),
    };
    const labels = {
      P: document.getElementById('val-P'),
      r: document.getElementById('val-r'),
      t: document.getElementById('val-t'),
      n: document.getElementById('val-n'),
    };
    const rowN = document.getElementById('row-n');

    let mode = 'simple';
    let animationId;
    function resize() {
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      draw();
    }

    window.addEventListener('resize', resize);
    resize();
    Object.keys(sliders).forEach(key => {
      sliders[key].addEventListener('input', () => {
        labels[key].textContent = sliders[key].value;
        labels[key].style.transform = 'scale(1.1)';
        setTimeout(() => {
          labels[key].style.transform = 'scale(1)';
        }, 150);
        draw();
      });
    });

    btnSimple.addEventListener('click', () => {
      if (mode === 'simple') return;
      mode = 'simple';
      btnSimple.classList.add('active');
      btnCompound.classList.remove('active');
      
      rowN.style.transform = 'translateX(20px)';
      rowN.style.opacity = '0';
      setTimeout(() => {
        rowN.style.display = 'none';
      }, 300);
      
      draw();
    });

    btnCompound.addEventListener('click', () => {
      if (mode === 'compound') return;
      mode = 'compound';
      btnCompound.classList.add('active');
      btnSimple.classList.remove('active');
      
      rowN.style.display = 'flex';
      setTimeout(() => {
        rowN.style.transform = 'translateX(0)';
        rowN.style.opacity = '1';
      }, 10);
      
      draw();
    });

    function drawGrid() {
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      const margin = 60;
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.1)';
      ctx.lineWidth = 0.5;
      
      // vertical grid lines
      for (let i = 0; i <= 10; i++) {
        const x = margin + (i / 10) * (w - margin - 40);
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, h - margin);
        ctx.stroke();
      }
      for (let i = 0; i <= 10; i++) {
        const y = margin + (i / 10) * (h - 2 * margin);
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(w - 40, y);
        ctx.stroke();
      }
    }
    function drawAxes() {
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      const margin = 60;
      
      ctx.clearRect(0, 0, w, h);
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, 'rgba(138, 43, 226, 0.03)');
      gradient.addColorStop(1, 'rgba(10, 5, 25, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      
      drawGrid();
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.8)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(138, 43, 226, 0.5)';
      ctx.shadowBlur = 10;
      
      // x-axis
      ctx.beginPath();
      ctx.moveTo(margin, h - margin);
      ctx.lineTo(w - 40, h - margin);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(margin, h - margin);
      ctx.lineTo(margin, margin);
      ctx.stroke();
      ctx.fillStyle = 'rgba(138, 43, 226, 0.8)';
      ctx.beginPath();
      ctx.moveTo(w - 40, h - margin);
      ctx.lineTo(w - 50, h - margin - 5);
      ctx.lineTo(w - 50, h - margin + 5);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(margin, margin);
      ctx.lineTo(margin - 5, margin + 10);
      ctx.lineTo(margin + 5, margin + 10);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function draw() {
      drawAxes();
      const P = parseFloat(sliders.P.value);
      const r = parseFloat(sliders.r.value) / 100;
      const tmax = parseFloat(sliders.t.value);
      const n = parseInt(sliders.n.value, 10);
      
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      const margin = 60;
      const graphWidth = w - margin - 40;
      const graphHeight = h - 2 * margin;
      const points = [];
      const steps = 500;
      for (let i = 0; i <= steps; i++) {
        const x = tmax * (i / steps);
        let y;
        if (mode === 'simple') {
          y = P * (1 + r * x);
        } else {
          y = P * Math.pow(1 + r / n, n * x);
        }
        points.push({ x, y });
      }
      
      const ymax = Math.max(...points.map(p => p.y));
      const ymin = Math.min(...points.map(p => p.y));
      const yrange = ymax - ymin || 1;
      const areaGradient = ctx.createLinearGradient(0, margin, 0, h - margin);
      areaGradient.addColorStop(0, 'rgba(138, 43, 226, 0.3)');
      areaGradient.addColorStop(1, 'rgba(138, 43, 226, 0.05)');
      
      ctx.fillStyle = areaGradient;
      ctx.beginPath();
      ctx.moveTo(margin, h - margin);
      points.forEach(p => {
        const px = margin + (p.x / tmax) * graphWidth;
        const py = h - margin - ((p.y - ymin) / yrange) * graphHeight;
        ctx.lineTo(px, py);
      });
      
      ctx.lineTo(margin + graphWidth, h - margin);
      ctx.lineTo(margin, h - margin);
      ctx.fill();
      ctx.strokeStyle = mode === 'simple' ? '#ff6b6b' : '#4ecdc4';
      ctx.lineWidth = 3;
      ctx.shadowColor = mode === 'simple' ? '#ff6b6b' : '#4ecdc4';
      ctx.shadowBlur = 15;
      
      ctx.beginPath();
      points.forEach((p, i) => {
        const px = margin + (p.x / tmax) * graphWidth;
        const py = h - margin - ((p.y - ymin) / yrange) * graphHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = mode === 'simple' ? '#ff6b6b' : '#4ecdc4';
      
      for (let i = 0; i <= 10; i++) {
        const pointIndex = Math.floor((i / 10) * (points.length - 1));
        const p = points[pointIndex];
        const px = margin + (p.x / tmax) * graphWidth;
        const py = h - margin - ((p.y - ymin) / yrange) * graphHeight;
        
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowColor = mode === 'simple' ? '#ff6b6b' : '#4ecdc4';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      ctx.fillStyle = '#e8e8f0';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Time (years): 0 → ${tmax}`, margin + graphWidth / 2, h - 20);
      ctx.save();
      ctx.translate(20, margin + graphHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`Amount: ${ymin.toFixed(0)} → ${ymax.toFixed(0)}`, 0, 0);
      ctx.restore();
      ctx.fillStyle = 'rgba(138, 43, 226, 0.9)';
      ctx.fillRect(w - 200, 20, 180, mode === 'compound' ? 100 : 80);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Principal: $${P.toLocaleString()}`, w - 190, 40);
      ctx.fillText(`Rate: ${r * 100}%`, w - 190, 55);
      ctx.fillText(`Time: ${tmax} years`, w - 190, 70);
      if (mode === 'compound') {
        ctx.fillText(`Compounded: ${n}x/year`, w - 190, 85);
      }
      
      const finalAmount = mode === 'simple' 
        ? P * (1 + r * tmax)
        : P * Math.pow(1 + r / n, n * tmax);
      
      ctx.fillStyle = '#4ecdc4';
      ctx.fillText(`Final: $${finalAmount.toLocaleString()}`, w - 190, mode === 'compound' ? 100 : 85);
    }
    setTimeout(() => {
      draw();
    }, 100);
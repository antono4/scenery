// DOM Elements
const rotateDiv = document.getElementById('rot');
const rotateIcons = document.getElementById('rot-icons');
const clickRotateDiv = document.getElementById('click-rot');
const toggles = document.querySelectorAll('.toggle');
const tempElement = document.querySelector('.temp');
const sixths = Array.from(document.querySelectorAll('.sixths'));

// State
let angle = 0;
let currentTempF = 34;
let isAnimating = false;
let currentIndex = 0;

// Weather modes configuration
const weatherModes = [
  { id: 'sun', temp: 34, classes: [] },
  { id: 'sunset', temp: 27, classes: ['sunset'] },
  { id: 'moon', temp: 14, classes: ['moon'] },
  { id: 'clouds', temp: 16, classes: ['clouds'] },
  { id: 'storm', temp: 8, classes: ['storm'] },
  { id: 'snow', temp: -4, classes: ['snow'] }
];

// Create rotating dial gradient
function createDialGradient() {
  const step = 2;
  const color1 = 'rgba(0,0,0,0.5)';
  const color2 = 'rgba(0,0,0,0.1)';
  let gradient = 'conic-gradient(';
  
  for (let i = 0; i < 360; i += step) {
    const color = i % (2 * step) === 0 ? color1 : color2;
    gradient += `${color} ${i}deg, `;
  }
  gradient = gradient.slice(0, -2) + '), rgb(85 93 108)';
  
  rotateDiv.style.background = gradient;
}

// Rotation handler
clickRotateDiv.onclick = function() {
  angle += 60;
  rotateDiv.style.transform = `rotate(${angle}deg)`;
  rotateIcons.style.transform = `rotate(${angle}deg)`;
  
  // Add subtle pulse animation
  clickRotateDiv.style.transform = 'scale(0.95)';
  setTimeout(() => {
    clickRotateDiv.style.transform = 'scale(1)';
  }, 150);
};

// Temperature unit toggle
toggles.forEach(toggle => {
  toggle.addEventListener('click', function() {
    if (this.classList.contains('active') || isAnimating) return;
    
    toggles.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    
    const tempValue = parseFloat(tempElement.textContent);
    if (this.id === 'toggle-cel') {
      const celsius = Math.round((tempValue - 32) * 5 / 9);
      tempElement.textContent = `${celsius}°C`;
    } else {
      const fahrenheit = Math.round(tempValue * 9 / 5 + 32);
      tempElement.textContent = `${fahrenheit}°F`;
    }
  });
});

// Easing function
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Temperature animation
function changeTemp(element, newTemp) {
  const unit = element.innerHTML.includes('F') ? '°F' : '°C';
  const currentTemp = unit === '°F' ? currentTempF : Math.round((currentTempF - 32) * 5 / 9);
  const finalTemp = unit === '°F' ? newTemp : Math.round((newTemp - 32) * 5 / 9);
  
  const duration = 2000;
  let startTime = null;

  function animate(currentTime) {
    if (startTime === null) startTime = currentTime;
    
    let elapsed = currentTime - startTime;
    let progress = Math.min(elapsed / duration, 1);
    progress = easeInOutCubic(progress);
    
    const tempNow = Math.round(currentTemp + (progress * (finalTemp - currentTemp)));
    element.innerHTML = `${tempNow}${unit}`;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      currentTempF = newTemp;
      isAnimating = false;
    }
  }

  isAnimating = true;
  requestAnimationFrame(animate);
}

// Weather mode switching
function switchWeatherMode(index) {
  const mode = weatherModes[index];
  const mountains = document.querySelector('#mountains');
  
  // Remove all weather classes
  weatherModes.forEach(m => {
    m.classes.forEach(c => mountains.classList.remove(c));
  });
  
  // Add new weather classes
  mode.classes.forEach(c => mountains.classList.add(c));
  
  // Update temperature with animation
  changeTemp(tempElement, mode.temp);
  
  // Update sixths indicator
  sixths[currentIndex].classList.remove('active');
  sixths[index].classList.add('active');
  currentIndex = index;
  
  // Loading bar animation
  const loadingBar = document.querySelector('.loading-bar');
  loadingBar.classList.add('active');
  setTimeout(() => loadingBar.classList.remove('active'), 1200);
  
  console.log(`Weather mode: ${mode.id}`);
}

// Initialize on load
window.onload = function() {
  createDialGradient();
  
  document.querySelector('#rot-icons').addEventListener('click', () => {
    const nextIndex = (currentIndex + 1) % weatherModes.length;
    switchWeatherMode(nextIndex);
    
    // Rotate dial
    angle += 60;
    rotateDiv.style.transform = `rotate(${angle}deg)`;
    rotateIcons.style.transform = `rotate(${angle}deg)`;
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      const nextIndex = (currentIndex + 1) % weatherModes.length;
      switchWeatherMode(nextIndex);
      angle += 60;
      rotateDiv.style.transform = `rotate(${angle}deg)`;
      rotateIcons.style.transform = `rotate(${angle}deg)`;
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + weatherModes.length) % weatherModes.length;
      switchWeatherMode(prevIndex);
      angle -= 60;
      rotateDiv.style.transform = `rotate(${angle}deg)`;
      rotateIcons.style.transform = `rotate(${angle}deg)`;
    }
  });
};

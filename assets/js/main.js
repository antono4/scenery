var rotateDiv = document.getElementById('rot');
var rotateIcons = document.getElementById('rot-icons');
var clickRotateDiv = document.getElementById('click-rot');
var angle = 0;

clickRotateDiv.onclick = function() {
  angle += 60;
  rotateDiv.style.transform = 'rotate(' + angle + 'deg)';
  rotateIcons.style.transform = 'rotate(' + angle + 'deg)';
};

var step = 2;
var color1 = 'rgba(0,0,0,0.5)';
var color2 = 'rgba(0,0,0,0.1)';

var gradient = ' conic-gradient(';
for (var i = 0; i < 360; i += step) {
  var color = i % (2 * step) === 0 ? color1 : color2;
  gradient += color + ' ' + i + 'deg, ';
}
gradient = gradient.slice(0, -2) + '), rgb(85 93 108)'; 

rotateDiv.style.background = gradient;


var toggles = document.querySelectorAll('.toggle');
var tempElement = document.querySelector('.temp');

let isAnimating = false; // Add flag to indicate if animation is active

toggles.forEach(function(toggle) {
  toggle.addEventListener('click', function() {
    if (this.classList.contains('active') || isAnimating) { // Check if animation is active
      return;
    }
    toggles.forEach(function(toggle) {
      toggle.classList.remove('active');
    });
    this.classList.add('active');
    var tempValue = parseFloat(tempElement.textContent);
    if (this.id === 'toggle-cel') {
      var celsius = Math.round((tempValue - 32) * 5 / 9);
      tempElement.textContent = celsius + '°C';
    } else if (this.id === 'toggle-far') {
      var fahrenheit = Math.round(tempValue * 9 / 5 + 32);
      tempElement.textContent = fahrenheit + '°F';
    }
  });
});

let currentTempF = 34; // Initialize with the initial temperature in Fahrenheit

// cubic ease in/out function
function easeInOutCubic(t) {
  return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
}

function changeTemp(element, newTemp) {
  let unit = element.innerHTML.includes("F") ? "°F" : "°C";
  let currentTemp = unit === "°F" ? currentTempF : Math.round((currentTempF - 32) * 5 / 9);
  let finalTemp = unit === "°F" ? newTemp : Math.round((newTemp - 32) * 5 / 9);

  let duration = 2000; // Duration of the animation in milliseconds
  let startTime = null;

  function animate(currentTime) {
    if (startTime === null) {
      startTime = currentTime;
    }

    let elapsed = currentTime - startTime;
    let progress = Math.min(elapsed / duration, 1);
    progress = easeInOutCubic(progress);

    let tempNow = Math.round(currentTemp + (progress * (finalTemp - currentTemp)));
    element.innerHTML = `${tempNow}${unit}`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Update currentTempF once the animation is complete
      currentTempF = newTemp;
      isAnimating = false; // Reset the flag when animation is done
    }
  }

  isAnimating = true; // Set flag when animation starts
  requestAnimationFrame(animate);
}


window.onload = function() {
  const sixths = Array.from(document.querySelectorAll('.sixths'));
  let index = 0;
  let temp = document.querySelector('.temp');

  document.querySelector('#rot-icons').addEventListener('click', () => {
    sixths[index].classList.remove('active');
    index = (index + 1) % sixths.length;
    sixths[index].classList.add('active');
    if (index == 0 ) {
      changeTemp(temp, 34);
      console.log("sun")
      document.querySelector('#mountains').classList.remove("snow");
      document.querySelector('#mountains').classList.remove("clouds");
    } else if (index == 1) {
      changeTemp(temp, 27);
      console.log("sunset")
      document.querySelector('#mountains').classList.add("sunset");
    } else if (index == 2) {
      changeTemp(temp, 14);
      console.log("moon")
      document.querySelector('#mountains').classList.remove("sunset");
      document.querySelector('#mountains').classList.add("moon");
    } else if (index == 3) {
      changeTemp(temp, 16);
      console.log("clouds")
      document.querySelector('#mountains').classList.add("clouds");
    } else if (index == 4) {
      changeTemp(temp, 8);
      console.log("storm")
      document.querySelector('#mountains').classList.add("storm");
    } else if (index == 5) {
      changeTemp(temp, -4);
      console.log("snow")
      document.querySelector('#mountains').classList.remove("moon");
      document.querySelector('#mountains').classList.remove("storm");
      document.querySelector('#mountains').classList.add("snow");
    }

    let loadingBar = document.querySelector('.loading-bar');
    loadingBar.classList.add('active');
  
    setTimeout(() => {
      loadingBar.classList.remove('active');
    }, 1200);
  });
  
  // Update weather info when mode changes
  function updateWeatherInfo(humidity, wind) {
    const humidityElement = document.getElementById('humidity');
    const windElement = document.getElementById('wind');
    if (humidityElement) humidityElement.textContent = humidity + '%';
    if (windElement) windElement.textContent = wind + ' km/h';
  }
  
  // Time display
  function updateTime() {
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    if (timeElement && dateElement) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      timeElement.textContent = hours + ':' + minutes;
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
  }
  
  // Initialize time
  updateTime();
  setInterval(updateTime, 1000);
  
  // Weather data for each mode
  const weatherData = [
    { humidity: 45, wind: 8 },   // sun
    { humidity: 55, wind: 12 }, // sunset
    { humidity: 60, wind: 5 },  // moon
    { humidity: 70, wind: 15 }, // clouds
    { humidity: 85, wind: 35 }, // storm
    { humidity: 80, wind: 10 }  // snow
  ];
  
  // Update weather on mode change
  const originalClickHandler = sixths[index];
  document.querySelector('#rot-icons').addEventListener('click', () => {
    const weatherInfo = weatherData[index];
    updateWeatherInfo(weatherInfo.humidity, weatherInfo.wind);
  });
  
  // Sound toggle
  let soundEnabled = false;
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', function() {
      soundEnabled = !soundEnabled;
      this.classList.toggle('active', soundEnabled);
      this.querySelector('.icon').textContent = soundEnabled ? '🔊' : '🔇';
    });
  }
  
  // Auto cycle toggle
  let autoCycleEnabled = false;
  const autoCycle = document.getElementById('auto-cycle');
  if (autoCycle) {
    autoCycle.addEventListener('click', function() {
      autoCycleEnabled = !autoCycleEnabled;
      this.classList.toggle('active', autoCycleEnabled);
      this.querySelector('.icon').textContent = autoCycleEnabled ? '⏸️' : '🔄';
    });
  }
  
  // Speed control
  const speedControl = document.getElementById('speed-control');
  if (speedControl) {
    const speedIcons = ['▶', '⏩', '⚡'];
    let speedIndex = 0;
    speedControl.addEventListener('click', function() {
      speedIndex = (speedIndex + 1) % speedIcons.length;
      this.querySelector('.icon').textContent = speedIcons[speedIndex];
    });
  }
  
  // Day/Night Mode Toggle
  const dayNightToggle = document.getElementById('day-night-toggle');
  let isNightMode = true;
  
  // Check current time and set initial mode
  function checkTimeBasedMode() {
    const hour = new Date().getHours();
    // Night: 6 PM (18:00) to 6 AM, Day: 6 AM (06:00) to 6 PM (18:00)
    return hour >= 6 && hour < 18;
  }
  
  // Set initial mode based on time
  function setInitialMode() {
    isNightMode = !checkTimeBasedMode();
    updateDayNightUI();
  }
  
  // Update UI based on current mode
  function updateDayNightUI() {
    if (isNightMode) {
      document.body.classList.remove('day-mode');
      document.body.classList.add('night-mode');
      dayNightToggle.querySelector('.icon').textContent = '🌙';
    } else {
      document.body.classList.remove('night-mode');
      document.body.classList.add('day-mode');
      dayNightToggle.querySelector('.icon').textContent = '☀️';
    }
  }
  
  // Toggle day/night mode
  function toggleDayNight() {
    isNightMode = !isNightMode;
    updateDayNightUI();
  }
  
  if (dayNightToggle) {
    dayNightToggle.addEventListener('click', toggleDayNight);
    // Set initial mode
    setInitialMode();
  }
};

import { useEffect, useState } from 'react';

const DEFAULT_NAMES = [
  'Aditi',
  'Rohan',
  'Simran',
  'Kabir',
  'Neha',
  'Arjun'
];

const PALETTE = [
  '#2563eb',
  '#4f46e5',
  '#60a5fa',
  '#818cf8',
  '#3b82f6',
  '#6366f1',
  '#0ea5e9',
  '#7c3aed'
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function SpinWheel() {
  const [names, setNames] = useState(() =>
    readStorage('ae_wheel_names', DEFAULT_NAMES)
  );

  const [inputNames, setInputNames] = useState(() =>
    readStorage('ae_wheel_names', DEFAULT_NAMES).join('\n')
  );

  const [history, setHistory] = useState(() =>
    readStorage('ae_wheel_history', [])
  );

  const [avoidRepeat, setAvoidRepeat] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [title, setTitle] = useState('Ready to pick?');
  const [status, setStatus] = useState(
    `${names.length} students on the wheel.`
  );

  useEffect(() => {
    localStorage.setItem('ae_wheel_names', JSON.stringify(names));
  }, [names]);

  useEffect(() => {
    localStorage.setItem('ae_wheel_history', JSON.stringify(history));
  }, [history]);

  const updateNames = () => {
    if (spinning) return;

    const updatedNames = [
      ...new Set(
        inputNames
          .split(/\r?\n/)
          .map(name => name.trim())
          .filter(Boolean)
      )
    ];

    if (updatedNames.length < 2 || updatedNames.length > 8) {
      setStatus('Please enter between 2 and 8 different names.');
      return;
    }

    setNames(updatedNames);
    setInputNames(updatedNames.join('\n'));
    setRotation(0);
    setResult('');
    setTitle('Ready to pick?');
    setStatus(`${updatedNames.length} students on the wheel.`);
  };

  const playSound = () => {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      const audio = new AudioContext();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();

      oscillator.frequency.value = 660;
      gain.gain.value = 0.04;

      oscillator.connect(gain);
      gain.connect(audio.destination);

      oscillator.start();
      oscillator.stop(audio.currentTime + 0.09);

      oscillator.onended = () => audio.close();
    } catch (error) {
      console.log('Sound could not be played.');
    }
  };

  const spinWheel = () => {
    if (spinning || names.length < 2) return;

    const previousWinners = history.map(item => item.name);

    const candidates = avoidRepeat
      ? names.filter(name => !previousWinners.includes(name))
      : names;

    if (candidates.length === 0) {
      setResult(
        'Every student has already won. Reset winner history to start a new round.'
      );
      return;
    }

    const random = crypto.getRandomValues(new Uint32Array(1))[0]
      / 4294967296;

    const selectedName =
      candidates[Math.floor(random * candidates.length)];

    const selectedIndex = names.indexOf(selectedName);
    const slice = 360 / names.length;

    const target =
      (Math.floor(rotation / 360) + 5) * 360 -
      selectedIndex * slice;

    setSpinning(true);
    setResult('');
    setTitle('Spinning...');
    setRotation(target);

    setTimeout(() => {
      setTitle('We have a winner!');
      setResult(`🎉 Landed on: ${selectedName}`);

      const newWinner = {
        name: selectedName,
        date: new Date().toLocaleString(),
        ts: Date.now()
      };

      setHistory(previous => [...previous, newWinner]);

      playSound();
      setSpinning(false);
    }, 4100);
  };

  const resetHistory = () => {
    setHistory([]);
    setResult('');
    setTitle('Ready to pick?');
  };

  const slice = 360 / names.length;

  const wheelBackground = `conic-gradient(from ${
    -slice / 2
  }deg, ${names
    .map(
      (_, index) =>
        `${PALETTE[index % PALETTE.length]} ${
          index * slice
        }deg ${(index + 1) * slice}deg`
    )
    .join(', ')})`;

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Classroom Tool</span>

          <h1>
            Spin The <span className="gradient-text">Wheel</span>
          </h1>

          <p>
            A fun, fair way to pick a student for a quiz,
            demonstration, or classroom participation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">

          <div className="wheel-layout">

            <div className="glass wheel-area">

              <span className="pointer">▼</span>

              <div
                className="wheel"
                style={{
                  background: wheelBackground,
                  transform: `rotate(${rotation}deg)`
                }}
              >
                {names.map((name, index) => {
                  const angle = index * slice;
                  const radius =
                    names.length <= 4
                      ? 115
                      : names.length <= 6
                      ? 130
                      : 138;

                  return (
                    <span
                      className="wheel-label"
                      key={name}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `
                          translate(-50%, -50%)
                          rotate(${angle}deg)
                          translateY(-${radius}px)
                          rotate(${-angle}deg)
                        `
                      }}
                    >
                      {name}
                    </span>
                  );
                })}
              </div>

              <h3>{title}</h3>

              <p className={`spin-result ${result ? 'show' : ''}`}>
                {result}
              </p>

              <button
                className="btn btn-primary spin-btn"
                onClick={spinWheel}
                disabled={spinning}
              >
                {spinning ? 'Spinning...' : 'Spin the Wheel'}
              </button>

              <label className="remember">
                <input
                  type="checkbox"
                  checked={avoidRepeat}
                  onChange={e => setAvoidRepeat(e.target.checked)}
                />
                Do not pick previous winners again
              </label>

              <button
                className="btn btn-outline"
                onClick={resetHistory}
              >
                Reset winner history
              </button>

              <h3>Winner history</h3>

              <ol className="winner-history">
                {[...history].reverse().map((winner, index) => (
                  <li key={`${winner.ts}-${index}`}>
                    {winner.name} — {winner.date}
                  </li>
                ))}
              </ol>

              <p className="spin-note">
                Add 2–8 names below, then spin to make a random selection.
              </p>

              <div className="wheel-editor">
                <label htmlFor="wheelNames">
                  Student names (one per line)
                </label>

                <textarea
                  id="wheelNames"
                  className="input"
                  rows="6"
                  spellCheck="false"
                  value={inputNames}
                  onChange={e => setInputNames(e.target.value)}
                />

                <button
                  className="btn btn-outline"
                  onClick={updateNames}
                  disabled={spinning}
                >
                  Update names
                </button>

                <p className="search-message" aria-live="polite">
                  {status}
                </p>
              </div>
            </div>

            <div className="glass side-panel">
              <span className="eyebrow">How It Works</span>

              <ul>
                <li>👉 Add today's present students to the wheel.</li>
                <li>👉 Click Spin the Wheel to animate a spin.</li>
                <li>👉 The pointer marks the selected student.</li>
                <li>👉 Great for quizzes and classroom participation.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default SpinWheel;
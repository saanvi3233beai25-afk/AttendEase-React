import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
    <main>
      <section className="hero">
        <div className="blob blob-a"></div>
        <div className="blob blob-b"></div>

        <div className="container hero-grid">

          <div className="hero-content">
            <span className="eyebrow">
              Online Attendance Management
            </span>

            <h1>
              Smart
              <span className="gradient-text"> Attendance</span>
              Management System
            </h1>

            <p>
              Manage student attendance digitally with secure login,
              real-time records, anti-proxy verification, attendance
              analytics and engaging classroom tools.
            </p>

            <div className="hero-buttons">
              <Link className="btn btn-primary" to="/signup">
                Get Started →
              </Link>

              <Link className="btn btn-outline" to="/about">
                Explore System
              </Link>
            </div>

            <div className="hero-trust">
              <div>
                <strong>5,000+</strong>
                <span>Students</span>
              </div>

              <div>
                <strong>200+</strong>
                <span>Teachers</span>
              </div>

              <div>
                <strong>98%</strong>
                <span>Accuracy</span>
              </div>
            </div>
          </div>

          <div className="dashboard-wrap">

            <div className="float-card top-float">
              📊
              <div>
                <b>96.4%</b>
                <small>Attendance Rate</small>
              </div>
            </div>

            <div className="dashboard glass">
              <div className="dash-head">
                <h3>Class Overview</h3>
                <span className="live-dot">● Live</span>
              </div>

              <div className="student-row">
                <span>👩🏻 Aditi Sharma</span>
                <b className="present">Present</b>
              </div>

              <div className="student-row">
                <span>👨🏻 Rohan Mehta</span>
                <b className="present">Present</b>
              </div>

              <div className="student-row">
                <span>👨🏻 Kabir Anand</span>
                <b className="absent">Absent</b>
              </div>

              <div className="mini-chart">
                {[45, 65, 52, 82, 70, 95, 76].map((height, index) => (
                  <i key={index} style={{ height: `${height}%` }}></i>
                ))}
              </div>
            </div>

            <div className="float-card bottom-float">
              🛡️
              <div>
                <b>Proxy Check</b>
                <small>Protected</small>
              </div>
            </div>

          </div>
        </div>
      </section>
      <section className="section">
  <div className="container">

    <div className="section-head">
      <span className="eyebrow">Everything in one place</span>
      <h2>Built for modern classrooms</h2>
      <p>
        Turn attendance into a fast, secure and useful digital workflow.
      </p>
    </div>

    <div className="feature-grid">

      <Link className="feature-card glass" to="/attendance">
        <div className="icon">✅</div>
        <h3>Digital Attendance</h3>
        <p>Mark and review attendance quickly without paper registers.</p>
      </Link>

      <Link className="feature-card glass" to="/anti-proxy">
        <div className="icon">🛡️</div>
        <h3>Anti-Proxy System</h3>
        <p>Use student verification before accepting an attendance mark.</p>
      </Link>

      <Link className="feature-card glass" to="/wheel">
        <div className="icon">🎡</div>
        <h3>Spin the Wheel</h3>
        <p>Randomly select students for classroom activities or checks.</p>
      </Link>

      <Link className="feature-card glass" to="/analytics">
        <div className="icon">📈</div>
        <h3>Analytics</h3>
        <p>View attendance percentages and identify low-attendance patterns.</p>
      </Link>

      <Link className="feature-card glass" to="/login">
        <div className="icon">🔐</div>
        <h3>Secure Login</h3>
        <p>Separate entry point for students, teachers and administrators.</p>
      </Link>

      <Link className="feature-card glass" to="/contact">
        <div className="icon">💬</div>
        <h3>Contact Us</h3>
        <p>Send questions, suggestions or requests through the contact form.</p>
      </Link>

    </div>
  </div>
</section>
<section className="stats-section">
  <div className="container stats-grid">

    <div>
      <strong>5000+</strong>
      <span>Students</span>
    </div>

    <div>
      <strong>200+</strong>
      <span>Teachers</span>
    </div>

    <div>
      <strong>98%</strong>
      <span>Accuracy</span>
    </div>

    <div>
      <strong>100+</strong>
      <span>Classes</span>
    </div>

  </div>
</section>
<section className="section">
  <div className="container split">

    <div>
      <span className="eyebrow">How it works</span>

      <h2>From login to report in four steps</h2>

      <div className="steps">

        <div>
          <b>01</b>
          <span>
            <strong>Register</strong>
            Add student or teacher details.
          </span>
        </div>

        <div>
          <b>02</b>
          <span>
            <strong>Login</strong>
            Enter the appropriate dashboard.
          </span>
        </div>

        <div>
          <b>03</b>
          <span>
            <strong>Verify & Mark</strong>
            Use anti-proxy verification before marking.
          </span>
        </div>

        <div>
          <b>04</b>
          <span>
            <strong>Analyze</strong>
            Review attendance and reports.
          </span>
        </div>

      </div>
    </div>

    <div className="callout glass">
      <div className="icon">🎯</div>

      <h3>Make attendance more engaging</h3>

      <p>
        Use the Spin Wheel page to randomly choose students
        for questions, activities, presentations or attendance verification.
      </p>

      <Link className="btn btn-primary" to="/wheel">
        Try Spin Wheel
      </Link>
    </div>

  </div>
</section>
    </main>
    <footer>
  <div className="container footer-inner">

    <div>
      <Link className="logo footer-logo" to="/">
        📘 <span>AttendEase</span>
      </Link>

      <p>
        Smart, secure and modern online attendance management.
      </p>
    </div>

    <div>
      <h4>Pages</h4>
      <Link to="/about">About</Link>
      <Link to="/attendance">Attendance</Link>
      <Link to="/analytics">Analytics</Link>
    </div>

    <div>
      <h4>Tools</h4>
      <Link to="/wheel">Spin Wheel</Link>
      <Link to="/anti-proxy">Anti-Proxy</Link>
      <Link to="/contact">Contact</Link>

      <div className="social-links">
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a>
        <a href="https://twitter.com/" target="_blank" rel="noreferrer">Twitter ↗</a>
        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook ↗</a>
      </div>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 AttendEase · All rights reserved.
  </div>
</footer>
</>
  );
}

export default Home;
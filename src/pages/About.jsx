function About() {
  return (
    <main>

      {/* About Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About the System</span>

          <h1>
            Attendance management,
            <span className="gradient-text"> reimagined.</span>
          </h1>

          <p>
            AttendEase turns a manual attendance process into a clean digital workflow
            with verification, analytics and classroom engagement tools.
          </p>
        </div>
      </section>

      {/* Why AttendEase */}
      <section className="section">
        <div className="container split">

          <div>
            <span className="eyebrow">Why AttendEase?</span>

            <h2>A platform built for students and teachers</h2>

            <p>
              Our concept combines the core attendance features from the original
              landing-page brief with separate pages for the major tasks. Students can
              view attendance, teachers can mark it, and administrators can review patterns.
            </p>

            <div className="check-list">
              <p>✓ Digital attendance tracking</p>
              <p>✓ Secure registration and login</p>
              <p>✓ Anti-proxy verification concept</p>
              <p>✓ Attendance analytics</p>
              <p>✓ Random student selection wheel</p>
              <p>✓ Responsive interface on mobile, tablet and desktop</p>
            </div>
          </div>

          <div className="glass info-card">
            <div className="big-icon">📘</div>

            <h3>Simple. Secure. Smart.</h3>

            <p>
              Every page uses the same Poppins typography, blue-indigo visual language,
              cards, buttons and spacing so the whole project feels like one system.
            </p>

            <a className="btn btn-primary" href="/attendance">
              View Attendance
            </a>
          </div>

        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <div className="container stats-grid">

          <div>
            <strong>01</strong>
            <span>Unified Theme</span>
          </div>

          <div>
            <strong>06+</strong>
            <span>Core Modules</span>
          </div>

          <div>
            <strong>100%</strong>
            <span>Responsive Layout</span>
          </div>

          <div>
            <strong>2s</strong>
            <span>Intro Loader</span>
          </div>

        </div>
      </section>

    </main>
  );
}

export default About;
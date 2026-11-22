import { useState } from 'react';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(previous => ({
      ...previous,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (form.name.trim().length < 2) {
      newErrors.name = 'Enter your name.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!form.subject.trim()) {
      newErrors.subject = 'Enter a subject.';
    }

    if (form.message.trim().length < 10) {
      newErrors.message = 'Write at least 10 characters.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setStatus('');

    if (!validateForm()) {
      return;
    }

    const messages = JSON.parse(
      localStorage.getItem('ae_contact_messages') || '[]'
    );

    messages.push({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      createdAt: new Date().toISOString()
    });

    localStorage.setItem(
      'ae_contact_messages',
      JSON.stringify(messages)
    );

    setForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    setErrors({});

    setStatus(
      'Message received in this browser demo. No email was sent because a backend is not connected.'
    );
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Contact Us</span>

          <h1>
            Let's talk
            <span className="gradient-text"> attendance.</span>
          </h1>

          <p>
            Have a question, suggestion or demo request?
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">

          <form
            className="glass contact-form"
            onSubmit={handleSubmit}
            noValidate
          >

            <div className="form-row">

              <div>
                <label htmlFor="contact-name">Name</label>

                <input
                  id="contact-name"
                  className="input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Your name"
                />

                {errors.name && (
                  <small className="field-error">
                    {errors.name}
                  </small>
                )}
              </div>

              <div>
                <label htmlFor="contact-email">Email</label>

                <input
                  id="contact-email"
                  className="input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                />

                {errors.email && (
                  <small className="field-error">
                    {errors.email}
                  </small>
                )}
              </div>

            </div>

            <label htmlFor="contact-subject">Subject</label>

            <input
              id="contact-subject"
              className="input"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="How can we help?"
            />

            {errors.subject && (
              <small className="field-error">
                {errors.subject}
              </small>
            )}

            <label htmlFor="contact-message">Message</label>

            <textarea
              id="contact-message"
              className="input"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
            />

            {errors.message && (
              <small className="field-error">
                {errors.message}
              </small>
            )}

            <button className="btn btn-primary" type="submit">
              Send Message
            </button>

            {status && (
              <p className="form-status ok" role="status">
                {status}
              </p>
            )}

          </form>

          <div className="contact-info">

            <div className="glass contact-card">
              <div className="icon">✉️</div>

              <div>
                <h3>Email</h3>
                <p>hello@attendease.app</p>
              </div>
            </div>

            <div className="glass contact-card">
              <div className="icon">📞</div>

              <div>
                <h3>Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="glass contact-card">
              <div className="icon">📍</div>

              <div>
                <h3>Location</h3>
                <p>India</p>
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}

export default Contact;
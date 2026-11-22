import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';

import { setAttendance } from '../features/attendance/attendanceSlice';

function AntiProxy() {
  const dispatch = useDispatch();

  const students = useSelector(
    state => state.attendance.students
  );

  const selectedDate = useSelector(
    state => state.attendance.selectedDate
  );

  const recordsByDate = useSelector(
    state => state.attendance.recordsByDate
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  const [verifiedStudents, setVerifiedStudents] = useState([]);
  const [message, setMessage] = useState('');

  const scannedRollNumbers = useRef(new Set());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check whether attendance window is open
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  const isTimeAllowed =
    (hours === 9 && minutes >= 0 && minutes < 15);

  // Start QR scanner
  useEffect(() => {
    if (!isTimeAllowed) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      false
    );

    scanner.render(
      (decodedText) => {
        const rollNo = decodedText.trim();

        const student = students.find(
          item => item.rollNo.toLowerCase() === rollNo.toLowerCase()
        );

        if (!student) {
          setMessage('❌ Student not found!');
          return;
        }

        if (scannedRollNumbers.current.has(student.rollNo)) {
          setMessage('⚠️ This student has already been scanned.');
          return;
        }

        if (recordsByDate[selectedDate]?.[student.rollNo] === true) {
          scannedRollNumbers.current.add(student.rollNo);
          setMessage('⚠️ Attendance is already marked for this student.');
          return;
        }

        scannedRollNumbers.current.add(student.rollNo);

        dispatch(setAttendance({
          date: selectedDate,
          rollNo: student.rollNo,
          present: true
        }));

        setVerifiedStudents(previous => [
          ...previous,
          student
        ]);

        setMessage(`✅ ${student.name} verified successfully!`);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isTimeAllowed, students, selectedDate, recordsByDate, dispatch]);

  const alreadyMarked = recordsByDate[selectedDate] || {};

  return (
    <main className="container section">

      <h1>Anti-Proxy Attendance</h1>

      <p>Verify student identity through QR code scanning.</p>

      {/* Time Status */}
      <section className="analytics-panel">
        <h2>Attendance Window</h2>

        <h3>
          Current Time: {currentTime.toLocaleTimeString()}
        </h3>

        <p>Allowed Time: 9:00 AM – 9:15 AM</p>

        <h3 style={{
          color: isTimeAllowed ? 'green' : 'red'
        }}>
          {isTimeAllowed
            ? '🟢 Attendance Window Open'
            : '🔴 Attendance Window Closed'}
        </h3>

      </section>

      {/* QR Scanner */}
      <section className="analytics-panel">

        <h2>Scan Student QR Code</h2>

        {isTimeAllowed ? (
          <div id="qr-reader" style={{ maxWidth: '500px' }} />
        ) : (
          <p>
            QR scanning is available only between 9:00 AM and 9:15 AM.
          </p>
        )}

        {message && <h3>{message}</h3>}

      </section>

      {/* Verified Students */}
      <section className="analytics-panel">

        <h2>Verified Students</h2>

        <h3>
          Total Verified: {verifiedStudents.length}
        </h3>

        {verifiedStudents.length === 0 ? (
          <p>No students verified yet.</p>
        ) : (
          verifiedStudents.map(student => (
            <div
              key={student.rollNo}
              className="low-attendance-item"
            >
              <span>
                ✅ {student.name} — {student.rollNo}
              </span>
              <strong>Verified</strong>
            </div>
          ))
        )}

      </section>

      {/* Student QR Codes */}
      <section className="analytics-panel">

        <h2>Student QR Codes</h2>

        <p>Each student has a unique QR code containing their roll number.</p>

        <div className="qr-student-grid">

          {students.map(student => (
            <div
              key={student.id}
              className="qr-student-card"
            >

              <QRCodeSVG
                value={student.rollNo}
                size={130}
              />

              <h4>{student.name}</h4>

              <p>{student.rollNo}</p>

              <small>
                {alreadyMarked[student.rollNo] === true
                  ? 'Attendance Marked'
                  : 'Not Marked'}
              </small>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}

export default AntiProxy;
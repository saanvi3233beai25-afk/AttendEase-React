import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addStudent,
  deleteStudent,
  setAttendance,
  markAllAttendance,
  undoAttendance,
  setSelectedDate
} from '../features/attendance/attendanceSlice';

function Attendance() {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const historyLength = useSelector(
    state => state.attendance.history.length
  );

  const attendanceRecords = recordsByDate[selectedDate] || {};

  // Add student
  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!name.trim() || !rollNo.trim()) {
      alert('Please enter both name and roll number.');
      return;
    }

    const exists = students.some(
      student =>
        student.rollNo.toLowerCase() === rollNo.trim().toLowerCase()
    );

    if (exists) {
      alert('This roll number already exists!');
      return;
    }

    dispatch(addStudent({
      id: Date.now(),
      name: name.trim(),
      rollNo: rollNo.trim()
    }));

    setName('');
    setRollNo('');
  };

  // Individual attendance
  const handleAttendanceChange = (rollNo, present) => {
    dispatch(setAttendance({
      date: selectedDate,
      rollNo,
      present
    }));
  };

  // Bulk attendance
  const handleMarkAll = (present) => {
    dispatch(markAllAttendance({
      date: selectedDate,
      present
    }));
  };

  // Undo
  const handleUndo = () => {
    dispatch(undoAttendance());
  };

  // Date selection
  const handleDateChange = (e) => {
    dispatch(setSelectedDate(e.target.value));
  };

  // Search
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Summary
  const presentCount = students.filter(
    student => attendanceRecords[student.rollNo] === true
  ).length;

  const absentCount = students.filter(
    student => attendanceRecords[student.rollNo] === false
  ).length;

  const totalStudents = students.length;

  const notMarkedCount = totalStudents - presentCount - absentCount;

  const attendancePercentage = totalStudents
    ? ((presentCount / totalStudents) * 100).toFixed(1)
    : 0;

  // CSV export
  const handleExportCSV = () => {
    const headers = [
      'Name',
      'Roll Number',
      'Date',
      'Attendance'
    ];

    const rows = students.map(student => [
      student.name,
      student.rollNo,
      selectedDate,
      attendanceRecords[student.rollNo] === true
        ? 'Present'
        : attendanceRecords[student.rollNo] === false
        ? 'Absent'
        : 'Not Marked'
    ]);

    const csvContent = [headers, ...rows]
      .map(row =>
        row.map(value =>
          `"${String(value ?? '').replace(/"/g, '""')}"`
        ).join(',')
      )
      .join('\n');

    const blob = new Blob(
      ['\uFEFF' + csvContent],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `AttendEase_${selectedDate}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <main className="container section attendance-page">

      {/* Page Header */}
      <div className="attendance-header">

        <div>
          <span className="eyebrow">ATTENDANCE MANAGEMENT</span>

          <h1>Attendance Overview</h1>

          <p>
            Manage students, track attendance and monitor classroom activity.
          </p>
        </div>

        <div className="attendance-date">
          <label htmlFor="attendance-date">Select Date</label>

          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

      </div>

      {/* Summary Cards */}
      <div className="attendance-summary">

        <div className="attendance-stat stat-blue">
          <div className="stat-icon">👥</div>
          <span>Total Students</span>
          <h2>{totalStudents}</h2>
          <small>Registered students</small>
        </div>

        <div className="attendance-stat stat-green">
          <div className="stat-icon">✓</div>
          <span>Present</span>
          <h2>{presentCount}</h2>
          <small>Students present</small>
        </div>

        <div className="attendance-stat stat-red">
          <div className="stat-icon">✕</div>
          <span>Absent</span>
          <h2>{absentCount}</h2>
          <small>Students absent</small>
        </div>

        <div className="attendance-stat stat-purple">
          <div className="stat-icon">📊</div>
          <span>Attendance Rate</span>
          <h2>{attendancePercentage}%</h2>
          <small>{notMarkedCount} not marked</small>
        </div>

      </div>

      {/* Add Student */}
      <section className="attendance-panel">

        <div className="attendance-panel-heading">
          <div>
            <h2>Add New Student</h2>
            <p>Register a student in your classroom.</p>
          </div>

          <span className="panel-icon">＋</span>
        </div>

        <form
          className="add-student-form"
          onSubmit={handleAddStudent}
        >

          <div className="attendance-field">
            <label htmlFor="student-name">Student Name</label>

            <input
              id="student-name"
              type="text"
              placeholder="Enter student name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="attendance-field">
            <label htmlFor="student-roll">Roll Number</label>

            <input
              id="student-roll"
              type="text"
              placeholder="Enter roll number"
              value={rollNo}
              onChange={e => setRollNo(e.target.value)}
            />
          </div>

          <button className="attendance-add-btn" type="submit">
            + Add Student
          </button>

        </form>

      </section>

      {/* Student Records */}
      <section className="attendance-panel records-panel">

        <div className="records-heading">

          <div>
            <h2>Student Records</h2>
            <p>Manage and update daily attendance.</p>
          </div>

          <button
            className="attendance-export-btn"
            onClick={handleExportCSV}
            type="button"
          >
            ↓ Export CSV
          </button>

        </div>

        {/* Attendance Actions */}
        <div className="attendance-toolbar">

          <div className="attendance-bulk-actions">

            <button
              className="bulk-present"
              onClick={() => handleMarkAll(true)}
              type="button"
            >
              ✓ Mark All Present
            </button>

            <button
              className="bulk-absent"
              onClick={() => handleMarkAll(false)}
              type="button"
            >
              ✕ Mark All Absent
            </button>

            <button
              className="bulk-undo"
              onClick={handleUndo}
              disabled={historyLength === 0}
              type="button"
            >
              ↶ Undo
            </button>

          </div>

          <input
            className="attendance-search"
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

        </div>

        {/* Student Table */}
        <div className="attendance-table-wrapper">

          <table className="attendance-table">

            <thead>
              <tr>
                <th>Student</th>
                <th>Roll Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.map(student => {

                const isPresent = attendanceRecords[student.rollNo];

                const status =
                  isPresent === true
                    ? 'Present'
                    : isPresent === false
                    ? 'Absent'
                    : 'Not Marked';

                return (
                  <tr key={student.id}>

                    <td>
                      <div className="attendance-student-name">
                        <span className="student-avatar">
                          {student.emoji || '👤'}
                        </span>

                        <strong>{student.name}</strong>
                      </div>
                    </td>

                    <td>{student.rollNo}</td>

                    <td>
                      <span
                        className={`attendance-badge ${
                          isPresent === true
                            ? 'badge-present'
                            : isPresent === false
                            ? 'badge-absent'
                            : 'badge-pending'
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      <div className="student-actions">

                        <button
                          className="action-present"
                          onClick={() =>
                            handleAttendanceChange(student.rollNo, true)
                          }
                          type="button"
                        >
                          Present
                        </button>

                        <button
                          className="action-absent"
                          onClick={() =>
                            handleAttendanceChange(student.rollNo, false)
                          }
                          type="button"
                        >
                          Absent
                        </button>

                        <button
                          className="action-delete"
                          onClick={() =>
                            dispatch(deleteStudent(student.id))
                          }
                          type="button"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

          {filteredStudents.length === 0 && (
            <div className="attendance-empty">
              <span>🔍</span>
              <h3>No students found</h3>
              <p>Try another search or add a new student.</p>
            </div>
          )}

        </div>

        <div className="attendance-records-footer">
          Showing {filteredStudents.length} of {totalStudents} students
        </div>

      </section>

    </main>
  );
}

export default Attendance;
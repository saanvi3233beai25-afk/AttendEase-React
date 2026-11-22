import { useSelector } from 'react-redux';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

function Analytics() {
  const students = useSelector(
    state => state.attendance.students
  );

  const recordsByDate = useSelector(
    state => state.attendance.recordsByDate
  );

  const dates = Object.keys(recordsByDate).sort();

  // Overall attendance calculations
  let totalPresent = 0;
  let totalAbsent = 0;

  students.forEach(student => {
    dates.forEach(date => {
      const status = recordsByDate[date]?.[student.rollNo];

      if (status === true) totalPresent++;
      if (status === false) totalAbsent++;
    });
  });

  const totalMarked = totalPresent + totalAbsent;

  const overallPercentage = totalMarked
    ? ((totalPresent / totalMarked) * 100).toFixed(1)
    : 0;

  // Student-wise attendance
  const studentAnalytics = students.map(student => {
    let present = 0;
    let absent = 0;

    dates.forEach(date => {
      const status = recordsByDate[date]?.[student.rollNo];

      if (status === true) present++;
      if (status === false) absent++;
    });

    const marked = present + absent;

    const percentage = marked
      ? (present / marked) * 100
      : 0;

    return {
      ...student,
      present,
      absent,
      marked,
      percentage: Number(percentage.toFixed(1))
    };
  });

  // Students below 75%
  const lowAttendance = studentAnalytics.filter(
    student => student.marked > 0 && student.percentage < 75
  );

  // Pie chart data
  const pieData = [
    { name: 'Present', value: totalPresent },
    { name: 'Absent', value: totalAbsent }
  ];

  // Date-wise attendance
  const dateData = dates.map(date => {
    let present = 0;
    let absent = 0;

    students.forEach(student => {
      const status = recordsByDate[date]?.[student.rollNo];

      if (status === true) present++;
      if (status === false) absent++;
    });

    return {
      date,
      present,
      absent
    };
  });

  return (
    <main className="container section analytics-page">

      <h1>Attendance Analytics</h1>

      <p>Monitor attendance performance and student participation.</p>

      {/* Summary Cards */}
      <div className="analytics-cards">

        <div className="analytics-card">
          <span>👥</span>
          <h3>Total Students</h3>
          <h2>{students.length}</h2>
        </div>

        <div className="analytics-card">
          <span>✅</span>
          <h3>Present Records</h3>
          <h2>{totalPresent}</h2>
        </div>

        <div className="analytics-card">
          <span>❌</span>
          <h3>Absent Records</h3>
          <h2>{totalAbsent}</h2>
        </div>

        <div className="analytics-card">
          <span>📊</span>
          <h3>Overall Attendance</h3>
          <h2>{overallPercentage}%</h2>
        </div>

      </div>

      {/* Charts */}
      <div className="analytics-charts">

        <section className="analytics-panel">
          <h2>Attendance Distribution</h2>

          {totalMarked === 0 ? (
            <p>No attendance data available yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#16a34a" />
                  <Cell fill="#dc2626" />
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="analytics-panel">
          <h2>Date-wise Attendance</h2>

          {dateData.length === 0 ? (
            <p>No attendance data available yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />

                <Bar
                  dataKey="present"
                  fill="#16a34a"
                  name="Present"
                />

                <Bar
                  dataKey="absent"
                  fill="#dc2626"
                  name="Absent"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

      </div>

      {/* Student Performance */}
      <section className="analytics-panel">
        <h2>Student-wise Attendance</h2>

        {studentAnalytics.length === 0 ? (
          <p>No students available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={studentAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rollNo" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="percentage"
                fill="#6366f1"
                name="Attendance %"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* Student Table */}
      <section className="analytics-panel">
        <h2>Student Performance Details</h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {studentAnalytics.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.present}</td>
                  <td>{student.absent}</td>
                  <td>{student.percentage}%</td>
                  <td>
                    {student.marked === 0
                      ? 'Not Marked'
                      : student.percentage < 75
                      ? '⚠️ Low'
                      : '✅ Good'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Low Attendance Alerts */}
      <section className="analytics-panel low-attendance">
        <h2>⚠️ Students Below 75% Attendance</h2>

        {lowAttendance.length === 0 ? (
          <p>All students with marked attendance have at least 75% attendance!</p>
        ) : (
          lowAttendance.map(student => (
            <div key={student.id} className="low-attendance-item">
              <span>
                {student.name} ({student.rollNo})
              </span>

              <strong>{student.percentage}%</strong>
            </div>
          ))
        )}
      </section>

    </main>
  );
}

export default Analytics;
import axios from "axios";
import { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";

const App = () => {
  const [sessions, setSessions] = useState([]);
  const getAttendance = async () => {
    const res = await axios.get(
      `http://localhost:8083/student-api/v1/batch/attendance?batchId=62697e83f443383a16d00c81`,
      {
        headers: {
          auth: "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoicHJpeWFiaWhhbmkxMjNAZ21haWwuY29tIiwidXNlcklkIjoiNjI2OTg5MWI5NDIxZTNmZDI3NDZkMWJiIn0sImlzcyI6InNoYXBlYWkiLCJhdWQiOiJTaGFwZUFJIERhc2hib2FyZHMiLCJyb2xlIjoic3R1ZGVudCIsImp0aSI6IjAydDB1czN6czgiLCJpYXQiOjE2NTE1OTU0NDMsImV4cCI6MTY1MjIwMDI0M30.19fdrlTwIJ7JCBKZmdNEcrwfZE6RXjcFzWU1M_JKcfo",
        },
      }
    );
    const {
      data: { sessions },
    } = res.data;

  const thresholdToAttendance = 600; 

    /*
      Every duration is in seconds
      0 is if the user was absent
      1 is if user was present but didn't cross the threshold
      2 is if user was present and crossed the threshold
    
    */
    setSessions(
      sessions.map((s) => ({
        ...s,
        date: s.date.split("T").shift(),
        count: !s.attendance ? 0 : s.attendance.duration < thresholdToAttendance ? 1 : 2,
      }))
    );
  };

  console.log(sessions)


  useEffect(() => {
    getAttendance();
  }, []);
  return (
    <div>
      <h1>heatmap</h1>
      <CalendarHeatmap
        // Change the limit to display 6 months after batch Start date
        startDate={new Date("2022-02-01")}
        endDate={new Date("2022-05-30")}
        values={sessions}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `color-scale-${value.count}`;
        }}
      />
    </div>
  );
};

export default App;

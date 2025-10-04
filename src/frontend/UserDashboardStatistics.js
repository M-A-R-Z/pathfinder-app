import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import axios from "axios";
import Header from "../components/Header";
import "./css/UserDashboardStatistics.css";

export default function UserResultsDashboard({ assessmentId }) {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [result, setResult] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [pieData, setPieData] = useState([]);

  // fetch results
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/assessments/${assessmentId}/results`)
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => console.error("Error fetching results:", err));
  }, [assessmentId]);

  // fetch neighbors
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/assessments/${assessmentId}/neighbors`)
      .then((res) => {
        setNeighbors(res.data);

        // compute strand distribution for pie chart
        const counts = { STEM: 0, ABM: 0, HUMSS: 0 };
        res.data.forEach((n) => {
          if (n.strand in counts) counts[n.strand]++;
        });
        setPieData([
          { name: "STEM", value: counts.STEM },
          { name: "ABM", value: counts.ABM },
          { name: "HUMSS", value: counts.HUMSS },
        ]);
      })
      .catch((err) => console.error("Error fetching neighbors:", err));
  }, [assessmentId]);

  return (
    <div className="dashboard-container">
      <Header />

      <div className="main-content">
        <div className="top-section">
          {/* Description */}
          <div className="card description">
            <div className="card-header">
              <h2>Assessment Summary</h2>
            </div>
            <div className="card-body">
              {result ? (
                <>
                  <p><strong>Recommended Strand:</strong> {result.recommended_strand}</p>
                  <p><strong>Description:</strong> {result.recommendation_description}</p>
                  <p><strong>Dataset Used:</strong> {result.dataset_name || "N/A"}</p>
                  <p><strong>Date:</strong> {new Date(result.created_at).toLocaleString()}</p>
                </>
              ) : (
                <p>Loading results...</p>
              )}
            </div>
          </div>

          {/* Bar Graph */}
          <div className="card chart">
            <div className="card-header">
              <h2>User Scores Per Strand</h2>
            </div>
            <div className="card-body">
              {result ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={[
                      { strand: "STEM", score: result.stem_score },
                      { strand: "ABM", score: result.abm_score },
                      { strand: "HUMSS", score: result.humss_score },
                    ]}
                  >
                    <XAxis dataKey="strand" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#4cafef" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>No score data available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bottom-section">
          {/* Neighbors Table */}
          <div className="card connected">
            <div className="card-header">
              <h2>Nearest Neighbors</h2>
            </div>
            <div className="card-body">
              {neighbors.length > 0 ? (
                <table className="question-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Strand</th>
                      <th>Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {neighbors.map((n, index) => (
                      <tr key={n.neighbors_id}>
                        <td>{index + 1}</td>
                        <td>{n.strand}</td>
                        <td>{n.distance.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No neighbors found.</p>
              )}
            </div>
          </div>

          {/* Pie Graph */}
          <div className="card chart">
            <div className="card-header">
              <h2>Neighbor Strand Distribution</h2>
            </div>
            <div className="card-body">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#4cafef" />
                      <Cell fill="#ff9800" />
                      <Cell fill="#8bc34a" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p>No distribution available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

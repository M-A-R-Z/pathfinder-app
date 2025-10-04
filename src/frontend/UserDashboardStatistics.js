import React, { useEffect, useState } from "react";
import axios from "axios";
import UserDashboardHeader from "./component/UserDashboardHeader";
import UserDashboardSidebar from "./component/UserDashboardSidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./UserDashboardStatistics.css";

export default function UserResultsDashboard() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [result, setResult] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1️⃣ Get current user
        const meRes = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
        const currentUser = meRes.data;
        setUser(currentUser);

        // 2️⃣ Get the currently active dataset
        const datasetRes = await axios.get(`${API_BASE_URL}/active-dataset`);
        const activeDataset = datasetRes.data;

        // 3️⃣ Get the user's assessment for this dataset
        const assessmentRes = await axios.get(
          `${API_BASE_URL}/progress/${currentUser.user_id}/${activeDataset.data_set_id}`
        );
        const userAssessment = assessmentRes.data;
        if (!userAssessment) throw new Error("No assessment found for this user and dataset");
        setAssessment(userAssessment);

        // 4️⃣ Get the results for that assessment
        const resultsRes = await axios.get(`${API_BASE_URL}/results/${userAssessment.assessment_id}`);
        const resultData = resultsRes.data;
        setResult(resultData);

        // 5️⃣ Extract neighbors and compute pie chart
        if (resultData.neighbors) {
          setNeighbors(resultData.neighbors);
          const counts = { STEM: 0, ABM: 0, HUMSS: 0 };
          resultData.neighbors.forEach(n => {
            if (n.strand in counts) counts[n.strand]++;
          });
          setPieData([
            { name: "STEM", value: counts.STEM },
            { name: "ABM", value: counts.ABM },
            { name: "HUMSS", value: counts.HUMSS },
          ]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [API_BASE_URL]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <UserDashboardHeader />
      <div className="main-content">
        <div className="sidebar">
          <UserDashboardSidebar activeItem="Statistics" />
        </div>
        <div className="content-area">
          {/* Top Section */}
          <div className="top-section">
            {/* Assessment Summary */}
            <div className="card description">
              <div className="card-header"><h2>Assessment Summary</h2></div>
              <div className="card-body">
                {result ? (
                  <>
                    <p><strong>Recommended Strand:</strong> {result.recommended_strand}</p>
                    <p><strong>Description:</strong> {result.recommendation_description}</p>
                    <p><strong>Dataset Used:</strong> {result.dataset_name || "N/A"}</p>
                    <p><strong>Date:</strong> {new Date(result.created_at).toLocaleString()}</p>

                    {result.tie_info && (
                      <div className="tie-table-container" style={{ marginTop: "1rem" }}>
                        <h3>Tie Resolution Weights</h3>
                        <table className="question-table">
                          <thead>
                            <tr><th>Strand</th><th>Weighted Distance</th></tr>
                          </thead>
                          <tbody>
                            {Object.entries(result.tie_info).map(([strand, weight]) => (
                              <tr key={strand}>
                                <td>{strand.replace("_weight","").toUpperCase()}</td>
                                <td>{Number(weight).toFixed(3)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                ) : <p>No results found.</p>}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="card chart">
              <div className="card-header"><h2>User Scores Per Strand</h2></div>
              <div className="card-body">
                {result ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { strand: "STEM", score: assessment.stem_total },
                      { strand: "ABM", score: assessment.abm_total },
                      { strand: "HUMSS", score: assessment.humss_total },
                    ]}>
                      <XAxis dataKey="strand" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#4cafef" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p>No score data available.</p>}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bottom-section">
            {/* Neighbors Table */}
            <div className="card">
              <div className="card-header"><h2>Nearest Neighbors</h2></div>
              <div className="card-body">
                {neighbors.length > 0 ? (
                  <table className="question-table">
                    <thead>
                      <tr><th>#</th><th>Strand</th><th>Distance</th></tr>
                    </thead>
                    <tbody>
                      {neighbors
                        .slice() // copy so we don’t mutate state
                        .sort((a, b) => a.distance - b.distance) // ✅ ascending
                        .map((n, index) => (
                          <tr key={`${n.neighbors_id || index}-${n.strand}`}>
                            <td>{index + 1}</td>
                            <td>{n.strand}</td>
                            <td>{n.distance.toFixed(3)}</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No neighbors found.</p>}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="card chart">
              <div className="card-header"><h2>Neighbor Strand Distribution</h2></div>
              <div className="card-body">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                      >
                        <Cell fill="#4cafef" />
                        <Cell fill="#ff9800" />
                        <Cell fill="#8bc34a" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p>No distribution available.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

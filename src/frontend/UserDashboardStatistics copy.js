import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function UserResultsDashboardCopy() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const COLORS = ["#4cafef", "#ff9800", "#8bc34a"];
  const [assessment, setAssessment] = useState(null);
  const [result, setResult] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/userlogincopy");
        return;
      }

      try {
        // 1️⃣ Fetch user info
        const userRes = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const meRes = userRes.data;

        // 2️⃣ Fetch active dataset
        const  res = await axios.get(`${API_BASE_URL}/active-dataset`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const datasetRes = res.data;

        if (!datasetRes.data_set_id) { 
          console.error("No active dataset found");
          setLoading(false);
          return;
        }

        const assessmentRes = await axios.get(
          `${API_BASE_URL}/progress/${meRes.user_id}/${datasetRes.data_set_id}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userAssessment = assessmentRes.data;
        
        // Check if assessment is completed
        if (!userAssessment || !userAssessment.completed) {
          setCompleted(false);
          setLoading(false);
          return;
        }

        setCompleted(true);
        setAssessment(userAssessment);

        // 4️⃣ Get the results for that assessment
        const resultsRes = await axios.get(`${API_BASE_URL}/results/${userAssessment.assessment_id}`, { 
          headers: { Authorization: `Bearer ${token}` } });
        const resultData = resultsRes.data;
        setResult(resultData);

        // ✅ Use backend-provided neighbor vote counts for pie chart
        setPieData([
          { name: "STEM", value: resultData.stem_score || 0 },
          { name: "ABM", value: resultData.abm_score || 0 },
          { name: "HUMSS", value: resultData.humss_score || 0 },
        ]);

        // Keep neighbors for table display
        if (resultData.neighbors) {
          setNeighbors(resultData.neighbors);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching initial data:", err);
  

      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token, navigate, API_BASE_URL]);


  if (loading) {
    return (
      <div className="statistics-container">
        <UserDashboardHeader />
        <div className="statistics-main-layout">
          <UserDashboardSidebar activeItem="Statistics" />
          <div className="statistics-main-content">
            <div className="statistics-loading">
              <div className="loading-spinner"></div>
              <p>Loading statistics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!completed) {
    return (
      <div className="statistics-container">
        <UserDashboardHeader />
        <div className="statistics-main-layout">
          <UserDashboardSidebar activeItem="Statistics" />
          <div className="statistics-main-content">
            <div className="statistics-locked">
              <div className="statistics-locked-icon">🔒</div>
              <h2 className="statistics-locked-title">Assessment Required</h2>
              <p className="statistics-locked-text">
                You need to complete the Strandify Assessment first to view your personalized statistics and results.
              </p>
              <button
                className="statistics-locked-btn"
                onClick={() => navigate('/userdashboardassessmentcopy')}
              >
                Take the Assessment
              </button>
            </div>
            <div className="statistics-footer">
              <p className="statistics-copyright">© 2025 PathFinder. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <UserDashboardHeader />
      <div className="statistics-main-layout">
        <UserDashboardSidebar activeItem="Statistics" />
        <div className="statistics-content-area">
          {/* Top Section */}
          <div className="statistics-top-section">
            {/* Assessment Summary */}
            <div className="statistics-card statistics-description">
              <div className="statistics-card-header"><h2>Assessment Summary</h2></div>
              <div className="statistics-card-body">
                {result ? (
                  <>
                    <p><strong>Recommended Strand:</strong> {result.recommended_strand}</p>
                    <p><strong>Description:</strong> {result.recommendation_description}</p>
                    <p><strong>Dataset Used:</strong> {result.dataset_name || "N/A"}</p>
                    <p><strong>Date:</strong> {new Date(result.created_at).toLocaleString()}</p>

                    {result.tie_info && (
                      <div className="statistics-tie-table-container">
                        <h3>Tie Resolution Weights</h3>
                        <table className="statistics-question-table">
                          <thead>
                            <tr><th>Strand</th><th>Weighted Distance</th></tr>
                          </thead>
                          <tbody>
                            {Object.entries(result.tie_info).map(([strand, weight]) => (
                              <tr key={strand}>
                                <td>{strand.replace("_weight","").toUpperCase()}</td>
                                <td>{weight != null ? Number(weight).toFixed(3) : "N/A"}</td>
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
            <div className="statistics-card statistics-chart">
              <div className="statistics-card-header"><h2>User Scores Per Strand</h2></div>
              <div className="statistics-card-body">
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
          <div className="statistics-bottom-section">
            {/* Neighbors Table */}
            <div className="statistics-card">
              <div className="statistics-card-header"><h2>Closest Matches</h2></div>
              <div className="statistics-card-body">
                {neighbors.length > 0 ? (
                  <table className="statistics-question-table">
                    <thead>
                      <tr><th>#</th><th>Strand</th><th>Distance</th></tr>
                    </thead>
                    <tbody>
                      {neighbors
                        .slice()
                        .sort((a, b) => a.distance - b.distance)
                        .map((n, index) => (
                          <tr key={`${n.neighbors_id || index}-${n.strand}`}>
                            <td>{index + 1}</td>
                            <td>{n.strand}</td>
                            <td>{n.distance != null ? n.distance.toFixed(3) : "0.000"}</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No neighbors found.</p>}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="statistics-card statistics-chart">
              <div className="statistics-card-header"><h2>Closest Matches Distribution</h2></div>
              <div className="statistics-card-body">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p>No distribution available.</p>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="statistics-footer">
            <p className="statistics-copyright">© 2025 PathFinder. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
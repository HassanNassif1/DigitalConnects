import React, { useEffect, useState, useRef } from "react";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-50m.json";
import * as d3 from "d3";

export default function WorldMap() {
  const [users, setUsers] = useState([]);
  const [usersByNationality, setUsersByNationality] = useState([]);
  const [countryData, setCountryData] = useState([]);

  const svgRef = useRef();
  const gRef = useRef();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUsersByNationality = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users-by-nationality");
        const data = await res.json();
        setUsersByNationality(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    fetchUsersByNationality();
  }, []);

  useEffect(() => {
    if (users.length && usersByNationality.length) {
      const data = usersByNationality.map((item) => {
        const usernames = users
          .filter((u) => u.nationality === item.nationality)
          .map((u) => u.username);
        return { ...item, usernames };
      });
      setCountryData(data);
    }
  }, [users, usersByNationality]);

  const countriesGeo = feature(worldData, worldData.objects.countries).features;

  const width = 1200;
  const height = 600;

  const projection = d3.geoMercator().scale(180).translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);

  /** ZOOM + PAN Setup **/
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const zoom = d3.zoom()
      .scaleExtent([1, 8]) // zoom limits
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Reset zoom on double-click
    svg.on("dblclick", (event) => {
      event.preventDefault();
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
    });
  }, []);

  /** Helper to zoom to a specific country on click **/
  const handleCountryClick = (event, country) => {
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const [[x0, y0], [x1, y1]] = path.bounds(country);
    const dx = x1 - x0;
    const dy = y1 - y0;
    const x = (x0 + x1) / 2;
    const y = (y0 + y1) / 2;
    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    svg.transition()
      .duration(1000)
      .call(
        d3.zoom().transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={() => {
          const svg = d3.select(svgRef.current);
          svg.transition()
            .duration(750)
            .call(d3.zoom().transform, d3.zoomIdentity);
        }}
        style={{
          background: "#00b4ff",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Reset Zoom
      </button>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="70vw"
        height="auto"
        style={{
          display: "block",
          background: "linear-gradient(180deg, #030316 0%, #071028 40%, #0b0e1a 100%)",
          cursor: "grab",
        }}
      >
        <g ref={gRef}>
          {/* Draw countries */}
          {countriesGeo.map((country) => {
            const userInfo = countryData.find(
              (c) => c.nationality === country.properties.name
            );
            return (
              <path
                key={country.id}
                d={path(country)}
                fill={userInfo ? "#ffcc00" : "rgba(60, 63, 177, 0.9)"}
                stroke="#555"
                strokeWidth={0.4}
                onClick={(e) => handleCountryClick(e, country)}
                style={{ cursor: "pointer", transition: "fill 0.3s" }}
              />
            );
          })}

          {/* Draw user info boxes + arrows */}
          {countriesGeo.map((country, i) => {
            const userInfo = countryData.find(
              (c) => c.nationality === country.properties.name
            );
            if (!userInfo) return null;
            const [x, y] = path.centroid(country);
            const offsetX = (i % 2 === 0 ? 1 : -1) * (100 + i * 2);
            const offsetY = (i % 3 === 0 ? -1 : 1) * (50 + (i % 5) * 5);
            return (
              <g key={country.properties.name}>
                <line
                  x1={x}
                  y1={y}
                  x2={x + offsetX}
                  y2={y + offsetY}
                  stroke="#fff"
                  strokeWidth="1.5"
                  markerEnd="url(#arrowhead)"
                />
                <foreignObject
                  x={x + offsetX - 70}
                  y={y + offsetY - 25}
                  width={150}
                  height={110}
                >
                  <div
                    style={{
                      background: "white",
                      borderRadius: "10px",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
                      padding: "8px",
                      fontSize: "12px",
                      textAlign: "left",
                      color: "#000",
                      transition: "transform 0.2s",
                    }}
                    className="user-box"
                  >
                    <strong style={{ fontSize: "13px" }}>
                      {userInfo.nationality} ({userInfo.count})
                    </strong>
                    <ul style={{ margin: 0, paddingLeft: "18px" }}>
                      {userInfo.usernames.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
              fill="#fff"
            >
              <path d="M0,0 L6,3 L0,6 Z" />
            </marker>
          </defs>
        </g>
      </svg>

      <style>
        {`
          .user-box:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 12px rgba(0,0,0,0.35);
          }
        `}
      </style>
    </div>
  );
}

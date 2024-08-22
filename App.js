import React, { useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const API_URL = 'http://localhost:8000';  // Update this with your actual API URL

const App = () => {
  const [placeName, setPlaceName] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ place_name: placeName }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Real Estate Project Analysis</Title>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          placeholder="Enter place name"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </Form>

      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      {analysis && (
        <div>
          <MainProject project={analysis.main_project} />
          <NearbyProjects projects={analysis.nearby_projects} />
          <Analysis analysis={analysis.analysis} />
        </div>
      )}
    </Container>
  );
};

const MainProject = ({ project }) => (
  <ProjectContainer>
    <ProjectTitle>Main Project: {project.name}</ProjectTitle>
    <ProjectDetail>Coordinates: {project.coordinates.join(', ')}</ProjectDetail>
    <ProjectDetail>Air Quality Index: {project.aqi}</ProjectDetail>
  </ProjectContainer>
);

const NearbyProjects = ({ projects }) => {
  const [expandedProject, setExpandedProject] = useState(null);

  return (
    <ProjectContainer>
      <ProjectTitle>Nearby Projects</ProjectTitle>
      {projects.map((project, index) => (
        <ProjectItem key={index}>
          <ProjectHeader
            onClick={() => setExpandedProject(expandedProject === index ? null : index)}
          >
            <ProjectName>{project.name}</ProjectName>
            <ExpandIcon>{expandedProject === index ? '▲' : '▼'}</ExpandIcon>
          </ProjectHeader>
          {expandedProject === index && (
            <ProjectDetails>
              <ProjectDetail>Distance: {project.distance} m</ProjectDetail>
              <ProjectDetail>Categories: {project.categories}</ProjectDetail>
              <ProjectDetail>Address: {project.address}</ProjectDetail>
              <ProjectDetail>Postcode: {project.postcode}</ProjectDetail>
              <ProjectDetail>Country: {project.country}</ProjectDetail>
              <ProjectDetail>Developer Reputation: {project.developer_reputation}</ProjectDetail>
              <ProjectDetail>Air Quality Index: {project.aqi || 'Unknown'}</ProjectDetail>
              <FacilitiesTitle>Nearby Facilities:</FacilitiesTitle>
              <FacilitiesList>
                {project.facilities && project.facilities.map((facility, i) => (
                  <FacilityItem key={i}>{facility.name} ({facility.distance} m away)</FacilityItem>
                ))}
              </FacilitiesList>
            </ProjectDetails>
          )}
        </ProjectItem>
      ))}
    </ProjectContainer>
  );
};

const Analysis = ({ analysis }) => (
  <AnalysisContainer>
    <ProjectTitle>Analysis</ProjectTitle>
    <ReactMarkdown>{analysis}</ReactMarkdown>
  </AnalysisContainer>
);

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  margin-bottom: 20px;
  display: flex;
`;

const Input = styled.input`
  flex-grow: 1;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffcccc;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ff0000;
  border-radius: 5px;
`;

const ProjectContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
`;

const ProjectTitle = styled.h2`
  margin-bottom: 10px;
  color: #333;
`;

const ProjectDetail = styled.p`
  margin: 5px 0;
  color: #555;
`;

const ProjectItem = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const ProjectName = styled.h3`
  margin: 0;
  color: #333;
`;

const ExpandIcon = styled.span`
  margin-left: 10px;
  color: #007bff;
`;

const ProjectDetails = styled.div`
  margin-top: 10px;
`;

const FacilitiesTitle = styled.h4`
  margin: 10px 0 5px;
  color: #333;
`;

const FacilitiesList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FacilityItem = styled.li`
  margin: 5px 0;
  color: #555;
`;

const AnalysisContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  background-color: #f9f9f9;
`;

export default App;

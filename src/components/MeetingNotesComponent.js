import React, { useState } from 'react';
import axios from 'axios';
import '.././MeetingNotes.css'; // Import CSS file

const MeetingNotesComponent = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [meetingNotes, setMeetingNotes] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await axios.post('http://localhost:8001/audio-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMeetingNotes(response.data.meeting_minutes);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleReadText = () => {
    if (meetingNotes) {
      const utterance = new SpeechSynthesisUtterance(meetingNotes);
      speechSynthesis.speak(utterance);
    }
  };
  

  const renderSection = (section) => {
    if (section.startsWith('Meeting Highlights:') || section.startsWith('Meeting Minutes:')) {
      return <h2 className="section-heading">{section}</h2>;
    } else if (section.startsWith('Actionable Insights:') || section.startsWith('Additional Facts/Insights:')) {
      return <h3 className="insights-heading">{section}</h3>;
    } else if (section.startsWith('TODOs:')) {
      return <h3 className="todos-heading">{section}</h3>;
    } else {
      return <p className="content-item">{section}</p>;
    }
  };

  return (
    <div className="meeting-notes-container">
      <div className="center-container">
        <h1 className="main-heading">Meeting Minutes</h1>
        <div className="file-upload-section">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </div>
      </div>
      {meetingNotes && (
        <div>
          {meetingNotes.split('\n\n').map((section, index) => (
            <div key={index} className="section">
              {renderSection(section)}
            </div>
          ))}
          <button onClick={handleReadText}>Read Text</button>
        </div>
      )}
    </div>
  );
};

export default MeetingNotesComponent;

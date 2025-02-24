import React from 'react';
import styled from 'styled-components';

const SaveScheduleButton = ({ isLoading }) => {
  return (
    <StyledWrapper>
      <button 
        className="button" 
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
            <> 
                <span>Save Schedule</span>
                <svg width={15} height={15} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
            </>
        )}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s linear;
    border-radius: 10px;
    border: 1px solid #F2BED1;
    padding: 10px 20px;
  }

  button > svg {
    margin-left: 5px;
    transition: all 0.4s ease-in;
  }

  button:hover > svg {
    font-size: 1.2em;
    transform: translateX(6px);
  }

  button:hover {
    box-shadow: 10px 10px 40px #d1d1d1;
    transform: translateY(-5px);
  }

  .loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #333;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default SaveScheduleButton;

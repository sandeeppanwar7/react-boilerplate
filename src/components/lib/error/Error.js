import React from 'react';
import { Link } from 'react-router';

const Error = () => {
  return (
    <div id="c_wdt_articleshow_1" className="article-section">
      <div className="error-wrapper">
        <span className="heading-text">Error...</span>
        <div className="sub-heading">
          It may have expired, or there could be a typo. Maybe you can find what you need on our
          homepage.
        </div>
        <Link className="return-btn" to="/">
          RETURN
        </Link>
      </div>
    </div>
  );
};

export default Error;

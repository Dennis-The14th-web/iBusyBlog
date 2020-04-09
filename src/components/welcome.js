import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div>

    { /*Main jumbotron for a primary marketing message or call to action*/ }
    <div className="jumbotron bg-info">
      <h1 className="display-3">Welcome Onboard!</h1>
      <p>iBusy blog is the number one site for movies, tv shows, sports and other lifestyle reviews completely created with the MERN Stack development </p>
      <p><Link className="btn btn-primary btn-lg" to="/posts" role="button">Blog posts &raquo;</Link></p>
    </div>

    { /*Example row of columns*/ }
    <div className="row text-justify">
      <div className="col-md-4">
        <h2>Movie Reviews</h2>
      </div>
      <div className="col-md-4">
       <h2>TV Show Reviews</h2>
      </div>
      <div className="col-md-4">
       <h2>Sports Reviews</h2>
      </div>
    </div>

  </div>
);
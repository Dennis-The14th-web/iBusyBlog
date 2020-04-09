import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div>

    { /*Main jumbotron for a primary marketing message or call to action*/ }
    <div className="jumbotron">
      <h1 className="display-3">Hello!</h1>
      <p>This is a MERN stack based fully functioning blog system. Here, you can share your experience and ideas with other people.</p>
      <p><Link className="btn btn-info btn-lg" to="/posts" role="button">Blog posts &raquo;</Link></p>
    </div>

    { /*Example row of columns*/ }
    <div className="row text-justify">
      <div className="col-md-4">
        <h2>Stretegy</h2>
      </div>
      <div className="col-md-4">
       <h2>Leadership</h2>
      </div>
      <div className="col-md-4">
       <h2>Goal</h2>
      </div>
    </div>

  </div>
);
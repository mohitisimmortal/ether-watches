import React from 'react';
import './homepage.css';
import MenWatches from '../Menwatches/Menwatches';
import NewReleases from '../newreleases/NewReleases';
import Collections from '../collections/Collections';
import CallToAction from '../calltoaction/CallToAction';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate()
  return (
    <>
      <section className='homepage'>
        <div className='homepage-div'>
          <div className="homepage-content">
            <div className="content-wrapper">
              <h4>Embrace Time</h4>
              <h4>Embrace Luxury</h4>
              <button className="globalbtn buynowbtn" onClick={() => { navigate('/watch/653e5836acaa6ac90627c47e') }}>
                Purchase Now
              </button>
            </div>
          </div>
        </div>
      </section>
      <MenWatches />
      <NewReleases />
      <Collections />
      <CallToAction />
    </>
  )
}

export default Homepage;
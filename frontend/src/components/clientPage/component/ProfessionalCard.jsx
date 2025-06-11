import React from 'react';
import { FaUserCircle, FaEnvelope, FaLinkedin } from 'react-icons/fa';

const ProfessionalCard = ({ professional }) => {
  const { name, role, description, image, email, companyName } = professional;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out h-full flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 h-16"></div>
      <figure className="px-10 -mt-8 relative z-10">
        {image ? (
          <img src={image} alt={`Photo of ${name}`} className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg" />
        ) : (
          <div className="rounded-full w-32 h-32 bg-base-200 flex items-center justify-center border-4 border-white shadow-lg">
            <FaUserCircle className="text-6xl text-base-content/30" />
          </div>
        )}
      </figure>
      <div className="card-body items-center text-center flex-grow">
        <h2 className="card-title text-base-content font-bold">{name}</h2>
        <div className="badge badge-primary badge-outline mb-2">{role}</div>
        {companyName && <p className="text-xs text-base-content/60 mb-2">{companyName}</p>}
        <div className="divider my-1"></div>
        <p className="text-base-content/80 text-sm flex-grow">{description}</p>
        <div className="card-actions justify-center mt-4 w-full">
          {email && (
            <a href={`mailto:${email}`} className="btn btn-outline btn-primary btn-sm gap-2 flex-1">
              <FaEnvelope /> <span>Contact</span>
            </a>
          )}
          {/* <button className="btn btn-ghost btn-sm gap-2 flex-1">
            <FaLinkedin className="text-blue-600" /> <span>Profile</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;

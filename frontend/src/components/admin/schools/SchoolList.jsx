import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useSchools from "../../../hooks/useSchools";
import { FaSchool, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const SchoolList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { schools, getSchools, deleteSchool } = useSchools();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        await getSchools();
      } catch (err) {
        setError("Failed to fetch schools");
      } finally {
        setLoading(false);
      }
    };
  
    fetchSchools();
  }, []); // ✅ Runs only once on mount
  

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      try {
        await deleteSchool(id);
        await getSchools(); // Refresh the list
      } catch (err) {
        setError("Failed to delete school");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 animate-pulse bg-gray-200 rounded" />
            <div className="h-8 w-32 animate-pulse bg-gray-200 rounded" />
          </div>
          <div className="w-32 h-10 animate-pulse bg-gray-200 rounded" />
        </div>

        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 animate-pulse bg-gray-200 rounded" />
                <div>
                  <div className="h-5 w-48 animate-pulse bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-32 animate-pulse bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 animate-pulse bg-gray-200 rounded" />
                <div className="w-8 h-8 animate-pulse bg-gray-200 rounded" />
                <div className="w-8 h-8 animate-pulse bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 h-screen">
      {/* <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaSchool className="text-2xl" />
          <h2 className="text-2xl font-bold">Schools</h2>
        </div>
        <Link to="/admin/schools/new" className="btn btn-primary">
          Add New School
        </Link>
      </div> */}

      <div className="divide-y divide-gray-200">
        {schools.map((school) => (
          <div key={school._id} className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {school.logo ? (
                <img
                  src={school.logo}
                  alt={school.name}
                  className="h-16 w-16 object-cover rounded"
                />
              ) : (
                <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded">
                  <FaSchool className="text-3xl text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-medium">{school.name}</h3>
                <p className="text-sm text-gray-600">
                  {school.contact?.address || "No address provided"}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {/* <Link
                to={`/admin/schools/${school._id}`}
                className="btn btn-primary btn-sm"
              >
                <FaEye  /> 
              </Link> */}
              <Link
                to={`/admin/schools/${school._id}`}
                className="btn btn-ghost btn-sm"
              >
                <FaEdit /> 
              </Link>
              {/* <button
                onClick={() => handleDelete(school._id)}
                className="btn btn-error btn-sm"
              >
                <FaTrash  /> 
              </button> */}
            </div>
          </div>
        ))}
      </div>

      {schools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No schools found. Add your first school!</p>
        </div>
      )}
    </div>
  );
};

export default SchoolList;

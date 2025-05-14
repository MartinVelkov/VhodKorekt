import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, Typography } from '@material-tailwind/react';
import { Footer } from '@/widgets/layout';

export function BlogDetailPage() {
  const { id } = useParams(); // Get blog ID from URL params
  const [blog, setBlog] = useState(null); // State to store blog data
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Get the document reference from Firestore
        const blogRef = doc(db, 'blogs', id);
        const blogDoc = await getDoc(blogRef);

        if (blogDoc.exists()) {
          setBlog(blogDoc.data()); // Set the blog data if it exists
        } else {
          setError('Blog not found.');
        }
      } catch (err) {
        setError('Failed to load the blog.');
        console.error('Error fetching blog:', err); // Log the error for debugging
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchBlog();
  }, [id]);

  // Handle loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 pt-32">
        <Typography variant="paragraph" className="text-center">
          Зарежда...
        </Typography>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto py-8 pt-32">
        <Typography variant="paragraph" className="text-center text-red-500">
          {error}
        </Typography>
      </div>
    );
  }

  // Render the blog content if available
  return (
    <div className="container mx-auto py-8 pt-32"> {/* Added padding to prevent hiding */}
      <Card className="w-full max-w-3xl mx-auto p-6 rounded-lg shadow-lg">
        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt="Blog"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <Typography variant="h2" className="text-3xl font-bold mb-4 text-center">
          {blog.heading}
        </Typography>
        <Typography variant="paragraph" className="text-gray-700 text-lg text-justify">
          {blog.text}
        </Typography>
      </Card>
    <div className="bg-white">
        <Footer />
    </div>
    </div>
  );
}

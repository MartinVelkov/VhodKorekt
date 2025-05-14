import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@material-tailwind/react';
import { Footer } from '@/widgets/layout';

export function BlogPage() {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().isAdmin || false);
        }
      }
    };

    if (user) {
      checkAdmin();
      fetchBlogs();
    }
  }, [user]);

  const fetchBlogs = async () => {
    const blogSnapshot = await getDocs(collection(db, 'blogs'));
    const blogList = blogSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(blogList);
    setBlogs(blogList);
  };

  const handleAddBlog = () => {
    navigate('/add-blog'); 
  };

  const handleReadMore = (blogId) => {
    navigate(`/blog/${blogId}`); 
  };

  return (
    <>
 <div className="mt-16">
        <div className="relative flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-center">
          <div className="absolute top-0 left-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center opacity-40" />
          <div className="absolute top-0 left-0 h-full w-full bg-black/60" />
          <div className="relative container mx-auto px-4 py-16 lg:py-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-6 font-bold text-3xl sm:text-4xl lg:text-5xl"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              Блог
            </Typography>
          </div>
        </div>
      </div>
        <section>
          <div className="container mx-auto py-8 pt-32">
            {/* Admin check */}
            {
              isAdmin && (
                <div className="flex justify-end mb-4">
                  <Button
                    color="blue"
                    onClick={handleAddBlog}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors duration-300 shadow-lg"
                  >
                    <span>Добави блог</span>
                  </Button>
                </div>
              )
            }

            {/* Display Blogs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div
                    key={blog.id}  // Use the document ID as the key
                    className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image at the top */}
                    {blog.imageUrl && (
                      <img
                        src={blog.imageUrl}
                        alt="Blog"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}

                    {/* Blog heading */}
                    <h2 className="text-xl font-semibold mb-2">{blog.heading}</h2>

                    {/* Blog text, truncated with 'See More' button if longer than 60 chars */}
                    <p className="text-gray-600">
                      {blog.text && blog.text.length > 60
                        ? blog.text.slice(0, 60) + '...'
                        : blog.text}
                    </p>

                    {/* Button to read the full blog */}
                    <Button
                      color="blue"
                      size="sm"
                      onClick={() => handleReadMore(blog.id)} // Use document ID to navigate to blog detail page
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-transform transform hover:scale-105"
                    >
                      Виж повече
                    </Button>
                  </div>
                ))
              ) : (
                <p>Няма налични статии.</p>
              )}
            </div>
      </div >
      </section>
      <div className="bg-white">
          <Footer />
        </div>
    </>
  );
}

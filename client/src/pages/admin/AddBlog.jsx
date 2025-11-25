import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from '../../assets/Assets.jsx';
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { parse } from "marked"; // Fixed import

const AddBlog = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  // const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {
    if (!title) return toast.error('Please enter a title');

    try {
      setLoading(true);
      const { data } = await axios.post('/api/blog/generate', { prompt: title });
      
      if (data.success) {
        // Fixed: Use marked correctly
        quillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // const onSubmitHandler = async (e) => {
  //   try {
  //     e.preventDefault();
  //     setIsAdding(true);
      
  //     const blog = {
  //       title,
  //       subTitle,
  //       description: quillRef.current.root.innerHTML,
  //       category,
  //       // isPublished
  //     };

  //     const formData = new FormData();
  //     formData.append('blog', JSON.stringify(blog));
  //     formData.append('image', image);

  //     const { data } = await axios.post(`/api/blog/add`, formData);

  //     if (data.success) {
  //       toast.success(data.message);
  //       setImage(false);
  //       setTitle('');
  //       setSubTitle(''); // Added this - it was missing
  //       quillRef.current.root.innerHTML = ''; // Fixed typo: innerHTMl -> innerHTML
  //       setCategory('Startup');
  //       // setIsPublished(false); // Reset checkbox
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   } finally {
  //     setIsAdding(false);
  //   }
  // };

  const onSubmitHandler = async (e) => {
  try {
    e.preventDefault();
    
    // ✅ Validation
    if (!title || !subTitle || !category || !image) {
      return toast.error('Please fill all required fields and upload an image');
    }
    
    if (!quillRef.current || !quillRef.current.root.innerHTML) {
      return toast.error('Please add blog content');
    }
    
    setIsAdding(true);
    
    const formData = new FormData();
    
    // ✅ Append all fields directly (not as JSON)
    formData.append('title', title);
    formData.append('subTitle', subTitle);
    formData.append('description', quillRef.current.root.innerHTML);
    formData.append('category', category);
    formData.append('image', image);

    console.log('📤 Uploading blog:', {
      title,
      subTitle,
      category,
      hasImage: !!image,
      hasDescription: !!quillRef.current.root.innerHTML
    });

    const { data } = await axios.post(`/api/blog/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (data.success) {
      toast.success(data.message);
      // Reset form
      setImage(false);
      setTitle('');
      setSubTitle('');
      quillRef.current.root.innerHTML = '';
      setCategory('Startup');
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setIsAdding(false);
  }
};

  useEffect(() => {
    // Initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { 
        theme: "snow",
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
          ]
        }
      });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-[#112D4E]/1 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-[#112D4E]/1 text-black w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded border">
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt="Upload area"
            className="mt-2 h-16 rounded cursor-pointer border border-[#112D4E]"
          />

          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        <p className="mt-4">Blog Title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-[#112D4E] outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <p className="mt-4">Sub Title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-[#112D4E] outline-none rounded"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative border border-[#112D4E]">
          <div ref={editorRef}></div>
          {loading && (
            <div className="absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2">
              <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
            </div>
          )}
          <button
            disabled={loading}
            type="button"
            onClick={generateContent}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-[#540863] px-4 py-1.5 rounded hover:underline cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        <p className="mt-4">Blog Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          name="category"
          className="flex gap-2 mt-2 px-3 py-2 border text-gray-800 border-[#112D4E] outline-none rounded"
        >
          {blogCategories.filter(cat => cat !== 'All').map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          disabled={isAdding}
          type="submit"
          className="mt-8 w-40 h-10 font-semibold bg-[#540863] text-white hover:scale-105 rounded cursor-pointer text-sm disabled:opacity-50"
        >
          {isAdding ? 'Adding...' : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
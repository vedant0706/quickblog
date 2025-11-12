import React from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { ImCancelCircle } from "react-icons/im";

const BlogTableItem = ({blog, fetchBlogs, index}) => {
    // Safely destructure with defaults
    const {
        title = 'Untitled', 
        createdAt, 
        author, 
        authorId,
        isPublished = false,
        isApproved = false
    } = blog || {};

    const BlogDate = createdAt ? new Date(createdAt) : new Date();

    const {axios, userData, currentUserId} = useAppContext();

    // Check if current user can edit this blog
    const canEdit = () => {
        if (!userData || !blog) return false;
        
        // Admin can edit all blogs
        if (userData.role === 'admin') return true;
        
        // Regular users can only edit their own blogs
        const blogAuthorId = authorId?._id || authorId;
        const userId = currentUserId || userData._id;
        
        // Convert both to strings for comparison
        return String(blogAuthorId) === String(userId);
    };

    const deleteBlog = async () => {
        if (!canEdit()) {
            toast.error('You do not have permission to delete this blog');
            return;
        }

        const confirm = window.confirm('Are you sure, you want to delete this blog?')
        if(!confirm) return;
        
        try {
            const { data } = await axios.post('/api/blog/delete', {id: blog._id}) 
            if(data.success){
                toast.success(data.message)
                await fetchBlogs()
            } else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const togglePublish = async () => {
        if (!canEdit()) {
            toast.error('You do not have permission to publish/unpublish this blog');
            return;
        }

        try {
            const {data} = await axios.post('/api/blog/toggle-publish', {id: blog._id})
            if(data.success){
                toast.success(data.message)
                await fetchBlogs()
            } else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)   
        }
    }

    // Get blog status badge
    const getStatusBadge = () => {
        if (isPublished && isApproved) {
            return <span className="text-green-600 font-semibold">✓ Published</span>;
        }
        if (!isApproved) {
            return <span className="text-orange-600 font-semibold">⏳ Pending Approval</span>;
        }
        if (!isPublished) {
            return <span className="text-gray-600 font-semibold">📝 Draft</span>;
        }
        return <span className="text-gray-600">Unknown</span>;
    };

    // Show author name for admin view
    const authorName = authorId?.name || author?.name || 'Unknown Author';

    // If blog is null or undefined, show loading state
    if (!blog) {
        return (
            <tr className='border-y border-gray-300'>
                <td colSpan="5" className="px-2 py-4 text-center text-gray-500">
                    Loading...
                </td>
            </tr>
        );
    }

    return (
        <tr className='border-y border-gray-300'>
            <th className='px-2 py-4 text-zinc-700'>{index}</th>
            <td className='px-2 py-4 text-zinc-700'>
                <div>
                    <p className="font-medium">{title}</p>
                    {userData?.role === 'admin' && (
                        <p className='text-xs text-gray-500 mt-1'>By: {authorName}</p>
                    )}
                </div>
            </td>
            <td className='px-2 py-4 max-sm:hidden text-zinc-700'>
                {BlogDate.toDateString()}
            </td>
            <td className='px-2 py-4 max-sm:hidden'>
                {getStatusBadge()}
            </td>
            <td className='px-2 py-4 text-xs'>
                {canEdit() ? (
                    <div className="flex items-center gap-3">
                        {/* Only admins can see publish button */}
                        {userData?.role === 'admin' && (
                            <button 
                                onClick={togglePublish} 
                                className={`border px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                                    isPublished 
                                        ? 'border-red-500 text-red-700 hover:bg-red-600/30' 
                                        : 'border-green-500 text-green-700 hover:bg-green-500/30'
                                }`}
                            >
                                {isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                        )}
                        
                        {/* Users see status message instead of publish button */}
                        {userData?.role !== 'admin' && !isApproved && (
                            <span className="text-xs text-orange-600 italic whitespace-nowrap">
                                Awaiting approval
                            </span>
                        )}
                        
                        {/* Delete button */}
                        <button
                            onClick={deleteBlog} 
                            title="Delete blog"
                            className='hover:scale-110 transition-all cursor-pointer'
                        >  
                            <span className='text-xl text-red-500'>
                                <ImCancelCircle />
                            </span>
                        </button>
                    </div>
                ) : (
                    <span className='text-gray-400 text-xs'>View Only</span>
                )}
            </td>
        </tr>
    )
}   

export default BlogTableItem